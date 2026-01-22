// Main Fretboard Visualizer - Integrates all modules
class FretboardVisualizer {
    constructor() {
        try {
            // Check if all required classes are available
            const requiredClasses = {
                'InstrumentManager': typeof InstrumentManager !== 'undefined' ? InstrumentManager : undefined,
                'ScaleManager': typeof ScaleManager !== 'undefined' ? ScaleManager : undefined,
                'ScaleVisualizer': typeof ScaleVisualizer !== 'undefined' ? ScaleVisualizer : undefined,
                'CircleVisualizer': typeof CircleVisualizer !== 'undefined' ? CircleVisualizer : undefined,
                'ChordVisualizer': typeof ChordVisualizer !== 'undefined' ? ChordVisualizer : undefined,
                'IntervalVisualizer': typeof IntervalVisualizer !== 'undefined' ? IntervalVisualizer : undefined,
                'PatternVisualizer': typeof PatternVisualizer !== 'undefined' ? PatternVisualizer : undefined,
                'FrequencyVisualizer': typeof FrequencyVisualizer !== 'undefined' ? FrequencyVisualizer : undefined,
                'TuningEditor': typeof TuningEditor !== 'undefined' ? TuningEditor : undefined,
                'NoteInteractionManager': typeof NoteInteractionManager !== 'undefined' ? NoteInteractionManager : undefined,
                'TriadVisualizer': typeof TriadVisualizer !== 'undefined' ? TriadVisualizer : undefined,
                'LegendManager': typeof LegendManager !== 'undefined' ? LegendManager : undefined
            };
            
            const missingClasses = [];
            for (const [name, Class] of Object.entries(requiredClasses)) {
                if (typeof Class === 'undefined') {
                    missingClasses.push(name);
                }
            }
            
            if (missingClasses.length > 0) {
                const errorMsg = `Missing required classes: ${missingClasses.join(', ')}. Make sure all script files are loaded in the correct order.`;
                console.error('Class availability check:', requiredClasses);
                throw new Error(errorMsg);
            }
            
            this.instrumentManager = new InstrumentManager();
            this.scaleManager = new ScaleManager();
        this.scaleVisualizer = new ScaleVisualizer();
        this.circleVisualizer = new CircleVisualizer(this.scaleManager);
        this.chordVisualizer = new ChordVisualizer(this.scaleManager);
            this.intervalVisualizer = new IntervalVisualizer(this.scaleManager);
            this.patternVisualizer = new PatternVisualizer(this.scaleManager, this.instrumentManager);
            this.frequencyVisualizer = new FrequencyVisualizer(this.scaleManager, this.instrumentManager);
            this.tuningEditor = new TuningEditor(this.instrumentManager);
            this.noteInteractionManager = new NoteInteractionManager(this.scaleManager, this.instrumentManager, this.intervalVisualizer);
            this.triadVisualizer = new TriadVisualizer(this.scaleManager, this.instrumentManager);
            this.legendManager = new LegendManager();
        
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
            frequency: false,
            triads: false
        };
        
        this.currentChord = null;
        this.currentTriad = null;
        this.triadMethod = 'connected';
        
        this.init();
        } catch (error) {
            console.error('Error in FretboardVisualizer constructor:', error);
            throw error;
        }
    }
    
    init() {
        try {
            console.log('Initializing FretboardVisualizer...');
        this.setupControls();
        this.applyColorPalette(); // Apply initial palette
        this.createFretboard();
        this.updateAllVisualizations();
        this.setupTuningEditor();
        this.setupCircleVisualizations();
        this.legendManager.init();
        this.updateLegend();
        console.log('FretboardVisualizer initialized successfully');
        } catch (error) {
            console.error('Error initializing FretboardVisualizer:', error);
            if (window.debugConsole) {
                window.debugConsole.addEntry('error', `Initialization error: ${error.message}`);
            }
        }
    }
    
    // Setup all UI controls
    setupControls() {
        try {
            console.log('Setting up controls...');
            this.setupVersionSwitcher();
            this.setupInstrumentSelector();
            this.setupKeySelector();
            this.setupScaleSelector();
            this.setupFeatureToggles();
            this.setupChordSelector();
            this.setupSettingsToggle();
            this.setupColorPalette();
            this.setupFretCountInput();
            console.log('Controls setup complete');
        } catch (error) {
            console.error('Error setting up controls:', error);
        }
    }
    
    // Setup settings toggle
    setupSettingsToggle() {
        const toggle = document.getElementById('settings-toggle');
        const panel = document.getElementById('settings-panel');
        
        if (toggle && panel) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Settings toggle clicked');
                const isVisible = panel.style.display !== 'none';
                panel.style.display = isVisible ? 'none' : 'block';
            });
        } else {
            console.warn('Settings toggle or panel not found');
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
    
    // Setup fret count input
    setupFretCountInput() {
        const input = document.getElementById('fret-count-input');
        if (input) {
            input.value = this.numFrets;
            input.addEventListener('change', (e) => {
                const newCount = parseInt(e.target.value);
                if (newCount >= 5 && newCount <= 30) {
                    this.numFrets = newCount;
                    // Update CSS variable for responsive sizing
                    document.documentElement.style.setProperty('--fret-count', newCount);
                    // Recreate fretboard with new count
                    this.createFretboard();
                    this.updateAllVisualizations();
                } else {
                    e.target.value = this.numFrets; // Reset to current value
                }
            });
        }
    }
    
    // Apply color palette to document
    applyColorPalette() {
        document.body.setAttribute('data-palette', this.currentPalette);
    }
    
    // Setup version switcher (visual style)
    setupVersionSwitcher() {
        const buttons = document.querySelectorAll('.version-btn');
        console.log(`Found ${buttons.length} version buttons`);
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Version button clicked:', btn.getAttribute('data-version'));
                e.preventDefault();
                e.stopPropagation();
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
            this.updateTriadSelector();
            this.updateCircleHighlights(); // Update circles when key changes
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
            this.updateTriadSelector();
            this.updateCircleHighlights(); // Update circles when scale changes
        });
    }
    
    // Setup feature toggles
    setupFeatureToggles() {
        const toggles = {
            'toggle-scale': 'scale',
            'toggle-chords': 'chords',
            'toggle-intervals': 'intervals',
            'toggle-patterns': 'patterns',
            'toggle-frequency': 'frequency',
            'toggle-triads': 'triads'
        };
        
        Object.entries(toggles).forEach(([id, feature]) => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = this.features[feature];
                checkbox.addEventListener('change', (e) => {
                    this.features[feature] = e.target.checked;
                    
                    // Show/hide triad controls in bottom bar
                    if (feature === 'triads') {
                        const triadControls = document.getElementById('triad-controls');
                        if (triadControls) {
                            triadControls.style.display = e.target.checked ? 'flex' : 'none';
                        }
                        // Auto-select first triad if none selected and triads enabled
                        if (e.target.checked && !this.currentTriad) {
                            this.updateTriadSelector();
                            const select = document.getElementById('triad-select');
                            if (select && select.options.length > 1) {
                                select.value = select.options[1].value;
                                this.currentTriad = select.value;
                            }
                        }
                    }
                    
                    // Update legend when toggling features
                    this.updateLegend();
                    
                    this.updateAllVisualizations();
                });
            }
        });
        
        // Setup triad selector
        this.setupTriadSelector();
    }
    
    // Setup triad selector
    setupTriadSelector() {
        const select = document.getElementById('triad-select');
        const methodSelect = document.getElementById('triad-method-select');
        
        if (select) {
            this.updateTriadSelector();
            select.addEventListener('change', (e) => {
                this.currentTriad = e.target.value;
                this.updateAllVisualizations();
            });
        }
        
        if (methodSelect) {
            methodSelect.addEventListener('change', (e) => {
                this.triadMethod = e.target.value;
                this.updateAllVisualizations();
            });
        }
    }
    
    // Update triad selector options
    updateTriadSelector() {
        const select = document.getElementById('triad-select');
        if (!select) return;
        
        const triads = this.triadVisualizer.getTriadsInScale(this.currentKey, this.currentScale);
        
        select.innerHTML = '<option value="">None</option>';
        triads.forEach(triad => {
            const option = document.createElement('option');
            option.value = triad.name;
            option.textContent = `${triad.name} (${triad.notes.join(' ')}) - Degree ${triad.scaleDegree}`;
            select.appendChild(option);
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
        
        // Update circle visualizer with current key/scale
        this.circleVisualizer.setCurrentKeyScale(this.currentKey, this.currentScale);
        
        if (fifthsToggle && fifthsContainer) {
            fifthsToggle.addEventListener('click', () => {
                const isVisible = fifthsContainer.style.display !== 'none';
                fifthsContainer.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) {
                    this.circleVisualizer.createCircleOfFifths(fifthsContainer);
                } else {
                    // Update even when hiding to ensure it's current when shown again
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
                } else {
                    // Update even when hiding
                    this.updateCircleHighlights();
                }
                chromaticToggle.textContent = isVisible ? 'Show Chromatic Circle' : 'Hide Chromatic Circle';
            });
        }
    }
    
    // Update circle highlights and scale degrees
    updateCircleHighlights() {
        const fifthsContainer = document.getElementById('circle-of-fifths');
        const chromaticContainer = document.getElementById('chromatic-circle');
        
        // Update circle visualizer with current key/scale
        this.circleVisualizer.setCurrentKeyScale(this.currentKey, this.currentScale);
        
        if (fifthsContainer && fifthsContainer.style.display !== 'none') {
            this.circleVisualizer.updateCircleHighlights(fifthsContainer, 'fifths', this.currentKey, this.currentScale);
        }
        
        if (chromaticContainer && chromaticContainer.style.display !== 'none') {
            this.circleVisualizer.updateCircleHighlights(chromaticContainer, 'chromatic', this.currentKey, this.currentScale);
        }
    }
    
    // Create the fretboard
    createFretboard() {
        console.log('Creating fretboard...');
        // Set CSS variable for responsive fret sizing
        document.documentElement.style.setProperty('--fret-count', this.numFrets);
        
        const fretboard = document.getElementById('fretboard');
        if (!fretboard) {
            console.error('Fretboard element not found!');
            return;
        }
        
        // Remove loading message if present
        const loadingMsg = fretboard.querySelector('#fretboard-loading');
        if (loadingMsg) {
            loadingMsg.remove();
        }
        
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
        
        console.log(`Fretboard created with ${tuning.length} strings and ${this.numFrets + 1} frets`);
        
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
        this.triadVisualizer.clearTriads(fretboard);
        
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
        
        // Apply triad visualization
        if (this.features.triads && this.currentTriad) {
            const triads = this.triadVisualizer.getTriadsInScale(this.currentKey, this.currentScale);
            const triad = triads.find(t => t.name === this.currentTriad);
            if (triad) {
                const positions = this.triadVisualizer.findTriadPositions(triad, tuning, this.numFrets, this.triadMethod);
                if (positions.length > 0 && Array.isArray(positions)) {
                    // Show first position with connection lines
                    this.triadVisualizer.highlightTriad(fretboard, positions[0], this.triadMethod);
                }
            }
        } else {
            // Clear triad connections when triads are disabled
            this.triadVisualizer.clearTriadConnections();
        }
        
        // Update circle highlights
        this.updateCircleHighlights();
        
        // Re-setup note interactions after fretboard update
        this.setupNoteInteractions();
        
        // Update legend
        this.updateLegend();
    }
    
    // Update legend based on active visualizations
    updateLegend() {
        const fretboard = document.getElementById('fretboard');
        if (!fretboard || !this.legendManager) return;
        
        const activeClasses = this.legendManager.getActiveClasses(fretboard);
        this.legendManager.updateLegend(activeClasses);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    console.log('Available classes:', {
        InstrumentManager: typeof InstrumentManager,
        ScaleManager: typeof ScaleManager,
        ScaleVisualizer: typeof ScaleVisualizer,
        CircleVisualizer: typeof CircleVisualizer,
        ChordVisualizer: typeof ChordVisualizer,
        IntervalVisualizer: typeof IntervalVisualizer,
        PatternVisualizer: typeof PatternVisualizer,
        FrequencyVisualizer: typeof FrequencyVisualizer,
        TuningEditor: typeof TuningEditor,
        NoteInteractionManager: typeof NoteInteractionManager,
        TriadVisualizer: typeof TriadVisualizer,
        LegendManager: typeof LegendManager
    });
    
    try {
        window.fretboardVisualizer = new FretboardVisualizer();
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        console.error('Error stack:', error.stack);
        if (window.debugConsole) {
            window.debugConsole.addEntry('error', `Initialization failed: ${error.message}`);
            window.debugConsole.show();
        }
        alert('Error initializing application. Check the browser console (F12) and debug console for details.\n\nError: ' + error.message);
    }
});
