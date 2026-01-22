// Main Fretboard Visualizer - Integrates all modules
class FretboardVisualizer {
    constructor() {
        this.instrumentManager = new InstrumentManager();
        this.scaleManager = new ScaleManager();
        this.scaleVisualizer = new ScaleVisualizer();
        this.circleVisualizer = new CircleVisualizer();
        this.chordVisualizer = new ChordVisualizer(this.scaleManager);
        this.intervalVisualizer = new IntervalVisualizer(this.scaleManager);
        this.patternVisualizer = new PatternVisualizer(this.scaleManager, this.instrumentManager);
        this.frequencyVisualizer = new FrequencyVisualizer(this.scaleManager, this.instrumentManager);
        this.tuningEditor = new TuningEditor(this.instrumentManager);
        this.noteInteractionManager = new NoteInteractionManager(this.scaleManager, this.instrumentManager, this.intervalVisualizer);
        
        this.numFrets = 20;
        this.currentVersion = 3;
        this.currentInstrument = 'Guitar (Standard)';
        this.currentKey = 'C';
        this.currentScale = 'Major (Ionian)';
        this.currentPalette = 'default';
        
        // Feature toggles
        this.features = {
            scale: true,
            chords: false,
            intervals: false,
            patterns: false,
            frequency: false
        };
        
        this.currentChord = null;
        
        this.init();
    }
    
    init() {
        this.setupControls();
        this.applyColorPalette(); // Apply initial palette
        this.createFretboard();
        this.updateAllVisualizations();
        this.setupTuningEditor();
        this.setupCircleVisualizations();
    }
    
    // Setup all UI controls
    setupControls() {
        this.setupVersionSwitcher();
        this.setupInstrumentSelector();
        this.setupKeySelector();
        this.setupScaleSelector();
        this.setupFeatureToggles();
        this.setupChordSelector();
        this.setupSettingsToggle();
        this.setupColorPalette();
    }
    
    // Setup settings toggle
    setupSettingsToggle() {
        const toggle = document.getElementById('settings-toggle');
        const panel = document.getElementById('settings-panel');
        
        if (toggle && panel) {
            toggle.addEventListener('click', () => {
                const isVisible = panel.style.display !== 'none';
                panel.style.display = isVisible ? 'none' : 'block';
            });
        }
    }
    
