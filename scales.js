// Scale Definitions and Calculations
class ScaleManager {
    constructor() {
        this.allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        // Scale definitions: intervals in semitones from root
        this.scaleDefinitions = {
            // Major scales and modes
            'Major (Ionian)': [0, 2, 4, 5, 7, 9, 11],
            'Dorian': [0, 2, 3, 5, 7, 9, 10],
            'Phrygian': [0, 1, 3, 5, 7, 8, 10],
            'Lydian': [0, 2, 4, 6, 7, 9, 11],
            'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
            'Aeolian (Natural Minor)': [0, 2, 3, 5, 7, 8, 10],
            'Locrian': [0, 1, 3, 5, 6, 8, 10],
            
            // Pentatonic scales
            'Pentatonic Major': [0, 2, 4, 7, 9],
            'Pentatonic Minor': [0, 3, 5, 7, 10],
            
            // Blues scales
            'Blues Major': [0, 2, 3, 4, 7, 9],
            'Blues Minor': [0, 3, 5, 6, 7, 10],
            
            // Jazz scales
            'Barry Harris (6th Diminished)': [0, 2, 3, 5, 6, 7, 9, 10, 11], // 6th diminished scale
            'Melodic Minor': [0, 2, 3, 5, 7, 9, 11],
            'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
            'Dorian b2': [0, 1, 3, 5, 7, 9, 10],
            'Lydian Dominant': [0, 2, 4, 6, 7, 9, 10],
            'Altered (Super Locrian)': [0, 1, 3, 4, 6, 8, 10],
            
            // Eastern scales
            'Hungarian Minor': [0, 2, 3, 6, 7, 8, 11],
            'Persian': [0, 1, 4, 5, 6, 8, 11],
            'Hijaz': [0, 1, 4, 5, 7, 8, 10],
            'Phrygian Dominant': [0, 1, 4, 5, 7, 8, 10],
            'Double Harmonic': [0, 1, 4, 5, 7, 8, 11],
            'Hirajoshi': [0, 2, 3, 7, 8],
            'In Sen': [0, 1, 5, 7, 10],
            
            // African scales
            'Kumoi': [0, 2, 3, 7, 9],
            'Pelog': [0, 1, 3, 7, 8],
            'Slendro': [0, 2, 5, 7, 9],
            
            // Other scales
            'Whole Tone': [0, 2, 4, 6, 8, 10],
            'Diminished (Half-Whole)': [0, 1, 3, 4, 6, 7, 9, 10],
            'Diminished (Whole-Half)': [0, 2, 3, 5, 6, 8, 9, 11],
            'Chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            'Major Bebop': [0, 2, 4, 5, 7, 8, 9, 11],
            'Minor Bebop': [0, 2, 3, 5, 7, 8, 9, 10],
        };
    }
    
    // Get all available scale names
    getScaleNames() {
        return Object.keys(this.scaleDefinitions);
    }
    
    // Get all available keys (A to G#)
    getKeys() {
        return this.allNotes;
    }
    
    // Calculate scale notes for a given key and scale
    getScaleNotes(rootKey, scaleName) {
        if (!this.scaleDefinitions[scaleName]) {
            return [];
        }
        
        const rootIndex = this.allNotes.indexOf(rootKey);
        if (rootIndex === -1) {
            return [];
        }
        
        const intervals = this.scaleDefinitions[scaleName];
        const scaleNotes = intervals.map(interval => {
            const noteIndex = (rootIndex + interval) % 12;
            return this.allNotes[noteIndex];
        });
        
        return scaleNotes;
    }
    
    // Check if a note is in the scale
    isNoteInScale(note, rootKey, scaleName) {
        const scaleNotes = this.getScaleNotes(rootKey, scaleName);
        return scaleNotes.includes(note);
    }
    
    // Get scale degree of a note (1-based, 0 if not in scale)
    getScaleDegree(note, rootKey, scaleName) {
        const scaleNotes = this.getScaleNotes(rootKey, scaleName);
        const degree = scaleNotes.indexOf(note);
        return degree >= 0 ? degree + 1 : 0;
    }
}
