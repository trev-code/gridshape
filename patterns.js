// Scale Pattern Shapes (CAGED, 3-note-per-string, etc.)
class PatternVisualizer {
    constructor(scaleManager, instrumentManager) {
        this.scaleManager = scaleManager;
        this.instrumentManager = instrumentManager;
    }
    
    // Find CAGED patterns on fretboard
    findCAGEDPatterns(scaleNotes, rootNote, tuning, numFrets) {
        const patterns = [];
        
        // Find all root positions
        const rootPositions = [];
        for (let stringIndex = 0; stringIndex < tuning.length; stringIndex++) {
            for (let fret = 0; fret <= numFrets; fret++) {
                const note = this.instrumentManager.getNote(tuning, stringIndex, fret);
                if (note === rootNote) {
                    rootPositions.push({ string: stringIndex, fret: fret });
                }
            }
        }
        
        // For each root, try to build a pattern
        rootPositions.forEach(rootPos => {
            const pattern = this.buildPatternFromRoot(rootPos, scaleNotes, tuning, numFrets);
            if (pattern && pattern.length >= 5) {
                patterns.push(pattern);
            }
        });
        
        return patterns;
    }
    
    // Build a scale pattern from a root position
    buildPatternFromRoot(rootPos, scaleNotes, tuning, numFrets) {
        const pattern = [rootPos];
        const visited = new Set();
        visited.add(`${rootPos.string}-${rootPos.fret}`);
        
        // Try to build pattern moving up strings
        let currentPos = { ...rootPos };
        const maxPatternLength = 7;
        
        for (let i = 0; i < maxPatternLength - 1; i++) {
            // Look for next scale note on adjacent strings
            let found = false;
            
            // Check same fret on next string
            if (currentPos.string > 0) {
                const nextString = currentPos.string - 1;
                const nextFret = currentPos.fret;
                const key = `${nextString}-${nextFret}`;
                
                if (!visited.has(key) && nextFret <= numFrets) {
                    const note = this.instrumentManager.getNote(tuning, nextString, nextFret);
                    if (scaleNotes.includes(note)) {
                        pattern.push({ string: nextString, fret: nextFret });
                        visited.add(key);
                        currentPos = { string: nextString, fret: nextFret };
                        found = true;
                    }
                }
            }
            
            // Check nearby frets on next string
            if (!found && currentPos.string > 0) {
                for (let offset = -2; offset <= 2; offset++) {
                    const nextString = currentPos.string - 1;
                    const nextFret = currentPos.fret + offset;
                    const key = `${nextString}-${nextFret}`;
                    
                    if (nextFret >= 0 && nextFret <= numFrets && !visited.has(key)) {
                        const note = this.instrumentManager.getNote(tuning, nextString, nextFret);
                        if (scaleNotes.includes(note)) {
                            pattern.push({ string: nextString, fret: nextFret });
                            visited.add(key);
                            currentPos = { string: nextString, fret: nextFret };
                            found = true;
                            break;
                        }
                    }
                }
            }
            
            if (!found) break;
        }
        
        return pattern.length >= 5 ? pattern : null;
    }
    
    // Find 3-note-per-string patterns
    findThreeNotePerStringPatterns(scaleNotes, rootNote, tuning, numFrets) {
        const patterns = [];
        
        // Find starting positions
        for (let startString = 0; startString < tuning.length - 2; startString++) {
            for (let startFret = 0; startFret <= numFrets - 6; startFret++) {
                const pattern = [];
                let valid = true;
                
                // Check if we can fit 3 notes per string for 3 strings
                for (let strOffset = 0; strOffset < 3; strOffset++) {
                    const stringIndex = startString + strOffset;
                    if (stringIndex >= tuning.length) {
                        valid = false;
                        break;
                    }
                    
                    const stringNotes = [];
                    for (let fretOffset = 0; fretOffset < 3; fretOffset++) {
                        const fret = startFret + fretOffset;
                        if (fret > numFrets) {
                            valid = false;
                            break;
                        }
                        const note = this.instrumentManager.getNote(tuning, stringIndex, fret);
                        if (scaleNotes.includes(note)) {
                            stringNotes.push({ string: stringIndex, fret: fret, note: note });
                        }
                    }
                    
                    if (stringNotes.length === 3) {
                        pattern.push(...stringNotes);
                    } else {
                        valid = false;
                        break;
                    }
                }
                
                if (valid && pattern.length === 9) {
                    patterns.push(pattern);
                }
            }
        }
        
        return patterns;
    }
    
    // Highlight pattern on fretboard
    highlightPattern(fretboardElement, pattern, patternType = 'caged') {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        
        allFrets.forEach(fret => {
            fret.classList.remove('pattern-note', 'pattern-root');
            
            const stringIndex = parseInt(fret.getAttribute('data-string'));
            const fretNum = parseInt(fret.getAttribute('data-fret'));
            
            const inPattern = pattern.some(pos => {
                if (typeof pos === 'object' && pos.string !== undefined) {
                    return pos.string === stringIndex && pos.fret === fretNum;
                }
                return false;
            });
            
            if (inPattern) {
                const isRoot = pattern[0] && 
                              pattern[0].string === stringIndex && 
                              pattern[0].fret === fretNum;
                fret.classList.add(isRoot ? 'pattern-root' : 'pattern-note');
            }
        });
    }
    
    // Clear pattern highlighting
    clearPatterns(fretboardElement) {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        allFrets.forEach(fret => {
            fret.classList.remove('pattern-note', 'pattern-root');
        });
    }
}
