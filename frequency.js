// Note Frequency Display
class FrequencyVisualizer {
    constructor(scaleManager, instrumentManager) {
        this.scaleManager = scaleManager;
        this.instrumentManager = instrumentManager;
    }
    
    // Count frequency of each note in scale across fretboard
    countNoteFrequency(scaleNotes, tuning, numFrets) {
        const frequency = {};
        
        // Initialize all scale notes
        scaleNotes.forEach(note => {
            frequency[note] = 0;
        });
        
        // Count occurrences
        for (let stringIndex = 0; stringIndex < tuning.length; stringIndex++) {
            for (let fret = 0; fret <= numFrets; fret++) {
                const note = this.instrumentManager.getNote(tuning, stringIndex, fret);
                if (scaleNotes.includes(note)) {
                    frequency[note] = (frequency[note] || 0) + 1;
                }
            }
        }
        
        return frequency;
    }
    
    // Display frequency on fretboard
    displayFrequency(fretboardElement, frequency, maxFrequency) {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        
        allFrets.forEach(fret => {
            const note = fret.getAttribute('data-note');
            if (!note || !frequency[note]) return;
            
            const count = frequency[note];
            const intensity = count / maxFrequency;
            
            // Add frequency class based on intensity
            fret.classList.remove('freq-high', 'freq-medium', 'freq-low');
            
            if (intensity >= 0.7) {
                fret.classList.add('freq-high');
            } else if (intensity >= 0.4) {
                fret.classList.add('freq-medium');
            } else {
                fret.classList.add('freq-low');
            }
            
            // Add count to title
            const currentTitle = fret.getAttribute('title') || '';
            fret.setAttribute('title', `${currentTitle} (${count} occurrences)`);
        });
    }
    
    // Clear frequency display
    clearFrequency(fretboardElement) {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        allFrets.forEach(fret => {
            fret.classList.remove('freq-high', 'freq-medium', 'freq-low');
        });
    }
    
    // Get frequency statistics
    getFrequencyStats(frequency) {
        const notes = Object.keys(frequency);
        const counts = notes.map(note => frequency[note]);
        const max = Math.max(...counts);
        const min = Math.min(...counts);
        const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
        
        return {
            max: max,
            min: min,
            avg: avg,
            distribution: frequency
        };
    }
}
