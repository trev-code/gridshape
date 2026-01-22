// Interval Highlighting System
class IntervalVisualizer {
    constructor(scaleManager) {
        this.scaleManager = scaleManager;
        this.allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        this.intervalNames = {
            0: 'Root',
            1: 'Minor 2nd',
            2: 'Major 2nd',
            3: 'Minor 3rd',
            4: 'Major 3rd',
            5: 'Perfect 4th',
            6: 'Tritone',
            7: 'Perfect 5th',
            8: 'Minor 6th',
            9: 'Major 6th',
            10: 'Minor 7th',
            11: 'Major 7th'
        };
    }
    
    // Calculate interval from root to note
    getInterval(rootNote, targetNote) {
        const rootIndex = this.allNotes.indexOf(rootNote);
        const targetIndex = this.allNotes.indexOf(targetNote);
        
        if (rootIndex === -1 || targetIndex === -1) return null;
        
        const interval = (targetIndex - rootIndex + 12) % 12;
        return interval;
    }
    
    // Get interval name
    getIntervalName(interval) {
        return this.intervalNames[interval] || `Interval ${interval}`;
    }
    
    // Highlight intervals on fretboard
    highlightIntervals(fretboardElement, rootNote, showIntervals = []) {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        
        allFrets.forEach(fret => {
            // Remove all interval classes
            fret.classList.remove(
                'interval-root', 'interval-2nd', 'interval-3rd', 'interval-4th',
                'interval-5th', 'interval-6th', 'interval-7th', 'interval-tritone'
            );
            
            const note = fret.getAttribute('data-note');
            if (!note) return;
            
            const interval = this.getInterval(rootNote, note);
            if (interval === null) return;
            
            // If showIntervals is empty, show all; otherwise filter
            if (showIntervals.length > 0 && !showIntervals.includes(interval)) {
                return;
            }
            
            // Add interval class
            if (interval === 0) {
                fret.classList.add('interval-root');
            } else if (interval === 2 || interval === 1) {
                fret.classList.add('interval-2nd');
            } else if (interval === 3 || interval === 4) {
                fret.classList.add('interval-3rd');
            } else if (interval === 5) {
                fret.classList.add('interval-4th');
            } else if (interval === 6) {
                fret.classList.add('interval-tritone');
            } else if (interval === 7) {
                fret.classList.add('interval-5th');
            } else if (interval === 8 || interval === 9) {
                fret.classList.add('interval-6th');
            } else if (interval === 10 || interval === 11) {
                fret.classList.add('interval-7th');
            }
            
            // Add title with interval name
            const intervalName = this.getIntervalName(interval);
            const currentTitle = fret.getAttribute('title') || '';
            fret.setAttribute('title', `${currentTitle} - ${intervalName}`);
        });
    }
    
    // Clear interval highlighting
    clearIntervals(fretboardElement) {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        allFrets.forEach(fret => {
            fret.classList.remove(
                'interval-root', 'interval-2nd', 'interval-3rd', 'interval-4th',
                'interval-5th', 'interval-6th', 'interval-7th', 'interval-tritone'
            );
        });
    }
}
