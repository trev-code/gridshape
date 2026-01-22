// Scale Degree Labels Visualization
class ScaleDegreeVisualizer {
    constructor(scaleManager) {
        this.scaleManager = scaleManager;
    }
    
    // Apply scale degree labels to fretboard
    applyScaleDegrees(fretboardElement, key, scaleName) {
        try {
            if (!fretboardElement || !key || !scaleName) {
                console.warn('ScaleDegreeVisualizer: Missing required parameters');
                return;
            }
            
            const scaleNotes = this.scaleManager.getScaleNotes(key, scaleName);
            if (!scaleNotes || scaleNotes.length === 0) {
                console.warn('ScaleDegreeVisualizer: No scale notes found');
                return;
            }
            
            const allFrets = fretboardElement.querySelectorAll('.fret');
            if (!allFrets || allFrets.length === 0) {
                console.warn('ScaleDegreeVisualizer: No fret elements found');
                return;
            }
            
            allFrets.forEach(fret => {
                // Remove existing degree labels
                const existingLabel = fret.querySelector('.scale-degree-label');
                if (existingLabel) {
                    existingLabel.remove();
                }
                
                const note = fret.getAttribute('data-note');
                if (!note) return;
                
                const degree = scaleNotes.indexOf(note);
                if (degree >= 0) {
                    const degreeNum = degree + 1;
                    const label = document.createElement('div');
                    label.className = 'scale-degree-label';
                    label.textContent = degreeNum;
                    label.setAttribute('title', `Scale degree ${degreeNum}`);
                    
                    // Style based on if it's root
                    if (note === key) {
                        label.classList.add('degree-root');
                    }
                    
                    fret.appendChild(label);
                }
            });
        } catch (error) {
            console.error('ScaleDegreeVisualizer: Error applying scale degrees:', error);
            if (window.debugConsole) {
                window.debugConsole.addEntry('error', `Scale degree error: ${error.message}`);
            }
        }
    }
    
    // Clear scale degree labels
    clearScaleDegrees(fretboardElement) {
        try {
            if (!fretboardElement) return;
            const labels = fretboardElement.querySelectorAll('.scale-degree-label');
            labels.forEach(label => label.remove());
        } catch (error) {
            console.error('ScaleDegreeVisualizer: Error clearing scale degrees:', error);
        }
    }
}
