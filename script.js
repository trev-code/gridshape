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
                'TuningEditor': typeof TuningEditor !== 'undefined' ? TuningEditor : undefined,
                'NoteInteractionManager': typeof NoteInteractionManager !== 'undefined' ? NoteInteractionManager : undefined,
                'TriadVisualizer': typeof TriadVisualizer !== 'undefined' ? TriadVisualizer : undefined,
                'LegendManager': typeof LegendManager !== 'undefined' ? LegendManager : undefined,
                'ScaleDegreeVisualizer': typeof ScaleDegreeVisualizer !== 'undefined' ? ScaleDegreeVisualizer : undefined,
                'FretMarkerVisualizer': typeof FretMarkerVisualizer !== 'undefined' ? FretMarkerVisualizer : undefined,
                'ChordLibrary': typeof ChordLibrary !== 'undefined' ? ChordLibrary : undefined,
                'MIDISupport': typeof MIDISupport !== 'undefined' ? MIDISupport : undefined
            };
            
            const missingClasses = [];
            // Only check core required classes - new modules are optional
            const coreRequired = ['InstrumentManager', 'ScaleManager', 'ScaleVisualizer'];
            for (const name of coreRequired) {
                if (typeof requiredClasses[name] === 'undefined') {
                    missingClasses.push(name);
                }
            }
            
            if (missingClasses.length > 0) {
                const errorMsg = `Missing required classes: ${missingClasses.join(', ')}. Make sure all script files are loaded in the correct order.`;
                console.error('Class availability check:', requiredClasses);
                throw new Error(errorMsg);
            }
            
            // Warn about optional modules but don't fail
            const optionalModules = ['ScaleDegreeVisualizer', 'FretMarkerVisualizer', 'ChordLibrary', 'MIDISupport'];
            optionalModules.forEach(name => {
                if (typeof requiredClasses[name] === 'undefined') {
                    console.warn(`Optional module ${name} not loaded - feature will be unavailable`);
                }
            });
            
            this.instrumentManager = new InstrumentManager();
            this.scaleManager = new ScaleManager();
        this.scaleVisualizer = new ScaleVisualizer();
        this.circleVisualizer = new CircleVisualizer(this.scaleManager);
        this.chordVisualizer = new ChordVisualizer(this.scaleManager);
            this.intervalVisualizer = new IntervalVisualizer(this.scaleManager);
            this.patternVisualizer = new PatternVisualizer(this.scaleManager, this.instrumentManager);
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
        this.noteShape = 'square'; // 'square', 'circular', 'dot', 'small-dot'
        this.noteNameFormat = 'letter'; // 'letter', 'numerical', 'roman'
        
        // Feature toggles - initialize before loadSettings()
        this.features = {
            scale: true,
            chords: false,
            intervals: false,
            patterns: false,
            frequency: false,
            triads: false
        };
        
        // Load settings from localStorage
        this.loadSettings();
        
        this.currentChord = null;
        this.currentTriad = null;
        this.selectedTriads = []; // Support multiple selections
        this.triadMethod = 'connected';
        this.mirrorMode = 'none'; // 'none', 'horizontal', 'vertical'
        this.customGridRows = 10;
        this.customGridCols = 10;
        this.gridRowInterval = 1; // Semitones per row (1-12)
        this.gridColInterval = 1; // Semitones per column (1-12)
        
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
        // Update tuning selector after controls are set up
        this.updateTuningSelector();
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
            this.setupMirroring();
            this.setupCustomGridSettings();
            this.setupNoteShapeSelector();
            this.setupNoteFormatSelector();
            this.setupTuningSelector();
            // Apply loaded settings
            this.applyColorPalette();
            this.applyNoteShape();
            console.log('Controls setup complete');
        } catch (error) {
            console.error('Error setting up controls:', error);
        }
    }
    
    // Load settings from localStorage
    loadSettings() {
        try {
            const saved = localStorage.getItem('fretboardSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.currentVersion = settings.version || this.currentVersion;
                this.currentPalette = settings.palette || this.currentPalette;
                this.numFrets = settings.numFrets || this.numFrets;
                this.mirrorMode = settings.mirrorMode || this.mirrorMode;
                this.noteShape = settings.noteShape || this.noteShape;
                this.customGridRows = settings.customGridRows || this.customGridRows;
                this.customGridCols = settings.customGridCols || this.customGridCols;
                this.gridRowInterval = settings.gridRowInterval || this.gridRowInterval;
                this.gridColInterval = settings.gridColInterval || this.gridColInterval;
                this.currentInstrument = settings.currentInstrument || this.currentInstrument;
                this.currentTuning = settings.currentTuning || this.currentTuning;
                this.currentKey = settings.currentKey || this.currentKey;
                this.currentScale = settings.currentScale || this.currentScale;
                
                // Validate loaded settings
                const instrument = this.instrumentManager.getInstrument(this.currentInstrument);
                if (!instrument) {
                    console.warn('Loaded instrument not found, resetting to default');
                    this.currentInstrument = 'Guitar';
                }
                
                // Load feature toggles
                if (settings.features && this.features && typeof settings.features === 'object') {
                    Object.assign(this.features, settings.features);
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    
    // Save settings to localStorage
    saveSettings() {
        try {
            const settings = {
                version: this.currentVersion,
                palette: this.currentPalette,
                numFrets: this.numFrets,
                mirrorMode: this.mirrorMode,
                noteShape: this.noteShape,
                noteNameFormat: this.noteNameFormat,
                customGridRows: this.customGridRows,
                customGridCols: this.customGridCols,
                gridRowInterval: this.gridRowInterval,
                gridColInterval: this.gridColInterval,
                currentInstrument: this.currentInstrument,
                currentKey: this.currentKey,
                currentScale: this.currentScale,
                features: this.features
            };
            localStorage.setItem('fretboardSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
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
        // Clear all active classes first
        buttons.forEach(btn => btn.classList.remove('active'));
        // Set active button based on loaded settings
        buttons.forEach(btn => {
            if (btn.getAttribute('data-palette') === this.currentPalette) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentPalette = btn.getAttribute('data-palette');
                this.saveSettings();
                this.applyColorPalette();
            });
        });
    }
    
    // Apply note shape to fretboard
    applyNoteShape() {
        const fretboard = document.getElementById('fretboard');
        if (fretboard) {
            fretboard.setAttribute('data-note-shape', this.noteShape);
        }
    }
    
    // Setup fret count input with +/- buttons
    setupFretCountInput() {
        const input = document.getElementById('fret-count-input');
        const decreaseBtn = document.getElementById('fret-count-decrease');
        const increaseBtn = document.getElementById('fret-count-increase');
        
        if (input) {
            input.value = this.numFrets;
            
            const updateFretCount = (newCount) => {
                if (newCount >= 5 && newCount <= 30) {
                    this.numFrets = newCount;
                    input.value = newCount;
                    this.saveSettings();
                    document.documentElement.style.setProperty('--fret-count', newCount);
                    this.createFretboard();
                    this.updateAllVisualizations();
                }
            };
            
            input.addEventListener('change', (e) => {
                const newCount = parseInt(e.target.value);
                if (newCount >= 5 && newCount <= 30) {
                    updateFretCount(newCount);
                } else {
                    e.target.value = this.numFrets;
                }
            });
            
            if (decreaseBtn) {
                decreaseBtn.addEventListener('click', () => {
                    updateFretCount(Math.max(5, this.numFrets - 1));
                });
            }
            
            if (increaseBtn) {
                increaseBtn.addEventListener('click', () => {
                    updateFretCount(Math.min(30, this.numFrets + 1));
                });
            }
        }
    }
    
    // Apply color palette to document
    applyColorPalette() {
        document.body.setAttribute('data-palette', this.currentPalette);
        // Also apply to container for UI elements
        const container = document.querySelector('.container');
        if (container) {
            container.setAttribute('data-palette', this.currentPalette);
        }
    }
    
    // Setup version switcher (visual style)
    setupVersionSwitcher() {
        const buttons = document.querySelectorAll('.version-btn');
        console.log(`Found ${buttons.length} version buttons`);
        // Set active button based on loaded settings
        buttons.forEach(btn => {
            if (parseInt(btn.getAttribute('data-version')) === this.currentVersion) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', (e) => {
                console.log('Version button clicked:', btn.getAttribute('data-version'));
                e.preventDefault();
                e.stopPropagation();
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentVersion = parseInt(btn.getAttribute('data-version'));
                this.saveSettings();
                this.createFretboard();
                this.updateAllVisualizations();
            });
        });
    }
    
    // Setup note shape selector
    setupNoteShapeSelector() {
        const buttons = document.querySelectorAll('.shape-btn');
        // Set active button based on loaded settings
        buttons.forEach(btn => {
            if (btn.getAttribute('data-shape') === this.noteShape) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.noteShape = btn.getAttribute('data-shape');
                this.saveSettings();
                this.createFretboard();
                this.updateAllVisualizations();
            });
        });
    }
    
    // Setup note format selector
    setupNoteFormatSelector() {
        const buttons = document.querySelectorAll('.note-format-btn');
        // Set active button based on loaded settings
        buttons.forEach(btn => {
            if (btn.getAttribute('data-format') === this.noteNameFormat) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.noteNameFormat = btn.getAttribute('data-format');
                this.saveSettings();
                this.createFretboard();
                this.updateAllVisualizations();
            });
        });
    }
    
    // Convert note name to different formats
    convertNoteName(note, format) {
        if (format === 'letter') {
            return note;
        }
        
        const noteMap = {
            'C': { numerical: '1', roman: 'I' },
            'C#': { numerical: '1#', roman: 'I#' },
            'D': { numerical: '2', roman: 'II' },
            'D#': { numerical: '2#', roman: 'II#' },
            'E': { numerical: '3', roman: 'III' },
            'F': { numerical: '4', roman: 'IV' },
            'F#': { numerical: '4#', roman: 'IV#' },
            'G': { numerical: '5', roman: 'V' },
            'G#': { numerical: '5#', roman: 'V#' },
            'A': { numerical: '6', roman: 'VI' },
            'A#': { numerical: '6#', roman: 'VI#' },
            'B': { numerical: '7', roman: 'VII' }
        };
        
        const mapping = noteMap[note];
        if (!mapping) return note;
        
        return format === 'numerical' ? mapping.numerical : mapping.roman;
    }
    
    // Setup instrument selector
    setupInstrumentSelector() {
        const select = document.getElementById('instrument-select');
        if (!select) return;
        
        this.populateInstrumentSelector(select);
        
        // Set the selected instrument from loaded settings
        if (this.currentInstrument) {
            select.value = this.currentInstrument;
        }
        
        select.addEventListener('change', (e) => {
            this.currentInstrument = e.target.value;
            // Update tuning selector when instrument changes
            this.updateTuningSelector();
            // Reset to first tuning if current tuning not available
            const instrument = this.instrumentManager.getInstrument(this.currentInstrument);
            if (instrument && instrument.tunings) {
                const tunings = Object.keys(instrument.tunings);
                if (tunings.length > 0 && (!this.currentTuning || !instrument.tunings[this.currentTuning])) {
                    this.currentTuning = tunings[0];
                    // Update instrument tuning
                    instrument.tuning = instrument.tunings[this.currentTuning];
                }
            }
            this.saveSettings();
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
                this.currentInstrument = 'Guitar';
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
        
        // Update tuning selector after populating instruments
        this.updateTuningSelector();
    }
    
    // Setup tuning selector
    setupTuningSelector() {
        const select = document.getElementById('tuning-select');
        const group = document.getElementById('tuning-selector-group');
        if (!select || !group) return;
        
        select.addEventListener('change', (e) => {
            const tuningName = e.target.value;
            if (!tuningName) return;
            
            const instrument = this.instrumentManager.getInstrument(this.currentInstrument);
            if (instrument && instrument.tunings && instrument.tunings[tuningName]) {
                this.currentTuning = tuningName;
                instrument.tuning = instrument.tunings[tuningName];
                this.saveSettings();
                this.createFretboard();
                this.updateAllVisualizations();
            }
        });
        
        // Initial update
        this.updateTuningSelector();
    }
    
    // Update tuning selector based on current instrument
    updateTuningSelector() {
        const select = document.getElementById('tuning-select');
        const group = document.getElementById('tuning-selector-group');
        if (!select || !group) return;
        
        const instrument = this.instrumentManager.getInstrument(this.currentInstrument);
        if (!instrument) {
            group.style.display = 'none';
            return;
        }
        
        // Show selector if instrument has multiple tunings
        if (instrument.tunings && Object.keys(instrument.tunings).length > 1) {
            group.style.display = 'block';
            select.innerHTML = '<option value="">Select tuning...</option>';
            
            Object.entries(instrument.tunings).forEach(([tuningName, tuning]) => {
                const option = document.createElement('option');
                option.value = tuningName;
                // Show tuning name and notes
                option.textContent = `${tuningName} (${tuning.join(' ')})`;
                option.setAttribute('data-tuning', JSON.stringify(tuning));
                
                if (tuningName === this.currentTuning || (!this.currentTuning && tuningName === 'Standard')) {
                    option.selected = true;
                    this.currentTuning = tuningName;
                    // Update instrument tuning
                    instrument.tuning = tuning;
                }
                
                select.appendChild(option);
            });
        } else {
            group.style.display = 'none';
            // Set default tuning if instrument has single tuning
            if (instrument.tuning) {
                this.currentTuning = null;
                // No need to update instrument.tuning as it's already set
            }
        }
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
            this.saveSettings();
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
            this.saveSettings();
            this.updateAllVisualizations();
            this.updateChordSelector();
            this.updateTriadSelector();
            this.updateCircleHighlights(); // Update circles when scale changes
        });
    }
    
    // Setup feature toggles (now using buttons)
    setupFeatureToggles() {
        const toggles = {
            'toggle-scale': 'scale',
            'toggle-chords': 'chords',
            'toggle-intervals': 'intervals',
            'toggle-patterns': 'patterns',
            'toggle-triads': 'triads'
        };
        
        Object.entries(toggles).forEach(([id, feature]) => {
            const button = document.getElementById(id);
            if (button) {
                // Set initial active state
                if (this.features[feature]) {
                    button.classList.add('active');
                }
                
                button.addEventListener('click', () => {
                    // Toggle feature
                    this.features[feature] = !this.features[feature];
                    
                    // Update button appearance
                    if (this.features[feature]) {
                        button.classList.add('active');
                    } else {
                        button.classList.remove('active');
                    }
                    
                    this.saveSettings();
                    
                    // Show/hide triad controls in bottom bar
                    if (feature === 'triads') {
                        const triadControls = document.getElementById('triad-controls');
                        if (triadControls) {
                            triadControls.style.display = this.features[feature] ? 'flex' : 'none';
                        }
                        // Auto-select first triad if none selected and triads enabled
                        if (this.features[feature] && this.selectedTriads.length === 0) {
                            this.updateTriadSelector();
                            const select = document.getElementById('triad-select');
                            if (select && select.options.length > 1) {
                                select.options[1].selected = true;
                                this.selectedTriads = [select.options[1].value];
                                this.currentTriad = select.options[1].value;
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
    
    // Setup triad selector (now supports multiple selections)
    setupTriadSelector() {
        const select = document.getElementById('triad-select');
        const methodSelect = document.getElementById('triad-method-select');
        
        if (select) {
            this.updateTriadSelector();
            select.addEventListener('change', (e) => {
                // Get all selected options
                const selected = Array.from(e.target.selectedOptions).map(opt => opt.value).filter(v => v);
                this.selectedTriads = selected;
                this.currentTriad = selected.length > 0 ? selected[0] : null; // Keep first for compatibility
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
    
    // Update triad selector options (includes diads)
    updateTriadSelector() {
        const select = document.getElementById('triad-select');
        if (!select) return;
        
        const triads = this.triadVisualizer.getTriadsInScale(this.currentKey, this.currentScale);
        const scaleNotes = this.scaleManager.getScaleNotes(this.currentKey, this.currentScale);
        
        // Generate diads (2-note combinations)
        const diads = [];
        for (let i = 0; i < scaleNotes.length; i++) {
            for (let j = i + 1; j < scaleNotes.length; j++) {
                const note1 = scaleNotes[i];
                const note2 = scaleNotes[j];
                const interval = this.intervalVisualizer.getInterval(note1, note2);
                diads.push({
                    name: `${note1}-${note2}`,
                    notes: [note1, note2],
                    root: note1,
                    type: 'diad',
                    interval: interval
                });
            }
        }
        
        select.innerHTML = '<option value="">None</option>';
        
        // Add triads
        triads.forEach(triad => {
            const option = document.createElement('option');
            option.value = triad.name;
            option.textContent = `${triad.name} (${triad.notes.join(' ')}) - Degree ${triad.scaleDegree}`;
            if (this.selectedTriads.includes(triad.name)) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        
        // Add diads
        diads.forEach(diad => {
            const option = document.createElement('option');
            option.value = diad.name;
            option.textContent = `Diad: ${diad.name} (${this.intervalVisualizer.getIntervalName(diad.interval)})`;
            if (this.selectedTriads.includes(diad.name)) {
                option.selected = true;
            }
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
    
    // Setup tuning editor (now in settings menu)
    setupTuningEditor() {
        const container = document.getElementById('tuning-editor-container');
        const toggleBtn = document.getElementById('toggle-tuning-editor');
        
        if (toggleBtn && container) {
            toggleBtn.addEventListener('click', () => {
                const isVisible = container.style.display !== 'none';
                container.style.display = isVisible ? 'none' : 'block';
                toggleBtn.textContent = isVisible ? 'Show' : 'Hide';
                
                // Initialize editor UI if showing for first time
                if (!isVisible && container.children.length === 0) {
                    this.tuningEditor.createEditorUI(container);
                }
            });
        }
    }
    
    // Setup mirroring controls
    setupMirroring() {
        const buttons = document.querySelectorAll('.mirror-btn');
        // Set active button based on loaded settings
        buttons.forEach(btn => {
            if (btn.getAttribute('data-mirror') === this.mirrorMode) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.mirrorMode = btn.getAttribute('data-mirror');
                this.saveSettings();
                this.createFretboard();
                this.updateAllVisualizations();
            });
        });
    }
    
    // Setup custom grid settings
    setupCustomGridSettings() {
        const rowsInput = document.getElementById('grid-rows-input');
        const colsInput = document.getElementById('grid-cols-input');
        const rowIntervalInput = document.getElementById('grid-row-interval-input');
        const colIntervalInput = document.getElementById('grid-col-interval-input');
        const customGridSettings = document.getElementById('custom-grid-settings');
        const gridIntervalSettings = document.getElementById('grid-interval-settings');
        
        if (rowsInput && colsInput) {
            const updateRows = (newRows) => {
                if (newRows >= 2 && newRows <= 32) {
                    this.customGridRows = newRows;
                    rowsInput.value = newRows;
                    this.saveSettings();
                    if (this.currentInstrument === 'Custom Grid') {
                        this.createFretboard();
                        this.updateAllVisualizations();
                    }
                }
            };
            
            const updateCols = (newCols) => {
                if (newCols >= 2 && newCols <= 32) {
                    this.customGridCols = newCols;
                    colsInput.value = newCols;
                    this.saveSettings();
                    if (this.currentInstrument === 'Custom Grid') {
                        this.createFretboard();
                        this.updateAllVisualizations();
                    }
                }
            };
            
            rowsInput.addEventListener('change', (e) => {
                updateRows(parseInt(e.target.value) || 10);
            });
            
            colsInput.addEventListener('change', (e) => {
                updateCols(parseInt(e.target.value) || 10);
            });
            
            // +/- buttons for rows
            const rowsDecrease = document.getElementById('grid-rows-decrease');
            const rowsIncrease = document.getElementById('grid-rows-increase');
            if (rowsDecrease) {
                rowsDecrease.addEventListener('click', () => updateRows(Math.max(2, this.customGridRows - 1)));
            }
            if (rowsIncrease) {
                rowsIncrease.addEventListener('click', () => updateRows(Math.min(32, this.customGridRows + 1)));
            }
            
            // +/- buttons for cols
            const colsDecrease = document.getElementById('grid-cols-decrease');
            const colsIncrease = document.getElementById('grid-cols-increase');
            if (colsDecrease) {
                colsDecrease.addEventListener('click', () => updateCols(Math.max(2, this.customGridCols - 1)));
            }
            if (colsIncrease) {
                colsIncrease.addEventListener('click', () => updateCols(Math.min(32, this.customGridCols + 1)));
            }
        }
        
        if (rowIntervalInput && colIntervalInput) {
            rowIntervalInput.value = this.gridRowInterval;
            colIntervalInput.value = this.gridColInterval;
            
            const updateRowInterval = (newInterval) => {
                const val = Math.max(1, Math.min(12, newInterval));
                this.gridRowInterval = val;
                rowIntervalInput.value = val;
                this.saveSettings();
                const currentInst = this.instrumentManager.getInstrument(this.currentInstrument);
                if (currentInst && currentInst.type === 'grid') {
                    this.createFretboard();
                    this.updateAllVisualizations();
                }
            };
            
            const updateColInterval = (newInterval) => {
                const val = Math.max(1, Math.min(12, newInterval));
                this.gridColInterval = val;
                colIntervalInput.value = val;
                this.saveSettings();
                const currentInst = this.instrumentManager.getInstrument(this.currentInstrument);
                if (currentInst && currentInst.type === 'grid') {
                    this.createFretboard();
                    this.updateAllVisualizations();
                }
            };
            
            rowIntervalInput.addEventListener('change', (e) => {
                updateRowInterval(parseInt(e.target.value) || 1);
            });
            
            colIntervalInput.addEventListener('change', (e) => {
                updateColInterval(parseInt(e.target.value) || 1);
            });
            
            // +/- buttons for row interval
            const rowIntervalDecrease = document.getElementById('grid-row-interval-decrease');
            const rowIntervalIncrease = document.getElementById('grid-row-interval-increase');
            if (rowIntervalDecrease) {
                rowIntervalDecrease.addEventListener('click', () => updateRowInterval(this.gridRowInterval - 1));
            }
            if (rowIntervalIncrease) {
                rowIntervalIncrease.addEventListener('click', () => updateRowInterval(this.gridRowInterval + 1));
            }
            
            // +/- buttons for col interval
            const colIntervalDecrease = document.getElementById('grid-col-interval-decrease');
            const colIntervalIncrease = document.getElementById('grid-col-interval-increase');
            if (colIntervalDecrease) {
                colIntervalDecrease.addEventListener('click', () => updateColInterval(this.gridColInterval - 1));
            }
            if (colIntervalIncrease) {
                colIntervalIncrease.addEventListener('click', () => updateColInterval(this.gridColInterval + 1));
            }
        }
        
        // Show/hide grid settings based on instrument selection
        const instrumentSelect = document.getElementById('instrument-select');
        if (instrumentSelect) {
            const updateGridSettingsVisibility = (instrumentName) => {
                const isGrid = instrumentName && (
                    instrumentName.startsWith('Grid') || 
                    instrumentName === 'Custom Grid'
                );
                if (customGridSettings) {
                    customGridSettings.style.display = (isGrid && instrumentName === 'Custom Grid') ? 'block' : 'none';
                }
                if (gridIntervalSettings) {
                    gridIntervalSettings.style.display = isGrid ? 'block' : 'none';
                }
            };
            
            instrumentSelect.addEventListener('change', (e) => {
                updateGridSettingsVisibility(e.target.value);
            });
            
            // Set initial visibility
            updateGridSettingsVisibility(this.currentInstrument);
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
                // Button text stays the same (no "Show" prefix)
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
                // Button text stays the same (no "Show" prefix)
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
        fretboard.setAttribute('data-note-shape', this.noteShape);
        
        const instrument = this.instrumentManager.getInstrument(this.currentInstrument);
        if (!instrument) return;
        
        // Handle grid instruments
        if (instrument.type === 'grid') {
            let rows = instrument.rows;
            let cols = instrument.cols;
            
            if (this.currentInstrument === 'Custom Grid') {
                rows = this.customGridRows;
                cols = this.customGridCols;
            }
            
            // Create grid layout
            for (let row = rows - 1; row >= 0; row--) {
                const stringDiv = document.createElement('div');
                stringDiv.className = 'fretboard-string';
                
                // Row label
                const label = document.createElement('div');
                label.className = 'string-label';
                label.textContent = `R${row + 1}`;
                stringDiv.appendChild(label);
                
                // Create columns
                for (let col = 0; col < cols; col++) {
                    const fretDiv = document.createElement('div');
                    // Calculate note based on row and column with configurable intervals
                    // Start from C (index 0), apply row and column intervals
                    const noteIndex = (row * this.gridRowInterval + col * this.gridColInterval) % 12;
                    const note = this.instrumentManager.allNotes[noteIndex];
                    
                    const isNat = this.instrumentManager.isNatural(note);
                    
                    fretDiv.className = `fret ${isNat ? 'natural' : 'accidental'}`;
                    fretDiv.textContent = this.convertNoteName(note, this.noteNameFormat);
                    fretDiv.setAttribute('data-note', note);
                    fretDiv.setAttribute('data-string', row);
                    fretDiv.setAttribute('data-fret', col);
                    fretDiv.setAttribute('title', `Row ${row + 1}, Col ${col + 1}: ${note}`);
                    
                    stringDiv.appendChild(fretDiv);
                }
                
                fretboard.appendChild(stringDiv);
            }
            
            console.log(`Grid created with ${rows} rows and ${cols} columns`);
        } else {
            // Standard instrument with tuning
            // Get tuning - use currentTuning if available, otherwise use default
            let tuning = instrument.tuning;
            if (instrument.tunings && this.currentTuning && instrument.tunings[this.currentTuning]) {
                tuning = instrument.tunings[this.currentTuning];
            } else if (instrument.tunings && !this.currentTuning) {
                // Use first tuning if no currentTuning set
                const firstTuning = Object.values(instrument.tunings)[0];
                if (firstTuning) {
                    tuning = firstTuning;
                    this.currentTuning = Object.keys(instrument.tunings)[0];
                }
            }
            
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
                    const displayNote = this.convertNoteName(note, this.noteNameFormat);
                    fretDiv.textContent = displayNote;
                    fretDiv.setAttribute('data-note', note);
                    fretDiv.setAttribute('data-string', stringIndex);
                    fretDiv.setAttribute('data-fret', fret);
                    fretDiv.setAttribute('title', `${openNote} string, fret ${fret}: ${note}`);
                    
                    stringDiv.appendChild(fretDiv);
                }
                
                fretboard.appendChild(stringDiv);
            }
            
            console.log(`Fretboard created with ${tuning.length} strings and ${this.numFrets + 1} frets`);
        }
        
        // Apply mirroring - only mirror positions, not text
        // Mirror the container, but keep text readable by mirroring it back
        const fretboardContainer = fretboard.closest('.fretboard-container');
        if (fretboardContainer) {
            // Remove any existing mirror classes
            fretboardContainer.classList.remove('mirror-horizontal', 'mirror-vertical');
            fretboard.classList.remove('mirror-horizontal', 'mirror-vertical');
            
            if (this.mirrorMode === 'horizontal') {
                fretboardContainer.classList.add('mirror-horizontal');
                fretboard.classList.add('mirror-horizontal'); // Un-mirror text
            } else if (this.mirrorMode === 'vertical') {
                fretboardContainer.classList.add('mirror-vertical');
                fretboard.classList.add('mirror-vertical'); // Un-mirror text
            }
        }
        
        // Apply MIDI labels if available
        if (this.midiSupport && instrument.tuning) {
            try {
                this.midiSupport.applyMIDILabels(fretboard, instrument.tuning);
            } catch (error) {
                console.error('Error applying MIDI labels:', error);
            }
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
        
        // Get tuning - use currentTuning if available, otherwise use default
        let tuning = instrument.tuning;
        if (instrument.tunings && this.currentTuning && instrument.tunings[this.currentTuning]) {
            tuning = instrument.tunings[this.currentTuning];
        } else if (instrument.tunings && !this.currentTuning) {
            // Use first tuning if no currentTuning set
            const firstTuning = Object.values(instrument.tunings)[0];
            if (firstTuning) {
                tuning = firstTuning;
                this.currentTuning = Object.keys(instrument.tunings)[0];
            }
        }
        const scaleNotes = this.scaleManager.getScaleNotes(this.currentKey, this.currentScale);
        
        // Clear all visualizations first
        this.scaleVisualizer.clearScale(fretboard);
        this.chordVisualizer.clearChordHighlight(fretboard);
        this.intervalVisualizer.clearIntervals(fretboard);
        this.patternVisualizer.clearPatterns(fretboard);
        this.triadVisualizer.clearTriads(fretboard);
        if (this.scaleDegreeVisualizer) {
            this.scaleDegreeVisualizer.clearScaleDegrees(fretboard);
        }
        
        // Clear note selection
        if (this.noteInteractionManager) {
            this.noteInteractionManager.clearSelection(fretboard);
        }
        
        // Apply scale highlighting
        if (this.features.scale && scaleNotes.length > 0) {
            const style = this.currentVersion === 3 ? 'minimal' : 'default';
            this.scaleVisualizer.applyScale(fretboard, scaleNotes, this.currentKey, style);
        }
        
        // Apply chord overlay (works on all layouts including grids)
        if (this.features.chords && this.currentChord) {
            try {
                const chords = this.chordVisualizer.getChordsInScale(this.currentKey, this.currentScale);
                const chord = chords.find(c => c.name === this.currentChord);
                if (chord) {
                    this.chordVisualizer.highlightChord(fretboard, chord.notes, chord.root);
                }
            } catch (error) {
                console.error('Error highlighting chords:', error);
                if (window.debugConsole) {
                    window.debugConsole.addEntry('error', `Chord highlighting error: ${error.message}`);
                }
            }
        }
        
        // Apply interval highlighting (works on all layouts including grids)
        if (this.features.intervals) {
            try {
                this.intervalVisualizer.highlightIntervals(fretboard, this.currentKey);
            } catch (error) {
                console.error('Error highlighting intervals:', error);
                if (window.debugConsole) {
                    window.debugConsole.addEntry('error', `Interval highlighting error: ${error.message}`);
                }
            }
        }
        
        // Apply scale patterns (works on all layouts including grids)
        if (this.features.patterns) {
            try {
                if (instrument.type === 'grid') {
                    // For grids, find patterns from DOM
                    const patterns = this.patternVisualizer.findPatternsFromDOM(scaleNotes, this.currentKey, fretboard);
                    if (patterns.length > 0) {
                        this.patternVisualizer.highlightPattern(fretboard, patterns[0], 'caged');
                    }
                } else {
                    const patterns = this.patternVisualizer.findCAGEDPatterns(scaleNotes, this.currentKey, tuning, this.numFrets);
                    if (patterns.length > 0) {
                        this.patternVisualizer.highlightPattern(fretboard, patterns[0], 'caged');
                    }
                }
            } catch (error) {
                console.error('Error highlighting patterns:', error);
                if (window.debugConsole) {
                    window.debugConsole.addEntry('error', `Pattern highlighting error: ${error.message}`);
                }
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
        
        // Apply triad/diad visualization (works on all layouts including grids)
        if (this.features.triads && this.selectedTriads.length > 0) {
            try {
                const triads = this.triadVisualizer.getTriadsInScale(this.currentKey, this.currentScale);
                const scaleNotes = this.scaleManager.getScaleNotes(this.currentKey, this.currentScale);
                
                // Clear previous connections
                this.triadVisualizer.clearTriadConnections();
                
                // Process each selected triad/diad
                this.selectedTriads.forEach(selectedName => {
                    // Check if it's a triad
                    let triad = triads.find(t => t.name === selectedName);
                    let isDiad = false;
                    
                    // If not a triad, check if it's a diad
                    if (!triad && selectedName.includes('-')) {
                        const [note1, note2] = selectedName.split('-');
                        if (scaleNotes.includes(note1) && scaleNotes.includes(note2)) {
                            triad = {
                                name: selectedName,
                                notes: [note1, note2],
                                root: note1,
                                type: 'diad'
                            };
                            isDiad = true;
                        }
                    }
                    
                    if (triad) {
                        let positions;
                        if (instrument.type === 'grid') {
                            positions = this.triadVisualizer.findTriadPositionsFromDOM(triad, fretboard, this.triadMethod);
                        } else {
                            if (this.triadMethod === 'string-sets-2-3') {
                                // Special mode: show all positions on 2-3 strings
                                positions = this.triadVisualizer.findAllStringSetPositions(triad, tuning, this.numFrets, isDiad);
                            } else {
                                positions = this.triadVisualizer.findTriadPositions(triad, tuning, this.numFrets, this.triadMethod);
                            }
                        }
                        
                        if (positions && positions.length > 0 && Array.isArray(positions)) {
                            // Show all positions for this triad/diad (don't limit - show all selected)
                            positions.forEach((pos, idx) => {
                                // Use different colors/opacity for multiple positions
                                const opacity = positions.length > 1 ? 0.6 + (idx % 3) * 0.1 : 1;
                                this.triadVisualizer.highlightTriad(fretboard, pos, this.triadMethod, idx, opacity);
                            });
                        }
                    }
                });
            } catch (error) {
                console.error('Error highlighting triads:', error);
                if (window.debugConsole) {
                    window.debugConsole.addEntry('error', `Triad highlighting error: ${error.message}`);
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
        TuningEditor: typeof TuningEditor,
        NoteInteractionManager: typeof NoteInteractionManager,
        TriadVisualizer: typeof TriadVisualizer,
        LegendManager: typeof LegendManager,
        ScaleDegreeVisualizer: typeof ScaleDegreeVisualizer,
        FretMarkerVisualizer: typeof FretMarkerVisualizer,
        ChordLibrary: typeof ChordLibrary,
        MIDISupport: typeof MIDISupport
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
