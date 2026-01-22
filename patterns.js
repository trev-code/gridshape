// Scale Pattern Shapes (CAGED, 3-note-per-string, etc.)
class PatternVisualizer {
    constructor(scaleManager, instrumentManager) {
        this.scaleManager = scaleManager;
        this.instrumentManager = instrumentManager;
    }
    
    // Find patterns from DOM (for grids)
    findPatternsFromDOM(scaleNotes, rootNote, fretboardElement) {
        const patterns = [];
        const allFrets = fretboardElement.querySelectorAll('.fret');
        
        // Find all root positions
        const rootPositions = [];
        allFrets.forEach(fret => {
            const note = fret.getAttribute('data-note');
            if (note === rootNote) {
                const stringIndex = parseInt(fret.getAttribute('data-string'));
                const fretNum = parseInt(fret.getAttribute('data-fret'));
                rootPositions.push({ string: stringIndex, fret: fretNum });
            }
        });
        
        // For each root, try to build a simple pattern
        rootPositions.forEach(rootPos => {
            const pattern = this.buildPatternFromRootDOM(rootPos, scaleNotes, fretboardElement);
            if (pattern && pattern.length >= 3) {
                patterns.push(pattern);
            }
        });
        
        return patterns;
    }
    
    // Build pattern from root using DOM (for grids)
    buildPatternFromRootDOM(rootPos, scaleNotes, fretboardElement) {
        const pattern = [rootPos];
        const visited = new Set();
        visited.add(`${rootPos.string}-${rootPos.fret}`);
        
        let currentPos = { ...rootPos };
        const maxPatternLength = 7;
        
        for (let i = 0; i < maxPatternLength - 1; i++) {
            let found = false;
            
            // Check adjacent positions (up/down rows, left/right columns)
            const directions = [
                { string: currentPos.string - 1, fret: currentPos.fret },
                { string: currentPos.string + 1, fret: currentPos.fret },
                { string: currentPos.string, fret: currentPos.fret - 1 },
                { string: currentPos.string, fret: currentPos.fret + 1 }
            ];
            
            for (const dir of directions) {
                const key = `${dir.string}-${dir.fret}`;
                if (visited.has(key)) continue;
                
                const fret = fretboardElement.querySelector(
                    `[data-string="${dir.string}"][data-fret="${dir.fret}"]`
                );
                if (fret) {
                    const note = fret.getAttribute('data-note');
                    if (scaleNotes.includes(note)) {
                        pattern.push(dir);
                        visited.add(key);
                        currentPos = dir;
                        found = true;
                        break;
                    }
                }
            }
            
            if (!found) break;
        }
        
        return pattern;
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
    
    // Enhanced pattern visualization with connecting lines and multiple patterns
    highlightPatternsEnhanced(fretboardElement, patterns, scaleNotes, rootNote) {
        // Clear previous patterns
        const allFrets = fretboardElement.querySelectorAll('.fret');
        allFrets.forEach(fret => {
            fret.classList.remove('pattern-note', 'pattern-root', 'pattern-connection');
        });
        
        // Clear previous pattern connections
        const container = fretboardElement.closest('.fretboard-container');
        if (container) {
            const existingOverlay = container.querySelector('#pattern-connections');
            if (existingOverlay) {
                existingOverlay.remove();
            }
        }
        
        // Show up to 3 patterns with different colors
        const maxPatterns = Math.min(3, patterns.length);
        const patternColors = [
            'hsl(200, 70%, 50%)',  // Blue
            'hsl(300, 70%, 50%)',  // Magenta
            'hsl(60, 70%, 50%)'    // Yellow
        ];
        
        // Create SVG overlay for pattern connections
        let svgOverlay = null;
        if (container) {
            svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgOverlay.id = 'pattern-connections';
            svgOverlay.className = 'pattern-connections-overlay';
            svgOverlay.style.position = 'absolute';
            svgOverlay.style.top = '0';
            svgOverlay.style.left = '0';
            svgOverlay.style.width = '100%';
            svgOverlay.style.height = '100%';
            svgOverlay.style.pointerEvents = 'none';
            svgOverlay.style.zIndex = '1';
            container.style.position = 'relative';
            container.appendChild(svgOverlay);
            
            const containerRect = container.getBoundingClientRect();
            svgOverlay.setAttribute('width', containerRect.width);
            svgOverlay.setAttribute('height', containerRect.height);
        }
        
        for (let pIdx = 0; pIdx < maxPatterns; pIdx++) {
            const pattern = patterns[pIdx];
            const color = patternColors[pIdx % patternColors.length];
            
            // Highlight notes in pattern
            pattern.forEach((pos, idx) => {
                const fret = fretboardElement.querySelector(
                    `[data-string="${pos.string}"][data-fret="${pos.fret}"]`
                );
                if (fret) {
                    const isRoot = idx === 0 || (pos.note && pos.note === rootNote);
                    fret.classList.add(isRoot ? 'pattern-root' : 'pattern-note');
                    fret.style.setProperty('--pattern-color', color);
                }
            });
            
            // Draw connecting lines between adjacent notes in pattern
            if (svgOverlay && pattern.length > 1) {
                const containerRect = container.getBoundingClientRect();
                
                for (let i = 0; i < pattern.length - 1; i++) {
                    const pos1 = pattern[i];
                    const pos2 = pattern[i + 1];
                    
                    const fret1 = fretboardElement.querySelector(
                        `[data-string="${pos1.string}"][data-fret="${pos1.fret}"]`
                    );
                    const fret2 = fretboardElement.querySelector(
                        `[data-string="${pos2.string}"][data-fret="${pos2.fret}"]`
                    );
                    
                    if (fret1 && fret2) {
                        const rect1 = fret1.getBoundingClientRect();
                        const rect2 = fret2.getBoundingClientRect();
                        
                        const x1 = rect1.left - containerRect.left + rect1.width / 2;
                        const y1 = rect1.top - containerRect.top + rect1.height / 2;
                        const x2 = rect2.left - containerRect.left + rect2.width / 2;
                        const y2 = rect2.top - containerRect.top + rect2.height / 2;
                        
                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        line.setAttribute('x1', x1);
                        line.setAttribute('y1', y1);
                        line.setAttribute('x2', x2);
                        line.setAttribute('y2', y2);
                        line.setAttribute('stroke', color);
                        line.setAttribute('stroke-width', '2');
                        line.setAttribute('stroke-opacity', '0.5');
                        line.setAttribute('stroke-dasharray', '4,2');
                        svgOverlay.appendChild(line);
                    }
                }
            }
        }
    }
    
    // Clear pattern highlighting
    clearPatterns(fretboardElement) {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        allFrets.forEach(fret => {
            fret.classList.remove('pattern-note', 'pattern-root');
        });
    }
}
