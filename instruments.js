// Instrument Configurations
class InstrumentManager {
    constructor() {
        this.allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        // Instrument presets with multiple tuning options
        this.instruments = {
            'Guitar': {
                tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
                name: 'Guitar',
                description: 'Standard EADGBE tuning',
                tunings: {
                    'Standard': ['E', 'A', 'D', 'G', 'B', 'E'],
                    'Drop D': ['D', 'A', 'D', 'G', 'B', 'E'],
                    'Drop C': ['C', 'G', 'C', 'F', 'A', 'D'],
                    'Open D': ['D', 'A', 'D', 'F#', 'A', 'D'],
                    'Open G': ['D', 'G', 'D', 'G', 'B', 'D'],
                    'DADGAD': ['D', 'A', 'D', 'G', 'A', 'D'],
                    'Nashville': ['E', 'A', 'D', 'G', 'B', 'E'], // High strung
                    'New Standard': ['C', 'G', 'D', 'A', 'E', 'G']
                }
            },
            'Guitar (7-string)': {
                tuning: ['B', 'E', 'A', 'D', 'G', 'B', 'E'],
                name: 'Guitar (7-string)',
                description: '7-string guitar with low B',
                tunings: {
                    'Standard': ['B', 'E', 'A', 'D', 'G', 'B', 'E'],
                    'Drop A': ['A', 'E', 'A', 'D', 'G', 'B', 'E']
                }
            },
            'Guitar (8-string)': {
                tuning: ['F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E'],
                name: 'Guitar (8-string)',
                description: '8-string guitar with low F# and B',
                tunings: {
                    'Standard': ['F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E'],
                    'Drop E': ['E', 'B', 'E', 'A', 'D', 'G', 'B', 'E']
                }
            },
            'Mandolin': {
                tuning: ['G', 'D', 'A', 'E'],
                name: 'Mandolin',
                description: 'Standard GDAE tuning',
                tunings: {
                    'Standard': ['G', 'D', 'A', 'E'],
                    'Octave Mandolin': ['G', 'D', 'A', 'E']
                }
            },
            'Banjo (5-string)': {
                tuning: ['G', 'D', 'G', 'B', 'D'],
                name: 'Banjo (5-string)',
                description: 'Standard 5-string banjo tuning',
                tunings: {
                    'Standard': ['G', 'D', 'G', 'B', 'D'],
                    'Open G': ['G', 'D', 'G', 'B', 'D'],
                    'Double C': ['G', 'C', 'G', 'C', 'D']
                }
            },
            'Ukulele (Soprano)': {
                tuning: ['G', 'C', 'E', 'A'],
                name: 'Ukulele (Soprano)',
                description: 'Standard GCEA tuning',
                tunings: {
                    'Standard': ['G', 'C', 'E', 'A'],
                    'Low G': ['G', 'C', 'E', 'A'],
                    'D Tuning': ['A', 'D', 'F#', 'B']
                }
            },
            'Bass (4-string)': {
                tuning: ['E', 'A', 'D', 'G'],
                name: 'Bass (4-string)',
                description: 'Standard bass tuning',
                tunings: {
                    'Standard': ['E', 'A', 'D', 'G'],
                    'Drop D': ['D', 'A', 'D', 'G']
                }
            },
            'Bass (5-string)': {
                tuning: ['B', 'E', 'A', 'D', 'G'],
                name: 'Bass (5-string)',
                description: '5-string bass with low B',
                tunings: {
                    'Standard': ['B', 'E', 'A', 'D', 'G'],
                    'High C': ['E', 'A', 'D', 'G', 'C']
                }
            },
            'Bass (6-string)': {
                tuning: ['B', 'E', 'A', 'D', 'G', 'C'],
                name: 'Bass (6-string)',
                description: '6-string bass with low B and high C',
                tunings: {
                    'Standard': ['B', 'E', 'A', 'D', 'G', 'C']
                }
            },
            'Grid 8x8': {
                tuning: null, // Grids use rows/cols instead
                name: 'Grid 8x8',
                description: '8 rows by 8 columns grid',
                type: 'grid',
                rows: 8,
                cols: 8
            },
            'Grid 8x16': {
                tuning: null,
                name: 'Grid 8x16',
                description: '8 rows by 16 columns grid',
                type: 'grid',
                rows: 8,
                cols: 16
            },
            'Grid 16x8': {
                tuning: null,
                name: 'Grid 16x8',
                description: '16 rows by 8 columns grid',
                type: 'grid',
                rows: 16,
                cols: 8
            },
            'Grid 16x16': {
                tuning: null,
                name: 'Grid 16x16',
                description: '16 rows by 16 columns grid',
                type: 'grid',
                rows: 16,
                cols: 16
            },
            'Custom Grid': {
                tuning: null,
                name: 'Custom Grid',
                description: 'Custom grid with configurable rows and columns',
                type: 'grid',
                rows: 10,
                cols: 10
            }
        };
    }
    
    // Get all instrument names
    getInstrumentNames() {
        return Object.keys(this.instruments);
    }
    
    // Get instrument configuration
    getInstrument(name) {
        const instrument = this.instruments[name];
        if (!instrument) return null;
        
        // If instrument has multiple tunings and a currentTuning is set, use that
        // Otherwise return the instrument with its default tuning
        return instrument;
    }
    
    // Get available tunings for an instrument
    getTuningsForInstrument(instrumentName) {
        const instrument = this.instruments[instrumentName];
        if (!instrument) return null;
        
        if (instrument.tunings) {
            return instrument.tunings;
        }
        
        // If no tunings object, return default tuning as single option
        return { 'Standard': instrument.tuning };
    }
    
    // Get tuning for instrument (with optional tuning name)
    getTuningForInstrument(instrumentName, tuningName = null) {
        const instrument = this.instruments[instrumentName];
        if (!instrument) return null;
        
        if (instrument.tunings) {
            if (tuningName && instrument.tunings[tuningName]) {
                return instrument.tunings[tuningName];
            }
            // Return first tuning if no name specified
            return Object.values(instrument.tunings)[0] || instrument.tuning;
        }
        
        return instrument.tuning;
    }
    
    // Create custom instrument
    createCustomInstrument(name, tuning, description = '') {
        this.instruments[name] = {
            tuning: tuning,
            name: name,
            description: description || `Custom tuning: ${tuning.join(' ')}`
        };
        return this.instruments[name];
    }
    
    // Calculate note at a given string and fret
    getNote(tuning, stringIndex, fret) {
        if (!tuning || stringIndex < 0 || stringIndex >= tuning.length) return null;
        const openNote = tuning[stringIndex];
        const openNoteIndex = this.allNotes.indexOf(openNote);
        if (openNoteIndex === -1) return null;
        const noteIndex = (openNoteIndex + fret) % 12;
        return this.allNotes[noteIndex];
    }
    
    // Check if note is natural (no sharp/flat)
    isNatural(note) {
        const naturalNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        return naturalNotes.includes(note);
    }
}
