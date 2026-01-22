// Custom Tuning Editor
class TuningEditor {
    constructor(instrumentManager) {
        this.instrumentManager = instrumentManager;
        this.customTunings = this.loadCustomTunings();
    }
    
    // Load custom tunings from localStorage
    loadCustomTunings() {
        try {
            const saved = localStorage.getItem('customTunings');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }
    
    // Save custom tunings to localStorage
    saveCustomTunings() {
        try {
            localStorage.setItem('customTunings', JSON.stringify(this.customTunings));
        } catch (e) {
            console.error('Failed to save custom tunings:', e);
        }
    }
    
    // Create custom tuning
    createCustomTuning(name, tuning, description = '') {
        if (!name || !tuning || tuning.length === 0) {
            return null;
        }
        
        // Validate tuning notes
        const allNotes = this.instrumentManager.allNotes;
        const validTuning = tuning.filter(note => allNotes.includes(note));
        
        if (validTuning.length === 0) {
            return null;
        }
        
        const customInstrument = {
            tuning: validTuning,
            name: name,
            description: description || `Custom tuning: ${validTuning.join(' ')}`
        };
        
        this.customTunings[name] = customInstrument;
        this.saveCustomTunings();
        
        // Add to instrument manager
        this.instrumentManager.createCustomInstrument(name, validTuning, description);
        
        return customInstrument;
    }
    
    // Delete custom tuning
    deleteCustomTuning(name) {
        if (this.customTunings[name]) {
            delete this.customTunings[name];
            this.saveCustomTunings();
            return true;
        }
        return false;
    }
    
    // Get all custom tunings
    getCustomTunings() {
        return Object.keys(this.customTunings);
    }
    
    // Create tuning editor UI
    createEditorUI(container) {
        container.innerHTML = `
            <div class="tuning-editor">
                <h3>Custom Tuning Editor</h3>
                <div class="editor-form">
                    <div class="form-group">
                        <label>Name:</label>
                        <input type="text" id="tuning-name" placeholder="e.g., Open G">
                    </div>
                    <div class="form-group">
                        <label>Tuning (comma-separated notes):</label>
                        <input type="text" id="tuning-notes" placeholder="e.g., D, G, D, G, B, D">
                    </div>
                    <div class="form-group">
                        <label>Description (optional):</label>
                        <input type="text" id="tuning-desc" placeholder="Optional description">
                    </div>
                    <button id="save-tuning-btn" class="btn-primary">Save Tuning</button>
                </div>
                <div class="custom-tunings-list">
                    <h4>Saved Custom Tunings:</h4>
                    <div id="tunings-list"></div>
                </div>
            </div>
        `;
        
        this.renderTuningsList(container.querySelector('#tunings-list'));
        this.setupEventListeners(container);
    }
    
    // Render list of custom tunings
    renderTuningsList(container) {
        const tunings = this.getCustomTunings();
        
        if (tunings.length === 0) {
            container.innerHTML = '<p class="no-tunings">No custom tunings saved yet.</p>';
            return;
        }
        
        container.innerHTML = tunings.map(name => {
            const tuning = this.customTunings[name];
            return `
                <div class="tuning-item">
                    <div class="tuning-info">
                        <strong>${name}</strong>
                        <span>${tuning.tuning.join(' ')}</span>
                        ${tuning.description ? `<em>${tuning.description}</em>` : ''}
                    </div>
                    <button class="btn-delete" data-tuning="${name}">Delete</button>
                </div>
            `;
        }).join('');
    }
    
    // Setup event listeners
    setupEventListeners(container) {
        const saveBtn = container.querySelector('#save-tuning-btn');
        const nameInput = container.querySelector('#tuning-name');
        const notesInput = container.querySelector('#tuning-notes');
        const descInput = container.querySelector('#tuning-desc');
        
        saveBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const notesStr = notesInput.value.trim();
            const desc = descInput.value.trim();
            
            if (!name || !notesStr) {
                alert('Please enter a name and tuning notes.');
                return;
            }
            
            const notes = notesStr.split(',').map(n => n.trim()).filter(n => n);
            const tuning = this.createCustomTuning(name, notes, desc);
            
            if (tuning) {
                alert(`Tuning "${name}" saved successfully!`);
                nameInput.value = '';
                notesInput.value = '';
                descInput.value = '';
                this.renderTuningsList(container.querySelector('#tunings-list'));
                
                // Trigger custom event to update instrument selector
                window.dispatchEvent(new CustomEvent('tuningAdded', { detail: { name } }));
            } else {
                alert('Failed to create tuning. Please check that all notes are valid (C, C#, D, etc.)');
            }
        });
        
        // Delete buttons
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete')) {
                const tuningName = e.target.getAttribute('data-tuning');
                if (confirm(`Delete tuning "${tuningName}"?`)) {
                    this.deleteCustomTuning(tuningName);
                    this.renderTuningsList(container.querySelector('#tunings-list'));
                    window.dispatchEvent(new CustomEvent('tuningDeleted', { detail: { name: tuningName } }));
                }
            }
        });
    }
}