    // Setup color palette selector
    setupColorPalette() {
        const buttons = document.querySelectorAll('.palette-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentPalette = btn.getAttribute('data-palette');
                this.applyColorPalette();
            });
        });
    }
    
    // Apply color palette to document
    applyColorPalette() {
        document.body.setAttribute('data-palette', this.currentPalette);
    }
    
    // Setup version switcher (visual style)
    setupVersionSwitcher() {
        const buttons = document.querySelectorAll('.version-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentVersion = parseInt(btn.getAttribute('data-version'));
                this.createFretboard();
                this.updateAllVisualizations();
            });
        });
    }
    
    // Setup instrument selector
    setupInstrumentSelector() {
        const select = document.getElementById('instrument-select');
        if (!select) return;
        
        this.populateInstrumentSelector(select);
        
        select.addEventListener('change', (e) => {
            this.currentInstrument = e.target.value;
            this.createFretboard();
            this.updateAllVisualizations();
        });
        
        // Listen for custom tuning additions
        window.addEventListener('tuningAdded', (e) => {
            this.populateInstrumentSelector(select);
            select.value = e.detail.name;
            this.currentInstrument = e.detail.name;
            this.createFretboard();
            this.updateAllVisualizations();
        });
        
        window.addEventListener('tuningDeleted', () => {
            this.populateInstrumentSelector(select);
            if (!select.options[select.selectedIndex]) {
                this.currentInstrument = 'Guitar (Standard)';
                select.value = this.currentInstrument;
                this.createFretboard();
                this.updateAllVisualizations();
            }
        });
    }
    
    populateInstrumentSelector(select) {
        select.innerHTML = '';
        const instruments = this.instrumentManager.getInstrumentNames();
        instruments.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            if (name === this.currentInstrument) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }
    
    // Setup key selector
    setupKeySelector() {
        const select = document.getElementById('key-select');
        if (!select) return;
        
        const keys = this.scaleManager.getKeys();
        keys.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            if (key === this.currentKey) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        
        select.addEventListener('change', (e) => {
            this.currentKey = e.target.value;
            this.updateAllVisualizations();
            this.updateChordSelector();
        });
    }
    
    // Setup scale selector
    setupScaleSelector() {
        const select = document.getElementById('scale-select');
        if (!select) return;
        
        const scales = this.scaleManager.getScaleNames();
        scales.forEach(scale => {
            const option = document.createElement('option');
            option.value = scale;
            option.textContent = scale;
            if (scale === this.currentScale) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        
        select.addEventListener('change', (e) => {
            this.currentScale = e.target.value;
            this.updateAllVisualizations();
            this.updateChordSelector();
        });
    }
    
    // Setup feature toggles
    setupFeatureToggles() {
        const toggles = {
            'toggle-scale': 'scale',
            'toggle-chords': 'chords',
            'toggle-intervals': 'intervals',
            'toggle-patterns': 'patterns',
            'toggle-frequency': 'frequency'
        };
        
        Object.entries(toggles).forEach(([id, feature]) => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = this.features[feature];
                checkbox.addEventListener('change', (e) => {
                    this.features[feature] = e.target.checked;
                    this.updateAllVisualizations();
                });
            }
        });
    }
    
    // Setup chord selector
    setupChordSelector() {
        const select = document.getElementById('chord-select');
        if (!select) return;
        
        this.updateChordSelector();
        
        select.addEventListener('change', (e) => {
            this.currentChord = e.target.value;
            this.updateAllVisualizations();
        });
    }
    
    // Update chord selector options
    updateChordSelector() {
        const select = document.getElementById('chord-select');
        if (!select) return;
        
        const scaleNotes = this.scaleManager.getScaleNotes(this.currentKey, this.currentScale);
        const chords = this.chordVisualizer.getChordsInScale(this.currentKey, this.currentScale);
        
        select.innerHTML = '<option value="">None</option>';
        chords.forEach(chord => {
            const option = document.createElement('option');
            option.value = chord.name;
            option.textContent = `${chord.name} (${chord.notes.join(' ')})`;
            select.appendChild(option);
        });
    }
    
    // Setup tuning editor
    setupTuningEditor() {
        const toggle = document.getElementById('toggle-tuning-editor');
        const container = document.getElementById('tuning-editor-container');
        
        if (toggle && container) {
            this.tuningEditor.createEditorUI(container);
            
            toggle.addEventListener('click', () => {
                const isVisible = container.style.display !== 'none';
                container.style.display = isVisible ? 'none' : 'block';
            });
        }
    }
    
    // Setup circle visualizations
    setupCircleVisualizations() {
        const fifthsToggle = document.getElementById('toggle-circle-fifths');
        const chromaticToggle = document.getElementById('toggle-chromatic');
        const fifthsContainer = document.getElementById('circle-of-fifths');
        const chromaticContainer = document.getElementById('chromatic-circle');
        
        if (fifthsToggle && fifthsContainer) {
            fifthsToggle.addEventListener('click', () => {
                const isVisible = fifthsContainer.style.display !== 'none';
                fifthsContainer.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) {
                    this.circleVisualizer.createCircleOfFifths(fifthsContainer);
                    this.updateCircleHighlights();
                }
                fifthsToggle.textContent = isVisible ? 'Show Circle of Fifths' : 'Hide Circle of Fifths';
            });
        }
        
        if (chromaticToggle && chromaticContainer) {
            chromaticToggle.addEventListener('click', () => {
                const isVisible = chromaticContainer.style.display !== 'none';
                chromaticContainer.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) {
                    this.circleVisualizer.createChromaticCircle(chromaticContainer);
                    this.updateCircleHighlights();
                }
                chromaticToggle.textContent = isVisible ? 'Show Chromatic Circle' : 'Hide Chromatic Circle';
            });
        }
    }
    
    // Update circle highlights
    updateCircleHighlights() {
        const scaleNotes = this.scaleManager.getScaleNotes(this.currentKey, this.currentScale);
        const fifthsContainer = document.getElementById('circle-of-fifths');
        const chromaticContainer = document.getElementById('chromatic-circle');
        
        if (fifthsContainer && fifthsContainer.style.display !== 'none') {
            scaleNotes.forEach(note => {
                this.circleVisualizer.highlightNote(fifthsContainer, note, note === this.currentKey);
            });
        }
        
        if (chromaticContainer && chromaticContainer.style.display !== 'none') {
            scaleNotes.forEach(note => {
                this.circleVisualizer.highlightNote(chromaticContainer, note, note === this.currentKey);
            });
        }
    }
    
    // Create the fretboard
    createFretboard() {
        const fretboard = document.getElementById('fretboard');
        if (!fretboard) return;
        
        fretboard.innerHTML = '';
        fretboard.className = `fretboard version-${this.currentVersion}`;
        
        const instrument = this.instrumentManager.getInstrument(this.currentInstrument);
        if (!instrument) return;
        
        const tuning = instrument.tuning;
        
        // Create strings from bottom (lowest) to top (highest)
        for (let i = tuning.length - 1; i >= 0; i--) {
            const openNote = tuning[i];
            const stringIndex = i;
            
            const stringDiv = document.createElement('div');
            stringDiv.className = 'fretboard-string';
            
            // String label
            const label = document.createElement('div');
            label.className = 'string-label';
            label.textContent = openNote;
            stringDiv.appendChild(label);
            
            // Create frets (0 to numFrets)
            for (let fret = 0; fret <= this.numFrets; fret++) {
                const fretDiv = document.createElement('div');
                const note = this.instrumentManager.getNote(tuning, stringIndex, fret);
                
                if (!note) continue;
                
                const isNat = this.instrumentManager.isNatural(note);
                
                fretDiv.className = `fret ${isNat ? 'natural' : 'accidental'}`;
                fretDiv.textContent = note;
                fretDiv.setAttribute('data-note', note);
                fretDiv.setAttribute('data-string', stringIndex);
                fretDiv.setAttribute('data-fret', fret);
                fretDiv.setAttribute('title', `${openNote} string, fret ${fret}: ${note}`);
                
                stringDiv.appendChild(fretDiv);
            }
            
            fretboard.appendChild(stringDiv);
        }
        
        // Setup note interactions after fretboard is created
        this.setupNoteInteractions();
    }
    
    // Setup note click interactions
    setupNoteInteractions() {
        const fretboard = document.getElementById('fretboard');
        if (fretboard && this.noteInteractionManager) {
            this.noteInteractionManager.setupNoteClicks(fretboard);
        }
    }
    
    // Update all visualizations
    updateAllVisualizations() {
        const fretboard = document.getElementById('fretboard');
        if (!fretboard) return;
        
        const instrument = this.instrumentManager.getInstrument(this.currentInstrument);
        if (!instrument) return;
        
        const tuning = instrument.tuning;
        const scaleNotes = this.scaleManager.getScaleNotes(this.currentKey, this.currentScale);
        
        // Clear all visualizations first
        this.scaleVisualizer.clearScale(fretboard);
        this.chordVisualizer.clearChordHighlight(fretboard);
        this.intervalVisualizer.clearIntervals(fretboard);
        this.patternVisualizer.clearPatterns(fretboard);
        this.frequencyVisualizer.clearFrequency(fretboard);
        
        // Clear note selection
        if (this.noteInteractionManager) {
            this.noteInteractionManager.clearSelection(fretboard);
        }
        
        // Apply scale highlighting
        if (this.features.scale && scaleNotes.length > 0) {
            const style = this.currentVersion === 3 ? 'minimal' : 'default';
            this.scaleVisualizer.applyScale(fretboard, scaleNotes, this.currentKey, style);
        }
        
        // Apply chord overlay
        if (this.features.chords && this.currentChord) {
            const chords = this.chordVisualizer.getChordsInScale(this.currentKey, this.currentScale);
            const chord = chords.find(c => c.name === this.currentChord);
            if (chord) {
                this.chordVisualizer.highlightChord(fretboard, chord.notes, chord.root);
            }
        }
        
        // Apply interval highlighting
        if (this.features.intervals) {
            this.intervalVisualizer.highlightIntervals(fretboard, this.currentKey);
        }
        
        // Apply scale patterns
        if (this.features.patterns) {
            const patterns = this.patternVisualizer.findCAGEDPatterns(scaleNotes, this.currentKey, tuning, this.numFrets);
            if (patterns.length > 0) {
                this.patternVisualizer.highlightPattern(fretboard, patterns[0], 'caged');
            }
        }
        
        // Apply frequency display
        if (this.features.frequency) {
            const frequency = this.frequencyVisualizer.countNoteFrequency(scaleNotes, tuning, this.numFrets);
            const maxFreq = Math.max(...Object.values(frequency));
            if (maxFreq > 0) {
                this.frequencyVisualizer.displayFrequency(fretboard, frequency, maxFreq);
            }
        }
        
        // Update circle highlights
        this.updateCircleHighlights();
        
        // Re-setup note interactions after fretboard update
        this.setupNoteInteractions();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.fretboardVisualizer = new FretboardVisualizer();
});
