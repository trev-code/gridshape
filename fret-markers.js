// Fret Markers and Position Indicators
class FretMarkerVisualizer {
    constructor() {
        this.standardFretMarkers = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24]; // Common fret positions
    }
    
    // Apply fret markers to fretboard
    applyFretMarkers(fretboardElement, numFrets) {
        try {
            if (!fretboardElement || !numFrets) {
                console.warn('FretMarkerVisualizer: Missing required parameters');
                return;
            }
            
            // Clear existing markers
            this.clearFretMarkers(fretboardElement);
            
            // Find all fretboard strings
            const strings = fretboardElement.querySelectorAll('.fretboard-string');
            if (!strings || strings.length === 0) {
                console.warn('FretMarkerVisualizer: No strings found');
                return;
            }
            
            // Apply markers to standard positions
            this.standardFretMarkers.forEach(fretNum => {
                if (fretNum <= numFrets) {
                    strings.forEach(string => {
                        const fret = string.querySelector(`[data-fret="${fretNum}"]`);
                        if (fret) {
                            fret.classList.add('fret-marker');
                            
                            // Add position indicator for 12th fret and multiples
                            if (fretNum % 12 === 0) {
                                fret.classList.add('fret-marker-octave');
                            }
                        }
                    });
                }
            });
        } catch (error) {
            console.error('FretMarkerVisualizer: Error applying fret markers:', error);
            if (window.debugConsole) {
                window.debugConsole.addEntry('error', `Fret marker error: ${error.message}`);
            }
        }
    }
    
    // Clear fret markers
    clearFretMarkers(fretboardElement) {
        try {
            if (!fretboardElement) return;
            const frets = fretboardElement.querySelectorAll('.fret');
            frets.forEach(fret => {
                fret.classList.remove('fret-marker', 'fret-marker-octave');
            });
        } catch (error) {
            console.error('FretMarkerVisualizer: Error clearing fret markers:', error);
        }
    }
}
