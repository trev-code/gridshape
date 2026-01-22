// Debug Console - Real-time error tracking and debugging
class DebugConsole {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.logs = [];
        this.maxEntries = 100;
        this.container = null;
        this.isVisible = false;
        this.init();
    }
    
    init() {
        this.createConsole();
        this.setupErrorHandling();
        this.setupGlobalErrorHandler();
    }
    
    // Create debug console UI
    createConsole() {
        this.container = document.createElement('div');
        this.container.id = 'debug-console';
        this.container.className = 'debug-console';
        this.container.style.display = 'block'; // Show by default
        this.isVisible = true;
        this.container.innerHTML = `
            <div class="debug-header">
                <h4>Debug Console</h4>
                <div class="debug-controls">
                    <button class="debug-btn" id="debug-copy">Copy</button>
                    <button class="debug-btn" id="debug-clear">Clear</button>
                    <button class="debug-btn" id="debug-toggle">Hide</button>
                </div>
            </div>
            <div class="debug-content" id="debug-content">
                <div class="debug-entry info">Console initialized. Ready for debugging.</div>
            </div>
        `;
        document.body.appendChild(this.container);
        
        // Setup controls
        document.getElementById('debug-copy').addEventListener('click', () => this.copyToClipboard());
        document.getElementById('debug-clear').addEventListener('click', () => this.clear());
        document.getElementById('debug-toggle').addEventListener('click', () => this.toggle());
    }
    
    // Setup error handling
    setupErrorHandling() {
        // Override console methods
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalLog = console.log;
        
        console.error = (...args) => {
            this.addEntry('error', args.join(' '));
            originalError.apply(console, args);
        };
        
        console.warn = (...args) => {
            this.addEntry('warning', args.join(' '));
            originalWarn.apply(console, args);
        };
        
        console.log = (...args) => {
            this.addEntry('log', args.join(' '));
            originalLog.apply(console, args);
        };
    }
    
    // Setup global error handler
    setupGlobalErrorHandler() {
        window.addEventListener('error', (e) => {
            this.addEntry('error', `Error: ${e.message} at ${e.filename}:${e.lineno}:${e.colno}`);
            if (e.error && e.error.stack) {
                this.addEntry('error', `Stack: ${e.error.stack}`);
            }
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.addEntry('error', `Unhandled Promise Rejection: ${e.reason}`);
        });
    }
    
    // Add entry to console
    addEntry(type, message) {
        const entry = {
            type: type,
            message: message,
            timestamp: new Date().toLocaleTimeString()
        };
        
        if (type === 'error') {
            this.errors.push(entry);
        } else if (type === 'warning') {
            this.warnings.push(entry);
        } else {
            this.logs.push(entry);
        }
        
        this.renderEntry(entry);
        this.autoShow();
    }
    
    // Render entry
    renderEntry(entry) {
        const content = document.getElementById('debug-content');
        if (!content) return;
        
        const entryDiv = document.createElement('div');
        entryDiv.className = `debug-entry ${entry.type}`;
        entryDiv.innerHTML = `
            <span class="debug-time">[${entry.timestamp}]</span>
            <span class="debug-message">${this.escapeHtml(entry.message)}</span>
        `;
        
        content.appendChild(entryDiv);
        
        // Limit entries
        while (content.children.length > this.maxEntries) {
            content.removeChild(content.firstChild);
        }
        
        // Auto-scroll to bottom
        content.scrollTop = content.scrollHeight;
    }
    
    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Auto-show on errors
    autoShow() {
        if (this.errors.length > 0 && !this.isVisible) {
            this.show();
        }
    }
    
    // Show console
    show() {
        if (this.container) {
            this.container.style.display = 'block';
            this.isVisible = true;
            document.getElementById('debug-toggle').textContent = 'Hide';
        }
    }
    
    // Hide console
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
            this.isVisible = false;
            document.getElementById('debug-toggle').textContent = 'Show';
        }
    }
    
    // Toggle console
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    // Clear console
    clear() {
        const content = document.getElementById('debug-content');
        if (content) {
            content.innerHTML = '<div class="debug-entry info">Console cleared.</div>';
        }
        this.errors = [];
        this.warnings = [];
        this.logs = [];
    }
    
    // Log custom message
    log(message, type = 'log') {
        this.addEntry(type, message);
    }
    
    // Copy all console entries to clipboard
    copyToClipboard() {
        const content = document.getElementById('debug-content');
        if (!content) return;
        
        // Collect all entries
        const entries = [];
        const entryElements = content.querySelectorAll('.debug-entry');
        
        entryElements.forEach(entry => {
            const time = entry.querySelector('.debug-time')?.textContent || '';
            const message = entry.querySelector('.debug-message')?.textContent || '';
            const type = entry.className.includes('error') ? 'ERROR' : 
                        entry.className.includes('warning') ? 'WARNING' : 
                        entry.className.includes('info') ? 'INFO' : 'LOG';
            entries.push(`${time} [${type}] ${message}`);
        });
        
        // Combine into single string
        const textToCopy = entries.join('\n');
        
        // Copy to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                this.addEntry('info', 'Console contents copied to clipboard');
            }).catch(err => {
                this.addEntry('error', `Failed to copy: ${err.message}`);
                // Fallback method
                this.fallbackCopyToClipboard(textToCopy);
            });
        } else {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(textToCopy);
        }
    }
    
    // Fallback copy method
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.addEntry('info', 'Console contents copied to clipboard');
            } else {
                this.addEntry('error', 'Failed to copy to clipboard');
            }
        } catch (err) {
            this.addEntry('error', `Failed to copy: ${err.message}`);
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

// Initialize debug console when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.debugConsole = new DebugConsole();
        console.log('Debug console initialized');
    });
} else {
    // DOM already loaded
    window.debugConsole = new DebugConsole();
    console.log('Debug console initialized (DOM already loaded)');
}
