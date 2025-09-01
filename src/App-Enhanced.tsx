import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Button, 
  Card, 
  Badge,
  SimpleFooter,
  JsonEditor,
  ClipboardIcon,
  FileIcon,
  DownloadIcon,
  CheckIcon,
  FormatIcon,
  CompressIcon,
  TrashIcon,
  RepairIcon,
  UndoIcon,
  RedoIcon,
  PlusIcon,
  MinusIcon
} from '@/components';
import { cn } from '@/utils/cn';

const App: React.FC = () => {
  // Core state
  const [inputJson, setInputJson] = useState('{\n  "Array": [1, 2, 3],\n  "Boolean": true,\n  "Null": null,\n  "Number": 123,\n  "Object": {\n    "a": "b",\n    "c": "d"\n  },\n  "String": "Hello World"\n}');
  const [outputJson, setOutputJson] = useState('');
  
  // UI state
  const [fontSize, setFontSize] = useState(14);
  const [indentSize] = useState(2);
  const [theme] = useState<'light' | 'dark'>('dark');
  
  // Features state
  const [liveMode] = useState(true);
  const [showLineNumbers] = useState(true);
  const [wordWrap] = useState(true);
  const [minimap] = useState(false);
  
  // Validation state
  const [error, setError] = useState<string | null>(null);
  const [isValidJson, setIsValidJson] = useState(false);
  const [fixedIssues, setFixedIssues] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  
  // History for undo/redo
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Editor reference
  const editorRef = useRef<any>(null);

  // Translate error messages to Korean
  const translateError = (errorMessage: string): string => {
    const translations: { [key: string]: string } = {
      'Unexpected token': '예상치 못한 토큰',
      'Unexpected end of JSON input': 'JSON 입력이 예상치 않게 끝났습니다',
      'Unexpected string': '예상치 못한 문자열',
      'Unexpected number': '예상치 못한 숫자',
      'Expected property name or': '속성 이름이 필요합니다',
      'JSON.parse': 'JSON 파싱 오류',
      'is not valid JSON': '는 올바른 JSON이 아닙니다',
      'Unterminated string': '종료되지 않은 문자열',
      'Expected': '예상됨',
      'after': '다음 위치',
      'at position': '위치',
      'at line': '줄',
      'column': '열',
      'but got': '하지만 발견됨',
      'Trailing comma': '후행 쉼표',
      'Duplicate key': '중복된 키',
      'Invalid escape sequence': '잘못된 이스케이프 시퀀스',
      'Bad control character': '잘못된 제어 문자',
      'Bad Unicode escape': '잘못된 유니코드 이스케이프',
    };

    let translated = errorMessage;
    
    // Replace common patterns
    translated = translated.replace(/Unexpected token '(.+?)'/g, "'$1' 예상치 못한 토큰");
    translated = translated.replace(/Unexpected token (.+?) in JSON at position (\d+)/g, "위치 $2에서 예상치 못한 토큰 '$1'");
    translated = translated.replace(/Expected '(.+?)' after/g, "'$1'이(가) 필요합니다");
    translated = translated.replace(/JSON at position (\d+)/g, "JSON 위치 $1");
    translated = translated.replace(/line (\d+)/gi, "$1번째 줄");
    translated = translated.replace(/column (\d+)/gi, "$1번째 열");
    
    // Translate known phrases
    Object.entries(translations).forEach(([eng, kor]) => {
      const regex = new RegExp(eng, 'gi');
      translated = translated.replace(regex, kor);
    });
    
    return translated;
  };

  // Parse JSON and update state
  const parseJson = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json);
      setIsValidJson(true);
      setError(null);
      return parsed;
    } catch (e) {
      setIsValidJson(false);
      setError(translateError((e as Error).message));
      return null;
    }
  }, []);

  // Format JSON with indentation
  const formatJson = useCallback(() => {
    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutputJson(formatted);
      setInputJson(formatted);
      addToHistory(formatted);
      setError(null);
      setIsValidJson(true);
      setFixedIssues([]);
    } catch (e) {
      setError(`잘못된 JSON: ${translateError((e as Error).message)}`);
      setIsValidJson(false);
    }
  }, [inputJson, indentSize]);

  // Compact/minify JSON
  const compactJson = useCallback(() => {
    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setOutputJson(minified);
      setInputJson(minified);
      addToHistory(minified);
      setError(null);
      setIsValidJson(true);
    } catch (e) {
      setError(`잘못된 JSON: ${translateError((e as Error).message)}`);
      setIsValidJson(false);
    }
  }, [inputJson]);

  // Repair JSON (auto-fix common issues)
  const repairJson = useCallback(() => {
    let fixedJson = inputJson;
    const issues: string[] = [];

    // Try simple parse first
    try {
      const parsed = JSON.parse(fixedJson);
      setOutputJson(JSON.stringify(parsed, null, indentSize));
      setError(null);
      setIsValidJson(true);
      setFixedIssues([]);
      return;
    } catch (initialError) {
      console.log('Initial parsing failed, attempting repairs...', initialError);
    }

    // Remove comments
    fixedJson = fixedJson.replace(/\/\/.*$/gm, '');
    fixedJson = fixedJson.replace(/\/\*[\s\S]*?\*\//g, '');
    if (fixedJson !== inputJson) issues.push('주석 제거됨');

    // Fix trailing commas
    fixedJson = fixedJson.replace(/,(\s*[}\]])/g, '$1');
    if (fixedJson !== inputJson) issues.push('후행 쉼표 수정됨');

    // Convert single quotes to double quotes
    fixedJson = fixedJson.replace(/'([^']+)'\s*:/g, '"$1":');
    fixedJson = fixedJson.replace(/:\s*'([^']*)'/g, ': "$1"');
    if (fixedJson.includes('"') && inputJson.includes("'")) {
      issues.push('작은따옴표를 큰따옴표로 변경됨');
    }

    // Add quotes to unquoted keys
    fixedJson = fixedJson.replace(/(\{|,)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
    fixedJson = fixedJson.replace(/^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/gm, '"$1":');

    // Convert JavaScript values to JSON
    fixedJson = fixedJson.replace(/:\s*undefined/gi, ': null');
    fixedJson = fixedJson.replace(/:\s*NaN/g, ': null');
    fixedJson = fixedJson.replace(/:\s*Infinity/gi, ': null');

    // Fix missing commas
    fixedJson = fixedJson.replace(/(\d|true|false|null)\s*\n\s*"/g, '$1,\n"');
    fixedJson = fixedJson.replace(/"([^"]*)"(\s*)"([^"]*)"\s*:/g, '"$1",$2"$3":');
    fixedJson = fixedJson.replace(/(\}|\])(\s*)"([^"]*)"\s*:/g, '$1,$2"$3":');

    try {
      const parsed = JSON.parse(fixedJson);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutputJson(formatted);
      setInputJson(formatted);
      addToHistory(formatted);
      setError(null);
      setIsValidJson(true);
      setFixedIssues(issues.length > 0 ? issues : ['JSON이 성공적으로 수정되었습니다']);
    } catch (finalError) {
      setError(`JSON 수정 실패: ${translateError((finalError as Error).message)}`);
      setIsValidJson(false);
      setFixedIssues([]);
    }
  }, [inputJson, indentSize]);

  // Add to history for undo/redo
  const addToHistory = (json: string) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), json]);
    setHistoryIndex(prev => prev + 1);
  };

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setInputJson(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setInputJson(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  // Clear all
  const clearAll = useCallback(() => {
    setInputJson('');
    setOutputJson('');
    setError(null);
    setIsValidJson(false);
    setFixedIssues([]);
    setFileName('');
    setHistory([]);
    setHistoryIndex(-1);
  }, []);


  // Handle file upload
  const handleFileLoad = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInputJson(content);
        parseJson(content);
        if (liveMode) {
          try {
            const parsed = JSON.parse(content);
            const formatted = JSON.stringify(parsed, null, indentSize);
            setOutputJson(formatted);
          } catch (err) {
            // Keep original if not valid
          }
        }
      };
      reader.readAsText(file);
    }
  }, [parseJson, liveMode, indentSize]);

  // Download JSON
  const downloadJson = useCallback(() => {
    const blob = new Blob([outputJson || inputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ? `formatted_${fileName}` : 'output.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [outputJson, inputJson, fileName]);


  // Handle error click to jump to error position
  const handleErrorClick = useCallback(() => {
    if (!error || !editorRef.current) return;
    
    console.log('Error message:', error); // 디버깅용
    
    // Try to extract line and column from error message (both English and Korean)
    const lineMatchEng = error.match(/line (\d+)/i);
    const lineMatchKor = error.match(/(\d+)번째 줄/);
    const columnMatchEng = error.match(/column (\d+)/i);
    const columnMatchKor = error.match(/(\d+)번째 열/);
    const positionMatchEng = error.match(/position (\d+)/i);
    const positionMatchKor = error.match(/위치 (\d+)/);
    
    // Also check for pattern like "(111번째 줄 33번째 열)"
    const parenthesisMatch = error.match(/\((\d+)번째 줄 (\d+)번째 열\)/);
    if (parenthesisMatch) {
      const line = parseInt(parenthesisMatch[1]);
      const column = parseInt(parenthesisMatch[2]);
      console.log('Found position in parenthesis:', line, column); // 디버깅용
      editorRef.current.setPosition({ lineNumber: line, column: column });
      editorRef.current.revealPositionInCenter({ lineNumber: line, column: column });
      editorRef.current.focus();
      return;
    }
    
    const lineMatch = lineMatchEng || lineMatchKor;
    const columnMatch = columnMatchEng || columnMatchKor;
    const positionMatch = positionMatchEng || positionMatchKor;
    
    if (lineMatch || columnMatch || positionMatch) {
      const line = lineMatch ? parseInt(lineMatch[1]) : 1;
      const column = columnMatch ? parseInt(columnMatch[1]) : 1;
      
      // If only position is available, calculate line and column
      if (!lineMatch && positionMatch) {
        const position = parseInt(positionMatch[1]);
        const lines = inputJson.substring(0, position).split('\n');
        const calcLine = lines.length;
        const calcColumn = lines[lines.length - 1].length + 1;
        
        console.log('Jumping to calculated position:', calcLine, calcColumn); // 디버깅용
        editorRef.current.setPosition({ lineNumber: calcLine, column: calcColumn });
        editorRef.current.revealPositionInCenter({ lineNumber: calcLine, column: calcColumn });
      } else {
        console.log('Jumping to position:', line, column); // 디버깅용
        editorRef.current.setPosition({ lineNumber: line, column: column });
        editorRef.current.revealPositionInCenter({ lineNumber: line, column: column });
      }
      
      editorRef.current.focus();
    } else {
      console.log('No position found in error message'); // 디버깅용
    }
  }, [error, inputJson]);

  // Live mode effect
  useEffect(() => {
    if (liveMode && inputJson) {
      const parsed = parseJson(inputJson);
      if (parsed) {
        const formatted = JSON.stringify(parsed, null, indentSize);
        setOutputJson(formatted);
      } else {
        setOutputJson('');
      }
    }
  }, [inputJson, liveMode, parseJson, indentSize]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'i':
            e.preventDefault();
            formatJson();
            break;
          case 'I':
            if (e.shiftKey) {
              e.preventDefault();
              compactJson();
            }
            break;
          case 'z':
            e.preventDefault();
            undo();
            break;
          case 'Z':
            if (e.shiftKey) {
              e.preventDefault();
              redo();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formatJson, compactJson, undo, redo]);

  return (
    <div className={cn("min-h-screen flex flex-col", theme === 'dark' ? 'dark bg-background-primary' : 'bg-gray-50')}>
      {/* Header */}
      <header className="border-b border-border-primary bg-background-secondary/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-text-primary">AIFI JSON 에디터</h1>
              {fileName && (
                <Badge variant="info" className="font-mono text-xs">
                  {fileName}
                </Badge>
              )}
            </div>
            
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b border-border-primary bg-background-secondary/30">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-5 w-px bg-border-primary" />

              {/* JSON operations */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="secondary" 
                  size="xs"
                  onClick={formatJson}
                  disabled={!inputJson}
                  title="JSON 정렬 (Ctrl+I)"
                >
                  <FormatIcon size={14} className="inline mr-1" />
                  정렬
                </Button>

                <Button 
                  variant="secondary" 
                  size="xs"
                  onClick={compactJson}
                  disabled={!inputJson}
                  title="JSON 압축 (Ctrl+Shift+I)"
                >
                  <CompressIcon size={14} className="inline mr-1" />
                  압축
                </Button>


                <Button 
                  variant="success" 
                  size="xs"
                  onClick={repairJson}
                  disabled={!inputJson}
                  title="JSON 오류 자동 수정"
                >
                  <RepairIcon size={14} className="inline mr-1" />
                  자동 수정
                </Button>
              </div>

              <div className="h-5 w-px bg-border-primary" />

              {/* Edit operations */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="xs"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  title="실행 취소 (Ctrl+Z)"
                >
                  <UndoIcon size={14} className="inline mr-1" />
                  실행취소
                </Button>

                <Button 
                  variant="ghost" 
                  size="xs"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  title="다시 실행 (Ctrl+Shift+Z)"
                >
                  <RedoIcon size={14} className="inline mr-1" />
                  다시실행
                </Button>

                <Button 
                  variant="ghost" 
                  size="xs"
                  onClick={clearAll}
                  title="모두 지우기"
                >
                  <TrashIcon size={14} className="inline mr-1" />
                  지우기
                </Button>
              </div>

              <div className="h-5 w-px bg-border-primary" />

              {/* Settings */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="xs"
                    onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                    className="border border-border-primary"
                  >
                    <MinusIcon size={14} />
                  </Button>
                  <span className="text-xs text-text-tertiary w-10 text-center">{fontSize}</span>
                  <Button 
                    variant="ghost" 
                    size="xs"
                    onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                    className="border border-border-primary"
                  >
                    <PlusIcon size={14} />
                  </Button>
                </div>
              </div>
            </div>

            {/* File operations on the right */}
            <div className="flex items-center gap-2">
              <Button 
                variant="danger" 
                size="xs"
                onClick={async () => {
                  try {
                    // 먼저 클립보드 권한 확인
                    if (navigator.clipboard && navigator.clipboard.readText) {
                      const text = await navigator.clipboard.readText();
                      setInputJson(text);
                      parseJson(text);
                      setError(null);
                      
                      // 자동으로 유효성 검사
                      try {
                        const parsed = JSON.parse(text);
                        setIsValidJson(true);
                        setOutputJson(JSON.stringify(parsed, null, indentSize));
                      } catch {
                        setIsValidJson(false);
                      }
                    } else {
                      // 클립보드 API를 사용할 수 없는 경우 fallback
                      const textarea = document.createElement('textarea');
                      textarea.style.position = 'fixed';
                      textarea.style.opacity = '0';
                      document.body.appendChild(textarea);
                      textarea.focus();
                      document.execCommand('paste');
                      const text = textarea.value;
                      document.body.removeChild(textarea);
                      
                      if (text) {
                        setInputJson(text);
                        parseJson(text);
                      } else {
                        // 대체 방법: 프롬프트 사용
                        const pastedText = prompt('JSON 텍스트를 붙여넣으세요:');
                        if (pastedText) {
                          setInputJson(pastedText);
                          parseJson(pastedText);
                        }
                      }
                    }
                  } catch (err) {
                    // 클립보드 접근 실패 시 프롬프트 사용
                    const pastedText = prompt('JSON 텍스트를 붙여넣으세요 (Ctrl+V 또는 Cmd+V):');
                    if (pastedText) {
                      setInputJson(pastedText);
                      parseJson(pastedText);
                    }
                  }
                }}
                title="클립보드에서 붙여넣기 (권한이 필요할 수 있습니다)"
              >
                <ClipboardIcon size={16} className="inline mr-1.5" />
                자동복붙
              </Button>
              
              <label htmlFor="fileInput" className="cursor-pointer">
                <Button variant="primary" size="xs" as="span">
                  <FileIcon size={16} className="inline mr-1.5" />
                  파일 열기
                </Button>
              </label>
              <input
                type="file"
                id="fileInput"
                accept=".json,.txt"
                className="hidden"
                onChange={handleFileLoad}
              />
              
              <Button 
                variant="primary" 
                size="xs"
                onClick={downloadJson}
                disabled={!inputJson && !outputJson}
              >
                <DownloadIcon size={16} className="inline mr-1.5" />
                다운로드
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      {(error || fixedIssues.length > 0) && (
        <div className="container mx-auto px-4 py-2">
          {error ? (
            <div 
              className="bg-yellow-300 border border-red-500 rounded p-3 cursor-pointer hover:bg-yellow-400 transition-colors"
              onClick={handleErrorClick}
              title="클릭하여 오류 위치로 이동"
            >
              <span className="text-red-600 font-semibold text-sm">❌ 오류: {error}</span>
            </div>
          ) : fixedIssues.length > 0 && (
            <div className="bg-status-successLight border border-status-success/30 rounded p-3">
              <span className="text-status-success text-sm">
                ✅ 수정된 항목: {fixedIssues.join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-4">
        <div className="h-full">
          {/* Single panel */}
          <Card variant="elevated" className="overflow-hidden h-full">
            <div className="border-b border-border-primary p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant={isValidJson ? 'success' : 'ghost'}
                    size="xs"
                    disabled
                  >
                    {isValidJson ? '✓ 유효' : '✗ 오류'}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="h-[600px] overflow-hidden">
              <JsonEditor
                value={inputJson}
                onChange={setInputJson}
                fontSize={fontSize}
                theme={theme}
                height="100%"
                showLineNumbers={showLineNumbers}
                wordWrap={wordWrap}
                minimap={minimap}
                editorRef={editorRef}
              />
            </div>
            
            <div className="border-t border-border-primary p-2 bg-background-secondary/30">
              <div className="flex items-center justify-between text-xs text-text-quaternary">
                <span>줄 수: {inputJson.split('\n').length}</span>
                <span>크기: {new Blob([inputJson]).size} bytes</span>
                <span className={cn(
                  "flex items-center gap-1",
                  isValidJson ? "text-status-success" : inputJson ? "text-status-warning" : ""
                )}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {isValidJson ? '유효' : inputJson ? '오류' : '비어있음'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-primary bg-background-secondary/30 mt-auto">
        <SimpleFooter
          text="© 2025 JSON Editor - made by Haruoff"
          links={[]}
        />
      </footer>
    </div>
  );
};

export default App;