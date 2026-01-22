// Chord Visualization System
class ChordVisualizer {
    constructor(scaleManager) {
        this.scaleManager = scaleManager;
        this.allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    }
    
    // Get chords that fit in a scale
    getChordsInScale(rootKey, scaleName) {
        const scaleNotes = this.scaleManager.getScaleNotes(rootKey, scaleName);
        const chords = [];
        
        // Generate triads for each scale degree
        scaleNotes.forEach((root, index) => {
            const thirdIndex = (index + 2) % scaleNotes.length;
            const fifthIndex = (index + 4) % scaleNotes.length;
            
            const third = scaleNotes[thirdIndex];
            const fifth = scaleNotes[fifthIndex];
            
            // Determine chord quality
            const rootIdx = this.allNotes.indexOf(root);
            const thirdIdx = this.allNotes.indexOf(third);
            const fifthIdx = this.allNotes.indexOf(fifth);
            
            const thirdInterval = (thirdIdx - rootIdx + 12) % 12;
            const fifthInterval = (fifthIdx - rootIdx + 12) % 12;
            
            let quality = '';
            if (thirdInterval === 3 && fifthInterval === 6) quality = 'm'; // minor
            else if (thirdInterval === 4 && fifthInterval === 7) quality = ''; // major
            else if (thirdInterval === 3 && fifthInterval === 5) quality = 'dim'; // diminished
            else if (thirdInterval === 4 && fifthInterval === 8) quality = 'aug'; // augmented
            
            chords.push({
                root: root,
                third: third,
                fifth: fifth,
                quality: quality,
                name: root + quality,
                notes: [root, third, fifth]
            });
        });
        
        return chords;
    }
    
    // Get 7th chords in scale
    getSeventhChordsInScale(rootKey, scaleName) {
        const scaleNotes = this.scaleManager.getScaleNotes(rootKey, scaleName);
        const chords = [];
        
        scaleNotes.forEach((root, index) => {
            const thirdIndex = (index + 2) % scaleNotes.length;
            const fifthIndex = (index + 4) % scaleNotes.length;
            const seventhIndex = (index + 6) % scaleNotes.length;
            
            const third = scaleNotes[thirdIndex];
            const fifth = scaleNotes[fifthIndex];
            const seventh = scaleNotes[seventhIndex];
            
            chords.push({
                root: root,
                third: third,
                fifth: fifth,
                seventh: seventh,
                notes: [root, third, fifth, seventh],
                name: root + '7'
            });
        });
        
        return chords;
    }
    
    // Highlight chord on fretboard
    highlightChord(fretboardElement, chordNotes, rootNote) {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        
        allFrets.forEach(fret => {
            fret.classList.remove('chord-note', 'chord-root');
            const note = fret.getAttribute('data-note');
            
            if (chordNotes.includes(note)) {
                if (note === rootNote) {
                    fret.classList.add('chord-root');
                } else {
                    fret.classList.add('chord-note');
                }
            }
        });
    }
    
    // Clear chord highlighting
    clearChordHighlight(fretboardElement) {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        allFrets.forEach(fret => {
            fret.classList.remove('chord-note', 'chord-root');
        });
    }
}
