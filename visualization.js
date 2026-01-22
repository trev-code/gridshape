// Visualization Layer for Scale Highlighting
class ScaleVisualizer {
    constructor() {
        this.highlightStyles = {
            'default': {
                inScale: 'scale-note',
                rootNote: 'scale-root',
                outOfScale: 'scale-out'
            },
            'subtle': {
                inScale: 'scale-note-subtle',
                rootNote: 'scale-root-subtle',
                outOfScale: 'scale-out-subtle'
            },
            'bold': {
                inScale: 'scale-note-bold',
                rootNote: 'scale-root-bold',
                outOfScale: 'scale-out-bold'
            },
            'colorful': {
                inScale: 'scale-note-colorful',
                rootNote: 'scale-root-colorful',
                outOfScale: 'scale-out-colorful'
            },
            'minimal': {
                inScale: 'scale-note-minimal',
                rootNote: 'scale-root-minimal',
                outOfScale: 'scale-out-minimal'
            }
        };
        
        this.currentStyle = 'default';
    }
    
    // Apply scale visualization to fretboard
    applyScale(fretboardElement, scaleNotes, rootNote, style = 'default') {
        this.currentStyle = style;
        const styles = this.highlightStyles[style] || this.highlightStyles['default'];
        
        // Remove previous scale classes
        const allFrets = fretboardElement.querySelectorAll('.fret');
        allFrets.forEach(fret => {
            fret.classList.remove(
                'scale-note', 'scale-root', 'scale-out',
                'scale-note-subtle', 'scale-root-subtle', 'scale-out-subtle',
                'scale-note-bold', 'scale-root-bold', 'scale-out-bold',
                'scale-note-colorful', 'scale-root-colorful', 'scale-out-colorful',
                'scale-note-minimal', 'scale-root-minimal', 'scale-out-minimal'
            );
        });
        
        // Apply new scale highlighting
        allFrets.forEach(fret => {
            const note = fret.getAttribute('data-note');
            if (!note) return;
            
            if (note === rootNote) {
                fret.classList.add(styles.rootNote);
            } else if (scaleNotes.includes(note)) {
                fret.classList.add(styles.inScale);
            } else {
                fret.classList.add(styles.outOfScale);
            }
        });
    }
    
    // Clear scale visualization
    clearScale(fretboardElement) {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        allFrets.forEach(fret => {
            fret.classList.remove(
                'scale-note', 'scale-root', 'scale-out',
                'scale-note-subtle', 'scale-root-subtle', 'scale-out-subtle',
                'scale-note-bold', 'scale-root-bold', 'scale-out-bold',
                'scale-note-colorful', 'scale-root-colorful', 'scale-out-colorful',
                'scale-note-minimal', 'scale-root-minimal', 'scale-out-minimal'
            );
        });
    }
    
    // Get available highlight styles
    getHighlightStyles() {
        return Object.keys(this.highlightStyles);
    }
}
