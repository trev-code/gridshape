// Chord Library System - Comprehensive chord definitions
class ChordLibrary {
    constructor() {
        this.allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        // Comprehensive chord definitions (intervals from root in semitones)
        this.chordDefinitions = {
            // Triads
            '': [0, 4, 7],           // Major
            'm': [0, 3, 7],          // Minor
            'dim': [0, 3, 6],        // Diminished
            'aug': [0, 4, 8],        // Augmented
            'sus2': [0, 2, 7],       // Suspended 2nd
            'sus4': [0, 5, 7],       // Suspended 4th
            
            // 7th Chords
            '7': [0, 4, 7, 10],      // Dominant 7th
            'maj7': [0, 4, 7, 11],   // Major 7th
            'm7': [0, 3, 7, 10],     // Minor 7th
            'dim7': [0, 3, 6, 9],    // Diminished 7th
            'm7b5': [0, 3, 6, 10],   // Half-diminished 7th
            'aug7': [0, 4, 8, 10],   // Augmented 7th
            '7sus4': [0, 5, 7, 10],  // 7th suspended 4th
            
            // Extended Chords
            '9': [0, 4, 7, 10, 14],      // Dominant 9th
            'maj9': [0, 4, 7, 11, 14],   // Major 9th
            'm9': [0, 3, 7, 10, 14],     // Minor 9th
            '11': [0, 4, 7, 10, 14, 17], // Dominant 11th
            '13': [0, 4, 7, 10, 14, 21], // Dominant 13th
            
            // Add Chords
            'add9': [0, 4, 7, 14],       // Add 9th
            '6': [0, 4, 7, 9],          // 6th
            'm6': [0, 3, 7, 9],         // Minor 6th
            '6/9': [0, 4, 7, 9, 14],    // 6/9
            
            // Altered Chords
            '7b5': [0, 4, 6, 10],       // 7th flat 5
            '7#5': [0, 4, 8, 10],       // 7th sharp 5
            '7b9': [0, 4, 7, 10, 13],   // 7th flat 9
            '7#9': [0, 4, 7, 10, 15],   // 7th sharp 9
            '7#11': [0, 4, 7, 10, 18],  // 7th sharp 11
            
            // Slash Chords (bass note specified separately)
            // Format: 'C/E' where E is the bass note
        };
    }
    
    // Get chord notes from root and quality
    getChordNotes(root, quality) {
        try {
            if (!root || !this.allNotes.includes(root)) {
                console.warn(`ChordLibrary: Invalid root note: ${root}`);
                return [];
            }
            
            const intervals = this.chordDefinitions[quality || ''];
            if (!intervals) {
                console.warn(`ChordLibrary: Unknown chord quality: ${quality}`);
                return [];
            }
            
            const rootIndex = this.allNotes.indexOf(root);
            const notes = intervals.map(interval => {
                const noteIndex = (rootIndex + interval) % 12;
                return this.allNotes[noteIndex];
            });
            
            return notes;
        } catch (error) {
            console.error('ChordLibrary: Error getting chord notes:', error);
            return [];
        }
    }
    
    // Get all available chord qualities
    getAvailableQualities() {
        return Object.keys(this.chordDefinitions);
    }
    
    // Parse chord name (e.g., "Cm7" -> {root: "C", quality: "m7"})
    parseChordName(chordName) {
        try {
            if (!chordName || typeof chordName !== 'string') {
                return null;
            }
            
            // Match root note (C, C#, D, etc.)
            const rootMatch = chordName.match(/^([A-G]#?)/);
            if (!rootMatch) {
                return null;
            }
            
            const root = rootMatch[1];
            const quality = chordName.substring(root.length);
            
            return { root, quality };
        } catch (error) {
            console.error('ChordLibrary: Error parsing chord name:', error);
            return null;
        }
    }
    
    // Get chord name from root and quality
    getChordName(root, quality) {
        return quality ? `${root}${quality}` : root;
    }
}
