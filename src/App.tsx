import React, { useState, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Button, 
  Card, 
  CardContent, 
  Badge,
  SimpleFooter
} from '@/components';
import { cn } from '@/utils/cn';

const App: React.FC = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fixedIssues, setFixedIssues] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState(14);
  const [isValidJson, setIsValidJson] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState<{ input: boolean; output: boolean }>({ input: false, output: false });

  // JSON 자동 수정 함수 - 더 강력하게 개선
  const autoFixJson = useCallback(() => {
    if (!inputJson.trim()) {
      setError('입력된 JSON이 없습니다.');
      return;
    }

    let fixedJson = inputJson;
    const issues: string[] = [];

    // 먼저 간단한 파싱 시도
    try {
      const parsed = JSON.parse(fixedJson);
      setOutputJson(JSON.stringify(parsed, null, 2));
      setError(null);
      setIsValidJson(true);
      setFixedIssues([]);
      return;
    } catch (initialError) {
      console.log('Initial parsing failed, attempting fixes...', initialError);
    }

    // 1. BOM 제거
    if (fixedJson.charCodeAt(0) === 0xFEFF) {
      fixedJson = fixedJson.slice(1);
      issues.push('BOM 문자 제거');
    }

    // 2. 주석 제거 (먼저 수행)
    const originalLength = fixedJson.length;
    // 한 줄 주석 제거
    fixedJson = fixedJson.replace(/\/\/.*$/gm, '');
    // 여러 줄 주석 제거
    fixedJson = fixedJson.replace(/\/\*[\s\S]*?\*\//g, '');
    if (fixedJson.length !== originalLength) {
      issues.push('주석 제거');
    }

    // 3. 후행 쉼표 제거
    let prevJson = '';
    while (prevJson !== fixedJson) {
      prevJson = fixedJson;
      fixedJson = fixedJson.replace(/,(\s*[}\]])/g, '$1');
    }
    if (prevJson !== inputJson) {
      issues.push('후행 쉼표 제거');
    }

    // 4. 작은따옴표를 큰따옴표로 변환 (키와 값 모두) - 개선된 버전
    // JSON 문자열 내부가 아닌 곳의 작은따옴표만 처리
    // 키의 작은따옴표 처리
    fixedJson = fixedJson.replace(/'([^']+)'\s*:/g, '"$1":');
    // 값의 작은따옴표 처리 (문자열 값)
    fixedJson = fixedJson.replace(/:\s*'([^']*)'/g, ': "$1"');
    // 배열 내 작은따옴표 문자열
    fixedJson = fixedJson.replace(/\[\s*'([^']*)'\s*\]/g, '["$1"]');
    fixedJson = fixedJson.replace(/,\s*'([^']*)'\s*([,\]])/g, ', "$1"$2');
    if (fixedJson.includes('"') && inputJson.includes("'")) {
      issues.push('작은따옴표를 큰따옴표로 변환');
    }

    // 5. 따옴표 없는 키에 따옴표 추가 - 더 정확한 패턴
    // 객체 시작 또는 쉼표 뒤의 키
    fixedJson = fixedJson.replace(/(\{|,)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
    // 줄 시작 부분의 키 (들여쓰기 포함)
    fixedJson = fixedJson.replace(/^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/gm, '"$1":');
    if (!issues.includes('따옴표 없는 키에 따옴표 추가') && fixedJson !== inputJson) {
      issues.push('따옴표 없는 키에 따옴표 추가');
    }

    // 6. 누락된 쉼표 추가
    // 숫자나 boolean 뒤에 따옴표가 오는 경우
    fixedJson = fixedJson.replace(/(\d|true|false|null)\s*\n\s*"/g, '$1,\n"');
    // 문자열 뒤에 따옴표가 오는 경우
    fixedJson = fixedJson.replace(/"([^"]*)"(\s*)"([^"]*)"\s*:/g, '"$1",$2"$3":');
    // 객체나 배열 뒤에 따옴표가 오는 경우
    fixedJson = fixedJson.replace(/(\}|\])(\s*)"([^"]*)"\s*:/g, '$1,$2"$3":');
    // 중괄호 사이
    fixedJson = fixedJson.replace(/\}(\s*)\{/g, '},$1{');
    if (!issues.includes('누락된 쉼표 추가') && fixedJson !== inputJson) {
      issues.push('누락된 쉼표 추가');
    }

    // 7. JavaScript 값들을 JSON 호환 값으로 변환
    fixedJson = fixedJson.replace(/:\s*undefined/gi, ': null');
    fixedJson = fixedJson.replace(/:\s*NaN/g, ': null');
    fixedJson = fixedJson.replace(/:\s*Infinity/gi, ': null');
    fixedJson = fixedJson.replace(/:\s*-Infinity/gi, ': null');
    if (fixedJson.includes('null') && (inputJson.includes('undefined') || inputJson.includes('NaN') || inputJson.includes('Infinity'))) {
      issues.push('JavaScript 값을 null로 변환');
    }

    // 8. 빈 값 처리
    fixedJson = fixedJson.replace(/:\s*,/g, ': null,');
    fixedJson = fixedJson.replace(/:\s*\}/g, ': null}');
    fixedJson = fixedJson.replace(/:\s*\]/g, ': null]');

    // 9. 이스케이프되지 않은 문자열 내 따옴표 처리
    // 문자열 내의 따옴표를 이스케이프
    fixedJson = fixedJson.replace(/"([^"]*)"(\s*:)/g, (match, p1, p2) => {
      const escaped = p1.replace(/(?<!\\)"/g, '\\"');
      return `"${escaped}"${p2}`;
    });

    // 10. 중괄호/대괄호 균형 맞추기
    let openBraces = (fixedJson.match(/\{/g) || []).length;
    let closeBraces = (fixedJson.match(/\}/g) || []).length;
    let openBrackets = (fixedJson.match(/\[/g) || []).length;
    let closeBrackets = (fixedJson.match(/\]/g) || []).length;

    // 닫는 괄호가 더 많으면 앞에서부터 제거
    while (closeBraces > openBraces) {
      fixedJson = fixedJson.replace(/\}(?!.*\})/, '');
      closeBraces--;
      issues.push('불필요한 닫는 중괄호 제거');
    }
    while (closeBrackets > openBrackets) {
      fixedJson = fixedJson.replace(/\](?!.*\])/, '');
      closeBrackets--;
      issues.push('불필요한 닫는 대괄호 제거');
    }

    // 여는 괄호가 더 많으면 끝에 추가
    if (openBraces > closeBraces) {
      fixedJson += '}'.repeat(openBraces - closeBraces);
      issues.push(`누락된 닫는 중괄호 ${openBraces - closeBraces}개 추가`);
    }
    if (openBrackets > closeBrackets) {
      fixedJson += ']'.repeat(openBrackets - closeBrackets);
      issues.push(`누락된 닫는 대괄호 ${openBrackets - closeBrackets}개 추가`);
    }

    // 11. 줄바꿈 문자 정리
    fixedJson = fixedJson.replace(/\r\n/g, '\n');
    fixedJson = fixedJson.replace(/\r/g, '\n');

    // 12. 특수 케이스 처리
    // Python 딕셔너리 스타일 수정
    fixedJson = fixedJson.replace(/None/g, 'null');
    fixedJson = fixedJson.replace(/True/g, 'true');
    fixedJson = fixedJson.replace(/False/g, 'false');
    
    // 13. 배열 내 객체 사이 쉼표 추가
    fixedJson = fixedJson.replace(/\}\s*\{/g, '},{');
    fixedJson = fixedJson.replace(/\]\s*\[/g, '],[');
    fixedJson = fixedJson.replace(/"\s*"/g, '","');
    fixedJson = fixedJson.replace(/\}\s*"/g, '},"');
    fixedJson = fixedJson.replace(/"\s*\{/g, '",{');
    fixedJson = fixedJson.replace(/\]\s*"/g, '],"');
    fixedJson = fixedJson.replace(/"\s*\[/g, '",[');
    
    // 14. 마지막 시도: 파싱 및 포맷팅
    try {
      const parsed = JSON.parse(fixedJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutputJson(formatted);
      setError(null);
      setIsValidJson(true);
      setFixedIssues(issues.length > 0 ? issues : ['JSON 포맷팅 완료']);
    } catch (finalError) {
      // 그래도 실패하면 더 공격적인 수정 시도
      try {
        // 구조적 문제 해결 시도
        let restructured = fixedJson;
        
        // 배열인지 객체인지 판단
        const trimmed = restructured.trim();
        const isArray = trimmed.startsWith('[') || trimmed.match(/^\d/) || trimmed.includes('"breakdown_data"');
        const isObject = trimmed.startsWith('{') || trimmed.includes(':');
        
        // 래핑이 필요한 경우
        if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
          if (isArray || trimmed.includes(',')) {
            restructured = '[' + restructured + ']';
            issues.push('배열로 래핑');
          } else if (isObject) {
            restructured = '{' + restructured + '}';
            issues.push('객체로 래핑');
          }
        }
        
        // 모든 공백 정규화
        restructured = restructured.replace(/\s+/g, ' ').trim();
        
        // 잘못된 이스케이프 시퀀스 수정
        restructured = restructured.replace(/\\x/g, '\\u00');
        
        // 다시 파싱 시도
        const parsed = JSON.parse(restructured);
        const formatted = JSON.stringify(parsed, null, 2);
        setOutputJson(formatted);
        setError(null);
        setIsValidJson(true);
        issues.push('구조 재구성 및 포맷팅');
        setFixedIssues(issues);
      } catch (lastError) {
        // 최종 실패 시 부분 수정된 결과라도 보여주기
        if (fixedJson !== inputJson) {
          setOutputJson(fixedJson);
          setError(`부분 수정 완료. 수동 수정 필요: ${(lastError as Error).message}`);
          setFixedIssues([...issues, '부분 수정 완료 (수동 수정 필요)']);
        } else {
          setError(`자동 수정 실패: ${(lastError as Error).message}`);
          setIsValidJson(false);
          setFixedIssues([]);
          setOutputJson('');
        }
      }
    }
  }, [inputJson]);

  const formatJson = useCallback(() => {
    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutputJson(formatted);
      setError(null);
      setIsValidJson(true);
      setFixedIssues([]);
    } catch (e) {
      setError(`유효하지 않은 JSON: ${(e as Error).message}`);
      setIsValidJson(false);
      setOutputJson('');
    }
  }, [inputJson]);

  const minifyJson = useCallback(() => {
    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setOutputJson(minified);
      setError(null);
      setIsValidJson(true);
      setFixedIssues([]);
    } catch (e) {
      setError(`유효하지 않은 JSON: ${(e as Error).message}`);
      setIsValidJson(false);
    }
  }, [inputJson]);

  const clearAll = useCallback(() => {
    setInputJson('');
    setOutputJson('');
    setError(null);
    setIsValidJson(false);
    setFixedIssues([]);
    setFileName('');
  }, []);

  const copyToClipboard = useCallback((text: string, type: 'input' | 'output') => {
    // 방법 1: textarea를 이용한 복사 (가장 호환성이 좋음)
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '0';
    textArea.style.top = '0';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    let success = false;
    
    try {
      success = document.execCommand('copy');
      if (success) {
        console.log('복사 성공!');
        // 복사 성공 시 상태 업데이트
        setCopyStatus(prev => ({ ...prev, [type]: true }));
        // 2초 후 상태 초기화
        setTimeout(() => {
          setCopyStatus(prev => ({ ...prev, [type]: false }));
        }, 2000);
      }
    } catch (err) {
      console.error('복사 실패:', err);
    }
    
    document.body.removeChild(textArea);
    
    // 방법 2: Clipboard API 시도 (최신 브라우저)
    if (!success && navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log('Clipboard API로 복사 성공!');
          setCopyStatus(prev => ({ ...prev, [type]: true }));
          setTimeout(() => {
            setCopyStatus(prev => ({ ...prev, [type]: false }));
          }, 2000);
        })
        .catch(err => {
          console.error('Clipboard API 복사 실패:', err);
          alert('복사에 실패했습니다. Ctrl+C(또는 Cmd+C)를 사용해주세요.');
        });
    }
  }, []);

  const handleFileLoad = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInputJson(content);
        setError(null);
        setFixedIssues([]);
        setOutputJson('');
        
        // 파일 로드 후 자동으로 유효성 검사
        try {
          const parsed = JSON.parse(content);
          setIsValidJson(true);
          const formatted = JSON.stringify(parsed, null, 2);
          setOutputJson(formatted);
        } catch (err) {
          setIsValidJson(false);
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const downloadJson = useCallback(() => {
    const blob = new Blob([outputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ? `fixed_${fileName}` : 'fixed.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [outputJson, fileName]);

  // Input이 변경될 때마다 유효성 검사
  useEffect(() => {
    if (inputJson) {
      try {
        JSON.parse(inputJson);
        setIsValidJson(true);
      } catch {
        setIsValidJson(false);
      }
    } else {
      setIsValidJson(false);
    }
  }, [inputJson]);

  return (
    <div className="min-h-screen bg-background-primary flex flex-col">
      {/* Header */}
      <header className="border-b border-border-primary bg-background-secondary/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                JSON 에디터
              </h1>
              <p className="text-sm text-text-tertiary mt-1">
                JSON 파일 업로드, 검증, 자동 수정
              </p>
            </div>
            {fileName && (
              <Badge variant="info" className="font-mono">
                {fileName}
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b border-border-primary bg-background-secondary/30 backdrop-blur-md">
        <div className="container mx-auto px-6 py-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="danger" 
                size="sm"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setInputJson(text);
                    setError(null);
                    setFixedIssues([]);
                    setOutputJson('');
                    
                    // 붙여넣기 후 자동으로 유효성 검사
                    try {
                      const parsed = JSON.parse(text);
                      setIsValidJson(true);
                      const formatted = JSON.stringify(parsed, null, 2);
                      setOutputJson(formatted);
                    } catch (err) {
                      setIsValidJson(false);
                    }
                  } catch (err) {
                    setError('클립보드에서 텍스트를 읽을 수 없습니다.');
                  }
                }}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
              >
                자동복붙
              </Button>
              
              <label htmlFor="fileInput" className="cursor-pointer">
                <Button variant="primary" size="sm" as="span">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  업로드
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
                variant="success" 
                size="sm"
                onClick={autoFixJson}
                disabled={!inputJson}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              >
                자동 수정
              </Button>

              <Button 
                variant="secondary" 
                size="sm"
                onClick={formatJson}
                disabled={!inputJson || !isValidJson}
              >
                정렬
              </Button>

              <Button 
                variant="secondary" 
                size="sm"
                onClick={minifyJson}
                disabled={!inputJson || !isValidJson}
              >
                압축
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearAll}
              >
                지우기
              </Button>
            </div>

            <div className="h-6 w-px bg-border-primary" />

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setFontSize(Math.max(10, fontSize - 2))}
              >
                글자 작게
              </Button>
              <span className="text-sm text-text-tertiary px-2">{fontSize}px</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              >
                글자 크게
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        {/* Error or Fixed Issues Message */}
        {(error || fixedIssues.length > 0) && (
          <div className="mb-6 fade-in">
            {error ? (
              <Card variant="outlined" className="border-status-error/30 bg-status-errorLight">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Badge variant="danger">오류</Badge>
                    <div>
                      <p className="text-sm text-status-error">{error}</p>
                      <Button 
                        variant="danger" 
                        size="xs" 
                        onClick={autoFixJson}
                        className="mt-2"
                      >
                        자동 수정 시도
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : fixedIssues.length > 0 && (
              <Card variant="outlined" className="border-status-success/30 bg-status-successLight">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Badge variant="success">수정 완료</Badge>
                    <div>
                      <p className="text-sm font-medium text-status-success mb-2">
                        {fixedIssues.length}개 항목 수정됨:
                      </p>
                      <ul className="text-sm text-status-success/80 space-y-1">
                        {fixedIssues.map((issue, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-status-success rounded-full" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Editors */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-4">
            <Card variant="elevated">
              <div className="p-4 border-b border-border-primary">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">입력</h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={copyStatus.input ? "success" : "ghost"} 
                      size="sm"
                      onClick={() => {
                        console.log('복사 버튼 클릭됨');
                        copyToClipboard(inputJson, 'input');
                      }}
                      disabled={!inputJson}
                    >
                      {copyStatus.input ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          복사완료
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          복사
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="h-[500px] relative">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  theme="vs-dark"
                  value={inputJson}
                  onChange={(value) => setInputJson(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: fontSize,
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    formatOnPaste: false,
                    formatOnType: false,
                  }}
                />
              </div>
              <div className="p-3 border-t border-border-primary bg-background-tertiary/50">
                <div className="flex items-center justify-between text-xs text-text-quaternary">
                  <span>줄: {inputJson.split('\n').length}</span>
                  <span>문자: {inputJson.length}</span>
                  <span className={cn(
                    "flex items-center gap-1",
                    isValidJson ? "text-status-success" : inputJson ? "text-status-warning" : "text-text-quaternary"
                  )}>
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {isValidJson ? '유효' : inputJson ? '유효하지 않음' : '비어있음'}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Output Panel */}
          <div className="space-y-4">
            <Card variant="elevated">
              <div className="p-4 border-b border-border-primary">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">
                    출력 {fixedIssues.length > 0 && <span className="text-status-success text-sm font-normal">(자동 수정됨)</span>}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={copyStatus.output ? "success" : "ghost"} 
                      size="sm"
                      onClick={() => {
                        console.log('출력 복사 버튼 클릭됨');
                        copyToClipboard(outputJson, 'output');
                      }}
                      disabled={!outputJson}
                    >
                      {copyStatus.output ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          복사완료
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          복사
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={downloadJson}
                      disabled={!outputJson}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      다운로드
                    </Button>
                  </div>
                </div>
              </div>
              <div className="h-[500px] relative">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  theme="vs-dark"
                  value={outputJson}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: fontSize,
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
              <div className="p-3 border-t border-border-primary bg-background-tertiary/50">
                <div className="flex items-center justify-between text-xs text-text-quaternary">
                  <span>줄: {outputJson.split('\n').length}</span>
                  <span>크기: {new Blob([outputJson]).size} B</span>
                  <span className={cn(
                    "flex items-center gap-1",
                    outputJson ? "text-status-success" : "text-text-quaternary"
                  )}>
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {outputJson ? '준비됨' : '출력 없음'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-text-primary mb-4">자동 수정 기능</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card variant="default" className="hover:border-brand-primary/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-status-successLight flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-1">따옴표 수정</h4>
                    <p className="text-xs text-text-secondary">
                      작은따옴표를 큰따옴표로 변환하고 누락된 따옴표 추가
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="default" className="hover:border-brand-primary/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-status-infoLight flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-status-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-1">쉼표 정리</h4>
                    <p className="text-xs text-text-secondary">
                      후행 쉼표 제거 및 누락된 쉼표 자동 추가
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="default" className="hover:border-brand-primary/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-1">괄호 균형</h4>
                    <p className="text-xs text-text-secondary">
                      누락된 중괄호와 대괄호 자동 추가
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-primary bg-background-secondary/30 backdrop-blur-md mt-auto">
        <SimpleFooter
          text="© 2024 JSON 에디터. 간단하고 빠르고 강력합니다."
          links={[
            { label: 'GitHub', href: '#' },
            { label: '도움말', href: '#' },
          ]}
        />
      </footer>
    </div>
  );
};

export default App;