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
        if (!tuning) return positions; // Handle grid case
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
    
    // Find triad positions from DOM (for grids and general case)
    findTriadPositionsFromDOM(triad, fretboardElement, method = 'connected') {
        // Find all positions of each note from the DOM
        const allFrets = fretboardElement.querySelectorAll('.fret');
        const rootPositions = [];
        const thirdPositions = [];
        const fifthPositions = [];
        
        // Handle diads (2 notes) and triads (3 notes)
        const isDiad = triad.notes && triad.notes.length === 2;
        const note1 = triad.notes ? triad.notes[0] : triad.root;
        const note2 = triad.notes ? triad.notes[1] : (triad.third || null);
        const note3 = triad.notes ? (triad.notes[2] || null) : (triad.fifth || null);
        
        allFrets.forEach(fret => {
            const note = fret.getAttribute('data-note');
            const stringIndex = parseInt(fret.getAttribute('data-string'));
            const fretNum = parseInt(fret.getAttribute('data-fret'));
            
            if (note === note1) {
                rootPositions.push({ string: stringIndex, fret: fretNum, note: note });
            } else if (note2 && note === note2) {
                thirdPositions.push({ string: stringIndex, fret: fretNum, note: note });
            } else if (note3 && note === note3) {
                fifthPositions.push({ string: stringIndex, fret: fretNum, note: note });
            }
        });
        
        // For diads, return simple pairs
        if (isDiad) {
            const diadPositions = [];
            rootPositions.forEach(rootPos => {
                thirdPositions.forEach(thirdPos => {
                    const stringDiff = Math.abs(thirdPos.string - rootPos.string);
                    const fretDiff = Math.abs(thirdPos.fret - rootPos.fret);
                    // Allow positions on adjacent rows/strings within reasonable distance
                    if (stringDiff <= 3 && fretDiff <= 5) {
                        diadPositions.push({
                            root: rootPos,
                            third: thirdPos,
                            type: 'diad'
                        });
                    }
                });
            });
            return diadPositions;
        }
        
        // Use the same methods but with DOM-found positions for triads
        switch(method) {
            case 'connected':
                return this.findConnectedTriads(rootPositions, thirdPositions, fifthPositions, null);
            case 'close-voicing':
                return this.findCloseVoicings(rootPositions, thirdPositions, fifthPositions, null, 100);
            case 'spread':
                return this.findSpreadTriads(rootPositions, thirdPositions, fifthPositions, null, 100);
            case 'string-sets':
            case 'string-sets-2-3':
                return this.findStringSetTriads(rootPositions, thirdPositions, fifthPositions, null);
            default:
                return this.findConnectedTriads(rootPositions, thirdPositions, fifthPositions, null);
        }
    }
    
    // Method 1: Connected triads (notes on adjacent strings, close together)
    findConnectedTriads(rootPositions, thirdPositions, fifthPositions, tuning) {
        const triads = [];
        
        rootPositions.forEach(rootPos => {
            // Look for third on adjacent strings/rows
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
                    // Check if all three are on adjacent strings/rows
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
    
    // Method 4: String set triads (specific string/row combinations)
    findStringSetTriads(rootPositions, thirdPositions, fifthPositions, tuning) {
        const triads = [];
        // For grids, generate dynamic string sets; for instruments, use predefined
        let stringSets;
        if (tuning && tuning.length > 0) {
            stringSets = [
                [0, 1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 5],
                [0, 1, 3], [1, 2, 4], [2, 3, 5],
                [0, 2, 3], [1, 3, 4], [2, 4, 5]
            ];
        } else {
            // For grids, use any three adjacent rows
            const maxString = Math.max(
                ...rootPositions.map(p => p.string),
                ...thirdPositions.map(p => p.string),
                ...fifthPositions.map(p => p.string)
            );
            stringSets = [];
            for (let i = 0; i <= maxString - 2; i++) {
                stringSets.push([i, i + 1, i + 2]);
                if (i <= maxString - 3) {
                    stringSets.push([i, i + 1, i + 3]);
                    stringSets.push([i, i + 2, i + 3]);
                }
            }
        }
        
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
    
    // Find all positions on 2-3 strings for a triad/diad
    findAllStringSetPositions(triad, tuning, numFrets, isDiad = false) {
        const allPositions = [];
        
        // Find all positions of each note
        const notePositions = {};
        triad.notes.forEach(note => {
            notePositions[note] = this.findNotePositions(note, tuning, numFrets);
        });
        
        const notes = Object.keys(notePositions);
        if (notes.length < 2) return [];
        
        // For 2-note diads, find all positions on 2 adjacent strings
        if (isDiad && notes.length === 2) {
            const note1Positions = notePositions[notes[0]];
            const note2Positions = notePositions[notes[1]];
            
            note1Positions.forEach(pos1 => {
                note2Positions.forEach(pos2 => {
                    const stringDiff = Math.abs(pos2.string - pos1.string);
                    if (stringDiff <= 2 && stringDiff > 0) {
                        allPositions.push({
                            root: pos1,
                            third: pos2,
                            type: 'diad-2-string'
                        });
                    }
                });
            });
        } else if (notes.length === 3) {
            // For triads, find all positions on 2-3 strings
            const rootPositions = notePositions[notes[0]];
            const thirdPositions = notePositions[notes[1]];
            const fifthPositions = notePositions[notes[2]];
            
            rootPositions.forEach(rootPos => {
                thirdPositions.forEach(thirdPos => {
                    fifthPositions.forEach(fifthPos => {
                        const strings = [rootPos.string, thirdPos.string, fifthPos.string];
                        const uniqueStrings = new Set(strings);
                        
                        // Must be on 2-3 strings
                        if (uniqueStrings.size >= 2 && uniqueStrings.size <= 3) {
                            const stringSpan = Math.max(...strings) - Math.min(...strings);
                            if (stringSpan <= 3) {
                                allPositions.push({
                                    root: rootPos,
                                    third: thirdPos,
                                    fifth: fifthPos,
                                    type: 'triad-2-3-string'
                                });
                            }
                        }
                    });
                });
            });
        }
        
        return allPositions;
    }
    
    // Highlight triad on fretboard with connecting lines
    highlightTriad(fretboardElement, triad, visualizationMethod = 'connected', index = 0, opacity = 1) {
        // Don't clear all - we want to show multiple triads
        // Only clear if this is the first one (index 0)
        if (index === 0) {
            const allFrets = fretboardElement.querySelectorAll('.fret');
            allFrets.forEach(fret => {
                fret.classList.remove('triad-root', 'triad-third', 'triad-fifth', 'triad-connection');
            });
            this.clearTriadConnections();
        }
        
        // Get fret positions (handle diads with only 2 notes)
        const rootFret = fretboardElement.querySelector(
            `[data-string="${triad.root.string}"][data-fret="${triad.root.fret}"]`
        );
        const thirdFret = triad.third ? fretboardElement.querySelector(
            `[data-string="${triad.third.string}"][data-fret="${triad.third.fret}"]`
        ) : null;
        const fifthFret = triad.fifth ? fretboardElement.querySelector(
            `[data-string="${triad.fifth.string}"][data-fret="${triad.fifth.fret}"]`
        ) : null;
        
        // Highlight notes
        if (rootFret) {
            rootFret.classList.add('triad-root');
        }
        if (thirdFret) {
            thirdFret.classList.add('triad-third');
        }
        if (fifthFret) {
            fifthFret.classList.add('triad-fifth');
        }
        
        // Draw connecting lines (handle diads with 2 notes)
        if (rootFret && thirdFret) {
            if (fifthFret) {
                // Full triad
                this.drawTriadConnections(rootFret, thirdFret, fifthFret, fretboardElement, index, opacity);
            } else {
                // Diad - just connect the two notes
                this.drawDiadConnections(rootFret, thirdFret, fretboardElement, index, opacity);
            }
        }
    }
    
    // Draw SVG lines connecting diad notes (2 notes)
    drawDiadConnections(rootFret, thirdFret, fretboardElement, index = 0, opacity = 1) {
        const container = fretboardElement.closest('.fretboard-container');
        if (!container) return;
        
        let svgOverlay = container.querySelector('#triad-connections');
        if (!svgOverlay) {
            svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgOverlay.id = 'triad-connections';
            svgOverlay.className = 'triad-connections-overlay';
            svgOverlay.style.position = 'absolute';
            svgOverlay.style.top = '0';
            svgOverlay.style.left = '0';
            svgOverlay.style.width = '100%';
            svgOverlay.style.height = '100%';
            svgOverlay.style.pointerEvents = 'none';
            svgOverlay.style.zIndex = '2';
            container.style.position = 'relative';
            container.appendChild(svgOverlay);
        }
        
        const rootRect = rootFret.getBoundingClientRect();
        const thirdRect = thirdFret.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const rootX = rootRect.left - containerRect.left + rootRect.width / 2;
        const rootY = rootRect.top - containerRect.top + rootRect.height / 2;
        const thirdX = thirdRect.left - containerRect.left + thirdRect.width / 2;
        const thirdY = thirdRect.top - containerRect.top + thirdRect.height / 2;
        
        // Calculate note shape radius
        const rootRadius = Math.min(rootRect.width, rootRect.height) / 2;
        const thirdRadius = Math.min(thirdRect.width, thirdRect.height) / 2;
        
        svgOverlay.setAttribute('width', containerRect.width);
        svgOverlay.setAttribute('height', containerRect.height);
        
        // Helper function to calculate point on edge of note shape
        const getEdgePoint = (centerX, centerY, targetX, targetY, radius) => {
            const dx = targetX - centerX;
            const dy = targetY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance === 0) return { x: centerX, y: centerY };
            const scale = radius / distance;
            return {
                x: centerX + dx * scale,
                y: centerY + dy * scale
            };
        };
        
        // Vary color slightly for multiple diads
        const hue = (index * 30) % 360;
        const strokeColor = `hsl(${hue}, 70%, 50%)`;
        
        // Create gradient for opacity variation
        const gradientId = `diad-gradient-${index}-${rootX}-${rootY}-${thirdX}-${thirdY}`;
        let defs = svgOverlay.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            svgOverlay.appendChild(defs);
        }
        
        const existingGradient = defs.querySelector(`#${gradientId}`);
        if (existingGradient) {
            existingGradient.remove();
        }
        
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', gradientId);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '0%');
        
        // Lower opacity at edges (in note areas), higher in middle
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', strokeColor);
        stop1.setAttribute('stop-opacity', opacity * 0.2);
        gradient.appendChild(stop1);
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '50%');
        stop2.setAttribute('stop-color', strokeColor);
        stop2.setAttribute('stop-opacity', opacity * 0.6);
        gradient.appendChild(stop2);
        
        const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop3.setAttribute('offset', '100%');
        stop3.setAttribute('stop-color', strokeColor);
        stop3.setAttribute('stop-opacity', opacity * 0.2);
        gradient.appendChild(stop3);
        
        defs.appendChild(gradient);
        
        // Calculate edge points
        const rootEdge = getEdgePoint(rootX, rootY, thirdX, thirdY, rootRadius);
        const thirdEdge = getEdgePoint(thirdX, thirdY, rootX, rootY, thirdRadius);
        
        // Draw line from edge to edge
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', rootEdge.x);
        line.setAttribute('y1', rootEdge.y);
        line.setAttribute('x2', thirdEdge.x);
        line.setAttribute('y2', thirdEdge.y);
        line.setAttribute('stroke', `url(#${gradientId})`);
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('data-index', index);
        svgOverlay.appendChild(line);
    }
    
    // Draw SVG lines connecting triad notes
    drawTriadConnections(rootFret, thirdFret, fifthFret, fretboardElement, index = 0, opacity = 1) {
        const container = fretboardElement.closest('.fretboard-container');
        if (!container) return;
        
        let svgOverlay = container.querySelector('#triad-connections');
        if (!svgOverlay) {
            svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgOverlay.id = 'triad-connections';
            svgOverlay.className = 'triad-connections-overlay';
            svgOverlay.style.position = 'absolute';
            svgOverlay.style.top = '0';
            svgOverlay.style.left = '0';
            svgOverlay.style.width = '100%';
            svgOverlay.style.height = '100%';
            svgOverlay.style.pointerEvents = 'none';
            svgOverlay.style.zIndex = '2'; // Behind text, in front of note background
            container.style.position = 'relative';
            container.appendChild(svgOverlay);
        }
        
        // Clear previous lines
        svgOverlay.innerHTML = '';
        
        // Get bounding boxes
        const rootRect = rootFret.getBoundingClientRect();
        const thirdRect = thirdFret.getBoundingClientRect();
        const fifthRect = fifthFret.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate center points and note shape radius
        const rootX = rootRect.left - containerRect.left + rootRect.width / 2;
        const rootY = rootRect.top - containerRect.top + rootRect.height / 2;
        const thirdX = thirdRect.left - containerRect.left + thirdRect.width / 2;
        const thirdY = thirdRect.top - containerRect.top + thirdRect.height / 2;
        const fifthX = fifthRect.left - containerRect.left + fifthRect.width / 2;
        const fifthY = fifthRect.top - containerRect.top + fifthRect.height / 2;
        
        // Calculate note shape radius (use smaller dimension for circular shapes)
        const rootRadius = Math.min(rootRect.width, rootRect.height) / 2;
        const thirdRadius = Math.min(thirdRect.width, thirdRect.height) / 2;
        const fifthRadius = Math.min(fifthRect.width, fifthRect.height) / 2;
        
        // Set SVG dimensions
        svgOverlay.setAttribute('width', containerRect.width);
        svgOverlay.setAttribute('height', containerRect.height);
        
        // Don't clear - we want to accumulate lines for multiple triads
        // svgOverlay.innerHTML = ''; // Removed - lines accumulate
        
        // Vary color slightly for multiple triads
        const hue = (index * 30) % 360;
        const strokeColor = `hsl(${hue}, 70%, 50%)`;
        
        // Helper function to calculate point on edge of note shape
        const getEdgePoint = (centerX, centerY, targetX, targetY, radius) => {
            const dx = targetX - centerX;
            const dy = targetY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance === 0) return { x: centerX, y: centerY };
            const scale = radius / distance;
            return {
                x: centerX + dx * scale,
                y: centerY + dy * scale
            };
        };
        
        // Helper function to draw line with gradient opacity (lower in note areas)
        const drawLineWithGradient = (x1, y1, x2, y2, radius1, radius2, color, baseOpacity, lineIndex) => {
            // Calculate edge points
            const edge1 = getEdgePoint(x1, y1, x2, y2, radius1);
            const edge2 = getEdgePoint(x2, y2, x1, y1, radius2);
            
            // Create gradient for opacity variation
            const gradientId = `triad-gradient-${index}-${lineIndex}-${Math.round(x1)}-${Math.round(y1)}-${Math.round(x2)}-${Math.round(y2)}`;
            let defs = svgOverlay.querySelector('defs');
            if (!defs) {
                defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                svgOverlay.appendChild(defs);
            }
            
            // Remove existing gradient with same ID if any
            const existingGradient = defs.querySelector(`#${gradientId}`);
            if (existingGradient) {
                existingGradient.remove();
            }
            
            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.setAttribute('id', gradientId);
            gradient.setAttribute('x1', '0%');
            gradient.setAttribute('y1', '0%');
            gradient.setAttribute('x2', '100%');
            gradient.setAttribute('y2', '0%');
            
            // Add stops: lower opacity at edges (in note areas), higher in middle
            const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop1.setAttribute('offset', '0%');
            stop1.setAttribute('stop-color', color);
            stop1.setAttribute('stop-opacity', baseOpacity * 0.3); // Lower opacity in note area
            gradient.appendChild(stop1);
            
            const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop2.setAttribute('offset', '15%');
            stop2.setAttribute('stop-color', color);
            stop2.setAttribute('stop-opacity', baseOpacity * 0.6);
            gradient.appendChild(stop2);
            
            const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop3.setAttribute('offset', '50%');
            stop3.setAttribute('stop-color', color);
            stop3.setAttribute('stop-opacity', baseOpacity);
            gradient.appendChild(stop3);
            
            const stop4 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop4.setAttribute('offset', '85%');
            stop4.setAttribute('stop-color', color);
            stop4.setAttribute('stop-opacity', baseOpacity * 0.6);
            gradient.appendChild(stop4);
            
            const stop5 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop5.setAttribute('offset', '100%');
            stop5.setAttribute('stop-color', color);
            stop5.setAttribute('stop-opacity', baseOpacity * 0.3); // Lower opacity in note area
            gradient.appendChild(stop5);
            
            defs.appendChild(gradient);
            
            // Draw line from edge to edge
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', edge1.x);
            line.setAttribute('y1', edge1.y);
            line.setAttribute('x2', edge2.x);
            line.setAttribute('y2', edge2.y);
            line.setAttribute('stroke', `url(#${gradientId})`);
            line.setAttribute('stroke-width', '3');
            line.setAttribute('stroke-linecap', 'round');
            line.setAttribute('data-index', index);
            svgOverlay.appendChild(line);
        };
        
        // Draw lines extending into note shapes
        drawLineWithGradient(rootX, rootY, thirdX, thirdY, rootRadius, thirdRadius, strokeColor, opacity * 0.6, 1);
        drawLineWithGradient(thirdX, thirdY, fifthX, fifthY, thirdRadius, fifthRadius, strokeColor, opacity * 0.6, 2);
        drawLineWithGradient(fifthX, fifthY, rootX, rootY, fifthRadius, rootRadius, strokeColor, opacity * 0.6, 3);
    }
    
    // Clear triad connection lines
    clearTriadConnections() {
        const svgOverlay = document.getElementById('triad-connections');
        if (svgOverlay) {
            svgOverlay.innerHTML = '';
        }
    }
    
    // Clear triad highlighting
    clearTriads(fretboardElement) {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        allFrets.forEach(fret => {
            fret.classList.remove('triad-root', 'triad-third', 'triad-fifth', 'triad-connection');
        });
        this.clearTriadConnections();
    }
}
