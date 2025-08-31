// JSON Formatter & Validator - Main JavaScript
class JSONFormatter {
    constructor() {
        this.inputEditor = document.getElementById('inputEditor');
        this.outputContent = document.getElementById('outputContent');
        this.treeView = document.getElementById('treeView');
        this.previewView = document.getElementById('previewView');
        this.errorContainer = document.getElementById('errorContainer');
        this.errorMessage = document.getElementById('errorMessage');
        this.currentFontSize = 14;
        this.currentViewMode = 'code';
        this.history = [];
        this.historyIndex = -1;
        this.autoFormatEnabled = false;
        this.lastValidJSON = null;
        this.errorLine = null;
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadSampleJSON();
        this.updateStats();
        this.setupKeyboardShortcuts();
        this.updateLineNumbers();
    }

    attachEventListeners() {
        // Main action buttons
        document.getElementById('formatBtn').addEventListener('click', () => this.formatJSON());
        document.getElementById('validateBtn').addEventListener('click', () => this.validateJSON());
        document.getElementById('minifyBtn').addEventListener('click', () => this.minifyJSON());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());
        document.getElementById('compareBtn').addEventListener('click', () => this.compareJSON());

        // Copy buttons
        document.getElementById('copyInputBtn').addEventListener('click', () => this.copyToClipboard('input'));
        document.getElementById('copyOutputBtn').addEventListener('click', () => this.copyToClipboard('output'));

