// Instrument Configurations
class InstrumentManager {
    constructor() {
        this.allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        // Instrument presets
        this.instruments = {
            'Guitar (Standard)': {
                tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
                name: 'Guitar (Standard)',
                description: 'Standard EADGBE tuning'
            },
            'Guitar (Drop D)': {
                tuning: ['D', 'A', 'D', 'G', 'B', 'E'],
                name: 'Guitar (Drop D)',
                description: 'Drop D tuning'
            },
            'Mandolin': {
                tuning: ['G', 'D', 'A', 'E'],
                name: 'Mandolin',
                description: 'Standard GDAE tuning'
            },
            'Banjo (5-string)': {
                tuning: ['G', 'D', 'G', 'B', 'D'],
                name: 'Banjo (5-string)',
                description: 'Standard 5-string banjo tuning'
            },
            'Ukulele (Soprano)': {
                tuning: ['G', 'C', 'E', 'A'],
                name: 'Ukulele (Soprano)',
                description: 'Standard GCEA tuning'
            },
            'Bass (4-string)': {
                tuning: ['E', 'A', 'D', 'G'],
                name: 'Bass (4-string)',
                description: 'Standard bass tuning'
            },
            'Bass (5-string)': {
                tuning: ['B', 'E', 'A', 'D', 'G'],
                name: 'Bass (5-string)',
                description: '5-string bass with low B'
            }
        };
    }
    
    // Get all instrument names
    getInstrumentNames() {
        return Object.keys(this.instruments);
    }
    
    // Get instrument configuration
    getInstrument(name) {
        return this.instruments[name] || null;
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
