// Triad Visualization System - Multiple visualization methods
class TriadVisualizer {
    constructor(scaleManager, instrumentManager) {
        this.scaleManager = scaleManager;
        this.instrumentManager = instrumentManager;
        this.allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    }
    
    // Get all triads in a scale
    getTriadsInScale(rootKey, scaleName) {
        const scaleNotes = this.scaleManager.getScaleNotes(rootKey, scaleName);
        const triads = [];
        
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
            
            triads.push({
                root: root,
                third: third,
                fifth: fifth,
                quality: quality,
                name: root + quality,
                notes: [root, third, fifth],
                scaleDegree: index + 1
            });
        });
        
        return triads;
    }
    
    // Find triad positions on fretboard
    findTriadPositions(triad, tuning, numFrets, method = 'connected') {
        const positions = [];
        
        // Find all positions of each note
        const rootPositions = this.findNotePositions(triad.root, tuning, numFrets);
        const thirdPositions = this.findNotePositions(triad.third, tuning, numFrets);
        const fifthPositions = this.findNotePositions(triad.fifth, tuning, numFrets);
        
        switch(method) {
            case 'connected':
                return this.findConnectedTriads(rootPositions, thirdPositions, fifthPositions, tuning);
            case 'close-voicing':
                return this.findCloseVoicings(rootPositions, thirdPositions, fifthPositions, tuning, numFrets);
            case 'spread':
                return this.findSpreadTriads(rootPositions, thirdPositions, fifthPositions, tuning, numFrets);
            case 'string-sets':
                return this.findStringSetTriads(rootPositions, thirdPositions, fifthPositions, tuning);
            case 'all':
                return {
                    connected: this.findConnectedTriads(rootPositions, thirdPositions, fifthPositions, tuning),
                    close: this.findCloseVoicings(rootPositions, thirdPositions, fifthPositions, tuning, numFrets),
                    spread: this.findSpreadTriads(rootPositions, thirdPositions, fifthPositions, tuning, numFrets),
                    stringSets: this.findStringSetTriads(rootPositions, thirdPositions, fifthPositions, tuning)
                };
            default:
                return this.findConnectedTriads(rootPositions, thirdPositions, fifthPositions, tuning);
        }
    }
    
    // Find all positions of a note
    findNotePositions(note, tuning, numFrets) {
        const positions = [];
        for (let stringIndex = 0; stringIndex < tuning.length; stringIndex++) {
            for (let fret = 0; fret <= numFrets; fret++) {
                const fretNote = this.instrumentManager.getNote(tuning, stringIndex, fret);
                if (fretNote === note) {
                    positions.push({ string: stringIndex, fret: fret, note: note });
                }
            }
        }
        return positions;
    }
    
    // Method 1: Connected triads (notes on adjacent strings, close together)
    findConnectedTriads(rootPositions, thirdPositions, fifthPositions, tuning) {
        const triads = [];
        
        rootPositions.forEach(rootPos => {
            // Look for third on adjacent strings
            const nearbyThirds = thirdPositions.filter(pos => {
                const stringDiff = Math.abs(pos.string - rootPos.string);
                const fretDiff = Math.abs(pos.fret - rootPos.fret);
                return stringDiff <= 2 && fretDiff <= 4;
            });
            
            nearbyThirds.forEach(thirdPos => {
                // Look for fifth near the third
                const nearbyFifths = fifthPositions.filter(pos => {
                    const stringDiff = Math.abs(pos.string - thirdPos.string);
                    const fretDiff = Math.abs(pos.fret - thirdPos.fret);
                    return stringDiff <= 2 && fretDiff <= 4;
                });
                
                nearbyFifths.forEach(fifthPos => {
                    // Check if all three are on adjacent strings
                    const strings = [rootPos.string, thirdPos.string, fifthPos.string].sort((a, b) => a - b);
                    const isAdjacent = strings.every((s, i) => i === 0 || s - strings[i-1] <= 2);
                    
                    if (isAdjacent) {
                        triads.push({
                            root: rootPos,
                            third: thirdPos,
                            fifth: fifthPos,
                            type: 'connected'
                        });
                    }
                });
            });
        });
        
        return triads;
    }
    
    // Method 2: Close voicings (all notes within a small fret range)
    findCloseVoicings(rootPositions, thirdPositions, fifthPositions, tuning, numFrets) {
        const triads = [];
        
        rootPositions.forEach(rootPos => {
            const nearbyThirds = thirdPositions.filter(pos => {
                const fretDiff = Math.abs(pos.fret - rootPos.fret);
                return fretDiff <= 3;
            });
            
            nearbyThirds.forEach(thirdPos => {
                const nearbyFifths = fifthPositions.filter(pos => {
                    const fretDiff = Math.abs(pos.fret - rootPos.fret);
                    return fretDiff <= 3;
                });
                
                nearbyFifths.forEach(fifthPos => {
                    const frets = [rootPos.fret, thirdPos.fret, fifthPos.fret];
                    const minFret = Math.min(...frets);
                    const maxFret = Math.max(...frets);
                    
                    if (maxFret - minFret <= 4) {
                        triads.push({
                            root: rootPos,
                            third: thirdPos,
                            fifth: fifthPos,
                            type: 'close-voicing',
                            span: maxFret - minFret
                        });
                    }
                });
            });
        });
        
        return triads;
    }
    
    // Method 3: Spread triads (notes spread across wider range)
    findSpreadTriads(rootPositions, thirdPositions, fifthPositions, tuning, numFrets) {
        const triads = [];
        
        rootPositions.forEach(rootPos => {
            thirdPositions.forEach(thirdPos => {
                fifthPositions.forEach(fifthPos => {
                    // Check if notes are on different strings and spread out
                    const strings = [rootPos.string, thirdPos.string, fifthPos.string];
                    const uniqueStrings = new Set(strings);
                    
                    if (uniqueStrings.size === 3) {
                        const frets = [rootPos.fret, thirdPos.fret, fifthPos.fret];
                        const minFret = Math.min(...frets);
                        const maxFret = Math.max(...frets);
                        
                        if (maxFret - minFret >= 3 && maxFret - minFret <= 8) {
                            triads.push({
                                root: rootPos,
                                third: thirdPos,
                                fifth: fifthPos,
                                type: 'spread',
                                span: maxFret - minFret
                            });
                        }
                    }
                });
            });
        });
        
        return triads;
    }
    
    // Method 4: String set triads (specific string combinations)
    findStringSetTriads(rootPositions, thirdPositions, fifthPositions, tuning) {
        const triads = [];
        const stringSets = [
            [0, 1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 5],
            [0, 1, 3], [1, 2, 4], [2, 3, 5],
            [0, 2, 3], [1, 3, 4], [2, 4, 5]
        ];
        
        stringSets.forEach(stringSet => {
            rootPositions.forEach(rootPos => {
                if (!stringSet.includes(rootPos.string)) return;
                
                thirdPositions.forEach(thirdPos => {
                    if (!stringSet.includes(thirdPos.string) || thirdPos.string === rootPos.string) return;
                    
                    fifthPositions.forEach(fifthPos => {
                        if (!stringSet.includes(fifthPos.string) || 
                            fifthPos.string === rootPos.string || 
                            fifthPos.string === thirdPos.string) return;
                        
                        triads.push({
                            root: rootPos,
                            third: thirdPos,
                            fifth: fifthPos,
                            type: 'string-set',
                            strings: stringSet
                        });
                    });
                });
            });
        });
        
        return triads;
    }
    
    // Highlight triad on fretboard
    highlightTriad(fretboardElement, triad, visualizationMethod = 'connected') {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        
        allFrets.forEach(fret => {
            fret.classList.remove('triad-root', 'triad-third', 'triad-fifth', 'triad-connection');
            
            const stringIndex = parseInt(fret.getAttribute('data-string'));
            const fretNum = parseInt(fret.getAttribute('data-fret'));
            
            if (triad.root.string === stringIndex && triad.root.fret === fretNum) {
                fret.classList.add('triad-root');
            } else if (triad.third.string === stringIndex && triad.third.fret === fretNum) {
                fret.classList.add('triad-third');
            } else if (triad.fifth.string === stringIndex && triad.fifth.fret === fretNum) {
                fret.classList.add('triad-fifth');
            }
        });
        
        // Add connection lines for connected triads
        if (visualizationMethod === 'connected' || visualizationMethod === 'close-voicing') {
            this.addTriadConnections(fretboardElement, triad);
        }
    }
    
    // Add visual connections between triad notes
    addTriadConnections(fretboardElement, triad) {
        // This would require SVG overlay or canvas for lines
        // For now, we'll use CSS to create visual connections
        const positions = [triad.root, triad.third, triad.fifth].sort((a, b) => {
            if (a.string !== b.string) return a.string - b.string;
            return a.fret - b.fret;
        });
        
        // Mark frets as part of connection
        positions.forEach((pos, index) => {
            if (index < positions.length - 1) {
                const fret = fretboardElement.querySelector(
                    `[data-string="${pos.string}"][data-fret="${pos.fret}"]`
                );
                if (fret) {
                    fret.classList.add('triad-connection');
                }
            }
        });
    }
    
    // Clear triad highlighting
    clearTriads(fretboardElement) {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        allFrets.forEach(fret => {
            fret.classList.remove('triad-root', 'triad-third', 'triad-fifth', 'triad-connection');
        });
    }
}