        // File operations
        document.getElementById('fileInput').addEventListener('change', (e) => this.loadFile(e));
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadJSON());
        document.getElementById('sampleBtn').addEventListener('click', () => this.loadSampleJSON());

        // URL loading
        document.getElementById('loadUrlBtn').addEventListener('click', () => this.showUrlModal());
        document.getElementById('loadUrlConfirm').addEventListener('click', () => this.loadFromUrl());
        document.getElementById('loadUrlCancel').addEventListener('click', () => this.hideUrlModal());
        document.querySelector('.close').addEventListener('click', () => this.hideUrlModal());

        // View mode
        document.getElementById('viewMode').addEventListener('change', (e) => this.changeViewMode(e.target.value));

        // Font size
        document.getElementById('fontSizeUp').addEventListener('click', () => this.changeFontSize(2));
        document.getElementById('fontSizeDown').addEventListener('click', () => this.changeFontSize(-2));

        // Fullscreen
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());

        // Real-time input monitoring with debounce
        let formatTimeout;
        this.inputEditor.addEventListener('input', () => {
            this.saveToHistory();
            this.updateStats();
            this.updateLineNumbers();
            this.highlightErrorLine(null); // Clear error highlighting
            
            // Debounced auto-format
            clearTimeout(formatTimeout);
            formatTimeout = setTimeout(() => {
                this.autoFormat();
            }, 500);
        });
        
        // Sync scroll for line numbers
        this.inputEditor.addEventListener('scroll', () => {
            const lineNumbers = document.getElementById('lineNumbers');
            lineNumbers.scrollTop = this.inputEditor.scrollTop;
        });

        // Handle paste event
        this.inputEditor.addEventListener('paste', (e) => {
            setTimeout(() => {
                this.autoFormat();
            }, 10);
        });

        // Indent size change
        document.getElementById('indentSize').addEventListener('change', () => {
            if (this.outputContent.textContent) {
                this.formatJSON();
            }
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('urlModal');
            if (e.target === modal) {
                this.hideUrlModal();
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Z for undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.undo();
            }
            // Ctrl/Cmd + Shift + Z for redo
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
                e.preventDefault();
                this.redo();
            }
            // Ctrl/Cmd + Enter to format
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.formatJSON();
            }
            // Ctrl/Cmd + S to download
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.downloadJSON();
            }
        });
    }

    saveToHistory() {
        const currentValue = this.inputEditor.value;
        
        // Don't save if it's the same as the last history entry
        if (this.history.length > 0 && this.history[this.history.length - 1] === currentValue) {
            return;
        }
        
        // Remove any history after current index
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add new history entry
        this.history.push(currentValue);
        this.historyIndex = this.history.length - 1;
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.inputEditor.value = this.history[this.historyIndex];
            this.updateStats();
            this.autoFormat();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.inputEditor.value = this.history[this.historyIndex];
            this.updateStats();
            this.autoFormat();
        }
    }

    formatJSON() {
        try {
            const input = this.inputEditor.value.trim();
            if (!input) {
                this.showError('Please enter JSON data to format');
                return;
            }

            const parsed = JSON.parse(input);
            this.lastValidJSON = parsed;
            const indentSize = parseInt(document.getElementById('indentSize').value);
            const indent = indentSize === 0 ? '' : (indentSize === 10 ? '\t' : ' '.repeat(indentSize));
            const formatted = JSON.stringify(parsed, null, indent);

            this.displayOutput(formatted);
            this.hideError();
            this.highlightErrorLine(null);
            this.updateOutputStatus('Formatted successfully', 'success');
            
            if (this.currentViewMode === 'tree') {
                this.displayTreeView(parsed);
            } else if (this.currentViewMode === 'preview') {
                this.displayPreviewView(parsed);
            }
        } catch (error) {
            const errorInfo = this.parseJSONError(error.message);
            this.showError(`JSON Error: ${errorInfo.message}`);
            this.highlightErrorLine(errorInfo.line);
            this.updateOutputStatus('Invalid JSON', 'error');
        }
    }

    validateJSON() {
        try {
            const input = this.inputEditor.value.trim();
            if (!input) {
                this.showError('Please enter JSON data to validate');
                return;
            }

            const parsed = JSON.parse(input);
            this.lastValidJSON = parsed;
            this.hideError();
            this.highlightErrorLine(null);
            this.showSuccess('Valid JSON! ✓');
            this.updateInputStatus('Valid JSON', 'success');
            
            // Auto-format on successful validation
            this.formatJSON();
        } catch (error) {
            const errorInfo = this.parseJSONError(error.message);
            this.showError(`Invalid JSON: ${errorInfo.message}`);
            this.highlightErrorLine(errorInfo.line);
            this.updateInputStatus('Invalid JSON', 'error');
        }
    }

    minifyJSON() {
        try {
            const input = this.inputEditor.value.trim();
            if (!input) {
                this.showError('Please enter JSON data to minify');
                return;
            }

            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            
            this.displayOutput(minified);
            this.hideError();
            this.updateOutputStatus('Minified successfully', 'success');
        } catch (error) {
            this.showError(`JSON Error: ${error.message}`);
            this.updateOutputStatus('Invalid JSON', 'error');
        }
    }

    autoFormat() {
        if (this.inputEditor.value.trim()) {
            try {
                const parsed = JSON.parse(this.inputEditor.value);
                this.lastValidJSON = parsed;
                this.updateInputStatus('Valid JSON', 'success');
                this.highlightErrorLine(null);
                
                // Auto-format in real-time
                const indentSize = parseInt(document.getElementById('indentSize').value);
                const indent = indentSize === 0 ? '' : (indentSize === 10 ? '\t' : ' '.repeat(indentSize));
                const formatted = JSON.stringify(parsed, null, indent);
                
                this.displayOutput(formatted);
                this.updateOutputStatus('Auto-formatted', 'success');
                
                // Update view if not in code mode
                if (this.currentViewMode === 'tree') {
                    this.displayTreeView(parsed);
                } else if (this.currentViewMode === 'preview') {
                    this.displayPreviewView(parsed);
                }
            } catch (error) {
                const errorInfo = this.parseJSONError(error.message);
                this.updateInputStatus(`Invalid JSON - Line ${errorInfo.line || '?'}`, 'error');
                this.highlightErrorLine(errorInfo.line);
                
                // Clear output on error
                this.outputContent.innerHTML = '';
                this.treeView.innerHTML = '';
                this.previewView.innerHTML = '';
                this.updateOutputStatus('Waiting for valid JSON', 'error');
            }
        } else {
            this.updateInputStatus('Ready');
            this.outputContent.innerHTML = '';
            this.updateOutputStatus('No output');
        }
    }

    highlightErrorLine(lineNumber) {
        this.errorLine = lineNumber;
        
        if (lineNumber && lineNumber > 0) {
            const lines = this.inputEditor.value.split('\n');
            const lineStartPos = lines.slice(0, lineNumber - 1).join('\n').length + (lineNumber > 1 ? 1 : 0);
            const lineEndPos = lineStartPos + lines[lineNumber - 1].length;
            
            // Store cursor position
            const cursorPos = this.inputEditor.selectionStart;
            
            // Add visual indicator (you could enhance this with actual line highlighting)
            this.inputEditor.focus();
            this.inputEditor.setSelectionRange(lineStartPos, lineEndPos);
            
            // Restore cursor after a moment
            setTimeout(() => {
                this.inputEditor.setSelectionRange(cursorPos, cursorPos);
            }, 100);
        }
    }

    displayOutput(text) {
        // Apply syntax highlighting
        const highlighted = this.applySyntaxHighlighting(text);
        this.outputContent.innerHTML = highlighted;
        this.updateOutputStats(text);
    }

    applySyntaxHighlighting(json) {
        return json
            .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
            function (match) {
                let cls = 'json-number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'json-key';
                    } else {
                        cls = 'json-string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'json-boolean';
                } else if (/null/.test(match)) {
                    cls = 'json-null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
    }

    displayTreeView(obj) {
        this.treeView.innerHTML = this.buildTreeHTML(obj);
        this.attachTreeEventListeners();
    }

    buildTreeHTML(obj, indent = 0, path = 'root') {
        let html = '';
        const spacing = ' '.repeat(indent * 2);

        if (Array.isArray(obj)) {
            const id = `tree-${Math.random().toString(36).substr(2, 9)}`;
            html += `${spacing}<span class="tree-toggle" data-toggle="${id}">▼</span> `;
            html += `<span class="tree-bracket" title="${path}">[</span>`;
            html += `<div class="tree-node" id="${id}" style="display: block;">`;
            
            obj.forEach((item, index) => {
                html += `<div class="tree-item">`;
                html += `${spacing}  <span class="tree-index">${index}:</span> `;
                html += this.buildTreeHTML(item, indent + 1, `${path}[${index}]`);
                if (index < obj.length - 1) html += ',';
                html += '</div>';
            });
            
            html += `</div>${spacing}<span class="tree-bracket">]</span>`;
        } else if (typeof obj === 'object' && obj !== null) {
            const id = `tree-${Math.random().toString(36).substr(2, 9)}`;
            html += `${spacing}<span class="tree-toggle" data-toggle="${id}">▼</span> `;
            html += `<span class="tree-bracket" title="${path}">{</span>`;
            html += `<div class="tree-node" id="${id}" style="display: block;">`;
            
            const keys = Object.keys(obj);
            keys.forEach((key, index) => {
                html += `<div class="tree-item">`;
                html += `${spacing}  <span class="tree-key" title="${path}.${key}">"${this.escapeHtml(key)}"</span>: `;
                html += this.buildTreeHTML(obj[key], indent + 1, `${path}.${key}`);
                if (index < keys.length - 1) html += ',';
                html += '</div>';
            });
            
            html += `</div>${spacing}<span class="tree-bracket">}</span>`;
        } else if (typeof obj === 'string') {
            html += `<span class="tree-string" title="${path}">"${this.escapeHtml(obj)}"</span>`;
        } else if (typeof obj === 'number') {
            html += `<span class="tree-number" title="${path}">${obj}</span>`;
        } else if (typeof obj === 'boolean') {
            html += `<span class="tree-boolean" title="${path}">${obj}</span>`;
        } else if (obj === null) {
            html += `<span class="tree-null" title="${path}">null</span>`;
        }

        return html;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    attachTreeEventListeners() {
        document.querySelectorAll('.tree-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.getAttribute('data-toggle');
                const node = document.getElementById(targetId);
                
                if (node) {
                    const isHidden = node.style.display === 'none';
                    node.style.display = isHidden ? 'block' : 'none';
                    toggle.textContent = isHidden ? '▼' : '▶';
                }
            });
        });
        
        // Add hover effect for path display
        document.querySelectorAll('.tree-key, .tree-string, .tree-number, .tree-boolean, .tree-null, .tree-bracket').forEach(elem => {
            elem.addEventListener('mouseenter', (e) => {
                const path = e.target.getAttribute('title');
                if (path) {
                    this.showPathTooltip(e.target, path);
                }
            });
            
            elem.addEventListener('mouseleave', () => {
                this.hidePathTooltip();
            });
        });
    }

    showPathTooltip(element, path) {
        const tooltip = document.createElement('div');
        tooltip.className = 'path-tooltip';
        tooltip.textContent = path;
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - 30) + 'px';
        
        this.currentTooltip = tooltip;
    }

    hidePathTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    displayPreviewView(obj) {
        let html = '<div class="preview-content">';
        
        if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'object') {
            // Display as table if array of objects
            html += this.buildTableHTML(obj);
        } else {
            // Display as formatted list
            html += this.buildPreviewHTML(obj);
        }
        
        html += '</div>';
        this.previewView.innerHTML = html;
    }

    buildTableHTML(arr) {
        if (arr.length === 0) return '';
        
        const keys = Object.keys(arr[0]);
        let html = '<table class="preview-table"><thead><tr>';
        
        keys.forEach(key => {
            html += `<th>${key}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        arr.forEach(item => {
            html += '<tr>';
            keys.forEach(key => {
                html += `<td>${this.formatValue(item[key])}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        return html;
    }

    buildPreviewHTML(obj) {
        let html = '<div class="preview-list">';
        
        if (typeof obj === 'object' && obj !== null) {
            Object.entries(obj).forEach(([key, value]) => {
                html += `<div class="preview-item">
                    <strong>${key}:</strong> ${this.formatValue(value)}
                </div>`;
            });
        } else {
            html += this.formatValue(obj);
        }
        
        html += '</div>';
        return html;
    }

    formatValue(value) {
        if (value === null) return 'null';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }

    changeViewMode(mode) {
        this.currentViewMode = mode;
        
        // Hide all views
        this.outputContent.parentElement.style.display = 'none';
        this.treeView.style.display = 'none';
        this.previewView.style.display = 'none';
        
        // Show selected view
        switch(mode) {
            case 'code':
                this.outputContent.parentElement.style.display = 'block';
                break;
            case 'tree':
                this.treeView.style.display = 'block';
                if (this.outputContent.textContent) {
                    try {
                        const parsed = JSON.parse(this.inputEditor.value);
                        this.displayTreeView(parsed);
                    } catch {}
                }
                break;
            case 'preview':
                this.previewView.style.display = 'block';
                if (this.outputContent.textContent) {
                    try {
                        const parsed = JSON.parse(this.inputEditor.value);
                        this.displayPreviewView(parsed);
                    } catch {}
                }
                break;
        }
    }

    changeFontSize(delta) {
        this.currentFontSize = Math.max(10, Math.min(24, this.currentFontSize + delta));
        this.inputEditor.style.fontSize = this.currentFontSize + 'px';
        this.outputContent.style.fontSize = this.currentFontSize + 'px';
        this.treeView.style.fontSize = this.currentFontSize + 'px';
        this.previewView.style.fontSize = this.currentFontSize + 'px';
    }

    clearAll() {
        this.inputEditor.value = '';
        this.outputContent.innerHTML = '';
        this.treeView.innerHTML = '';
        this.previewView.innerHTML = '';
        this.hideError();
        this.updateStats();
        this.updateInputStatus('Ready');
        this.updateOutputStatus('No output');
    }

    copyToClipboard(source) {
        const text = source === 'input' ? 
            this.inputEditor.value : 
            this.outputContent.textContent;
        
        if (!text) {
            this.showError('Nothing to copy');
            return;
        }
        
        navigator.clipboard.writeText(text).then(() => {
            this.showSuccess('Copied to clipboard!');
        }).catch(() => {
            this.showError('Failed to copy to clipboard');
        });
    }

    loadFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.inputEditor.value = e.target.result;
            this.updateStats();
            this.formatJSON();
        };
        reader.onerror = () => {
            this.showError('Failed to read file');
        };
        reader.readAsText(file);
    }

    downloadJSON() {
        const content = this.outputContent.textContent;
        if (!content) {
            this.showError('No formatted JSON to download');
            return;
        }
        
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showSuccess('File downloaded!');
    }

    loadSampleJSON() {
        const sample = {
            "name": "JSON Formatter",
            "version": "1.0.0",
            "description": "A powerful online JSON formatter and validator",
            "features": [
                "Format JSON",
                "Validate JSON",
                "Minify JSON",
                "Tree View",
                "File Support"
            ],
            "author": {
                "name": "Developer",
                "email": "dev@example.com"
            },
            "stats": {
                "users": 10000,
                "rating": 4.8,
                "reviews": 250
            },
            "active": true,
            "lastUpdate": "2024-01-15"
        };
        
        this.inputEditor.value = JSON.stringify(sample, null, 2);
        this.updateStats();
        this.formatJSON();
    }

    showUrlModal() {
        document.getElementById('urlModal').style.display = 'flex';
    }

    hideUrlModal() {
        document.getElementById('urlModal').style.display = 'none';
        document.getElementById('urlInput').value = '';
    }

    async loadFromUrl() {
        const url = document.getElementById('urlInput').value.trim();
        if (!url) {
            this.showError('Please enter a valid URL');
            return;
        }
        
        try {
            // Note: In production, you'd need CORS headers or a proxy
            const response = await fetch(url);
            const json = await response.json();
            this.inputEditor.value = JSON.stringify(json, null, 2);
            this.updateStats();
            this.formatJSON();
            this.hideUrlModal();
            this.showSuccess('JSON loaded from URL!');
        } catch (error) {
            this.showError('Failed to load JSON from URL. Check CORS settings.');
        }
    }

    toggleFullscreen() {
        const outputPanel = document.querySelector('.output-panel');
        outputPanel.classList.toggle('fullscreen');
        
        const btn = document.getElementById('fullscreenBtn');
        btn.innerHTML = outputPanel.classList.contains('fullscreen') ? 
            '<span class="icon">◱</span> Exit' : 
            '<span class="icon">⛶</span> Fullscreen';
    }

    parseJSONError(message) {
        const match = message.match(/position (\d+)/);
        let result = { message: message, line: null, column: null };
        
        if (match) {
            const position = parseInt(match[1]);
            const lines = this.inputEditor.value.substring(0, position).split('\n');
            const line = lines.length;
            const column = lines[lines.length - 1].length + 1;
            
            result.message = `${message} (Line ${line}, Column ${column})`;
            result.line = line;
            result.column = column;
        }
        
        return result;
    }

    showError(message) {
        this.errorContainer.style.display = 'block';
        this.errorMessage.textContent = message;
        this.errorMessage.className = 'error-message';
    }

    showSuccess(message) {
        this.errorContainer.style.display = 'block';
        this.errorMessage.textContent = message;
        this.errorMessage.className = 'success-message';
        setTimeout(() => this.hideError(), 3000);
    }

    hideError() {
        this.errorContainer.style.display = 'none';
    }

    updateStats() {
        const input = this.inputEditor.value;
        const lines = input.split('\n').length;
        const chars = input.length;
        
        document.getElementById('inputLines').textContent = `Lines: ${lines}`;
        document.getElementById('inputChars').textContent = `Characters: ${chars}`;
    }

    updateOutputStats(text) {
        const lines = text.split('\n').length;
        const size = new Blob([text]).size;
        
        document.getElementById('outputLines').textContent = `Lines: ${lines}`;
        document.getElementById('outputSize').textContent = `Size: ${this.formatBytes(size)}`;
    }

    updateInputStatus(message, type = '') {
        const status = document.getElementById('inputStatus');
        status.textContent = message;
        status.className = `status ${type}`;
    }

    updateOutputStatus(message, type = '') {
        const status = document.getElementById('outputStatus');
        status.textContent = message;
        status.className = `status ${type}`;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    updateLineNumbers() {
        const lineNumbers = document.getElementById('lineNumbers');
        const lines = this.inputEditor.value.split('\n');
        const lineCount = lines.length;
        
        let numbersHTML = '';
        for (let i = 1; i <= lineCount; i++) {
            const isError = i === this.errorLine;
            numbersHTML += `<div class="${isError ? 'error-line' : ''}">${i}</div>`;
        }
        
        lineNumbers.innerHTML = numbersHTML;
    }

    compareJSON() {
        if (!this.lastValidJSON) {
            this.showError('Please format or validate JSON first');
            return;
        }
        
        // Create comparison modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 90%; width: 90%; height: 80vh;">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>JSON Comparison</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; height: calc(100% - 100px);">
                    <div>
                        <h3>Original JSON</h3>
                        <textarea id="compareInput1" style="width: 100%; height: 100%; padding: 1rem; font-family: monospace;">${this.inputEditor.value}</textarea>
                    </div>
                    <div>
                        <h3>Compare With</h3>
                        <textarea id="compareInput2" placeholder="Paste JSON to compare..." style="width: 100%; height: 100%; padding: 1rem; font-family: monospace;"></textarea>
                    </div>
                </div>
                <div class="modal-actions" style="margin-top: 1rem;">
                    <button class="btn btn-primary" onclick="window.jsonFormatter.performComparison()">Compare</button>
                    <button class="btn" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
                </div>
                <div id="comparisonResult" style="margin-top: 1rem; max-height: 200px; overflow: auto;"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        window.jsonFormatter = this; // Make instance accessible
    }

    performComparison() {
        const input1 = document.getElementById('compareInput1').value;
        const input2 = document.getElementById('compareInput2').value;
        const resultDiv = document.getElementById('comparisonResult');
        
        try {
            const json1 = JSON.parse(input1);
            const json2 = JSON.parse(input2);
            
            const differences = this.findDifferences(json1, json2);
            
            if (differences.length === 0) {
                resultDiv.innerHTML = '<div style="color: green;">✓ The JSON objects are identical!</div>';
            } else {
                let html = '<div style="color: red;">✗ Differences found:</div><ul>';
                differences.forEach(diff => {
                    html += `<li><strong>${diff.path}:</strong> ${diff.message}</li>`;
                });
                html += '</ul>';
                resultDiv.innerHTML = html;
            }
        } catch (error) {
            resultDiv.innerHTML = `<div style="color: red;">Error: ${error.message}</div>`;
        }
    }

    findDifferences(obj1, obj2, path = '') {
        const differences = [];
        
        // Check if types are different
        if (typeof obj1 !== typeof obj2) {
            differences.push({
                path: path || 'root',
                message: `Type mismatch: ${typeof obj1} vs ${typeof obj2}`
            });
            return differences;
        }
        
        // Handle arrays
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            if (obj1.length !== obj2.length) {
                differences.push({
                    path: path || 'root',
                    message: `Array length: ${obj1.length} vs ${obj2.length}`
                });
            }
            
            const minLength = Math.min(obj1.length, obj2.length);
            for (let i = 0; i < minLength; i++) {
                differences.push(...this.findDifferences(obj1[i], obj2[i], `${path}[${i}]`));
            }
        }
        // Handle objects
        else if (typeof obj1 === 'object' && obj1 !== null && obj2 !== null) {
            const keys1 = Object.keys(obj1);
            const keys2 = Object.keys(obj2);
            const allKeys = new Set([...keys1, ...keys2]);
            
            allKeys.forEach(key => {
                const newPath = path ? `${path}.${key}` : key;
                
                if (!(key in obj1)) {
                    differences.push({
                        path: newPath,
                        message: 'Missing in first JSON'
                    });
                } else if (!(key in obj2)) {
                    differences.push({
                        path: newPath,
                        message: 'Missing in second JSON'
                    });
                } else {
                    differences.push(...this.findDifferences(obj1[key], obj2[key], newPath));
                }
            });
        }
        // Handle primitives
        else if (obj1 !== obj2) {
            differences.push({
                path: path || 'root',
                message: `Value: "${obj1}" vs "${obj2}"`
            });
        }
        
        return differences;
    }
}

// Add success message styling
const style = document.createElement('style');
style.textContent = `
    .success-message {
        color: #2e7d32;
        background: #e8f5e9;
        padding: 1rem;
        border-radius: 6px;
        border: 1px solid #66bb6a;
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new JSONFormatter();
});