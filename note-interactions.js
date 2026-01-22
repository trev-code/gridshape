// Note Interaction System - Handles clicking on individual notes
class NoteInteractionManager {
    constructor(scaleManager, instrumentManager, intervalVisualizer) {
        this.scaleManager = scaleManager;
        this.instrumentManager = instrumentManager;
        this.intervalVisualizer = intervalVisualizer;
        this.selectedNote = null;
        this.selectedPositions = []; // Track all positions of selected note
        this.infoPanel = null;
    }
    
    // Setup note click handlers
    setupNoteClicks(fretboardElement) {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        
        allFrets.forEach(fret => {
            // Remove existing listeners by cloning
            const newFret = fret.cloneNode(true);
            fret.parentNode.replaceChild(newFret, fret);
            
            newFret.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleNoteClick(newFret, fretboardElement);
            });
            
            // Add cursor pointer style
            newFret.style.cursor = 'pointer';
        });
        
        // Clear selection when clicking outside fretboard
        document.addEventListener('click', (e) => {
            if (!fretboardElement.contains(e.target) && !this.infoPanel?.contains(e.target)) {
                this.clearSelection(fretboardElement);
                this.hideInfoPanel();
            }
        });
    }
    
    // Handle note click
    handleNoteClick(fretElement, fretboardElement) {
        const note = fretElement.getAttribute('data-note');
        const stringIndex = parseInt(fretElement.getAttribute('data-string'));
        const fret = parseInt(fretElement.getAttribute('data-fret'));
        
        if (!note) return;
        
        // Toggle selection - if same note clicked, deselect
        if (this.selectedNote === note) {
            this.clearSelection(fretboardElement);
            return;
        }
        
        // Select new note
        this.selectedNote = note;
        this.highlightNotePositions(fretboardElement, note);
        this.showNoteInfo(note, stringIndex, fret);
    }
    
    // Highlight all positions of a note across the fretboard
    highlightNotePositions(fretboardElement, note) {
        // Clear previous selection
        this.clearSelection(fretboardElement);
        
        const allFrets = fretboardElement.querySelectorAll('.fret');
        this.selectedPositions = [];
        
        allFrets.forEach(fret => {
            const fretNote = fret.getAttribute('data-note');
            if (fretNote === note) {
                fret.classList.add('note-selected');
                const stringIndex = parseInt(fret.getAttribute('data-string'));
                const fretNum = parseInt(fret.getAttribute('data-fret'));
                this.selectedPositions.push({ string: stringIndex, fret: fretNum, note: note });
            }
        });
    }
    
    // Show note information panel
    showNoteInfo(note, stringIndex, fret) {
        // Create or update info panel
        if (!this.infoPanel) {
            this.infoPanel = document.createElement('div');
            this.infoPanel.id = 'note-info-panel';
            this.infoPanel.className = 'note-info-panel';
            document.querySelector('.container').appendChild(this.infoPanel);
        }
        
        const instrument = window.fretboardVisualizer?.currentInstrument || 'Guitar (Standard)';
        const key = window.fretboardVisualizer?.currentKey || 'C';
        const scale = window.fretboardVisualizer?.currentScale || 'Major (Ionian)';
        
        // Get scale information
        const scaleNotes = this.scaleManager.getScaleNotes(key, scale);
        const isInScale = scaleNotes.includes(note);
        const scaleDegree = isInScale ? scaleNotes.indexOf(note) + 1 : 0;
        const isRoot = note === key;
        
        // Get interval information
        const interval = this.intervalVisualizer.getInterval(key, note);
        const intervalName = interval !== null ? this.intervalVisualizer.getIntervalName(interval) : 'N/A';
        
        // Count occurrences
        const occurrenceCount = this.selectedPositions.length;
        
        // Build info HTML
        this.infoPanel.innerHTML = `
            <div class="note-info-header">
                <h3>Note: ${note}</h3>
                <button class="close-info" onclick="this.closest('.note-info-panel').style.display='none'">×</button>
            </div>
            <div class="note-info-content">
                <div class="info-section">
                    <strong>Position:</strong>
                    <div>String ${stringIndex + 1}, Fret ${fret}</div>
                    <div class="info-subtext">${occurrenceCount} occurrence${occurrenceCount !== 1 ? 's' : ''} on fretboard</div>
                </div>
                
                <div class="info-section">
                    <strong>Scale Information:</strong>
                    <div class="${isInScale ? 'in-scale' : 'out-of-scale'}">
                        ${isInScale ? '✓ In Scale' : '✗ Not in Scale'}
                    </div>
                    ${isRoot ? '<div class="root-badge">Root Note</div>' : ''}
                    ${scaleDegree > 0 ? `<div>Scale Degree: ${scaleDegree}</div>` : ''}
                </div>
                
                <div class="info-section">
                    <strong>Interval from ${key}:</strong>
                    <div>${intervalName}</div>
                </div>
                
                <div class="info-section">
                    <strong>All Positions:</strong>
                    <div class="positions-list">
                        ${this.selectedPositions.map(pos => 
                            `<span class="position-tag">S${pos.string + 1}F${pos.fret}</span>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="info-section">
                    <strong>Actions:</strong>
                    <div class="action-buttons">
                        <button class="action-btn" data-action="highlight-all">Highlight All</button>
                        <button class="action-btn" data-action="show-intervals">Show Intervals</button>
                        <button class="action-btn" data-action="find-chords">Find Chords</button>
                    </div>
                </div>
            </div>
        `;
        
        this.infoPanel.style.display = 'block';
        
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            this.setupInfoPanelActions();
        }, 0);
    }
    
    // Setup action buttons in info panel using event delegation
    setupInfoPanelActions() {
        // Use event delegation on the info panel itself
        if (this.infoPanel) {
            this.infoPanel.addEventListener('click', (e) => {
                const actionBtn = e.target.closest('.action-btn');
                if (actionBtn) {
                    e.stopPropagation();
                    e.preventDefault();
                    const action = actionBtn.getAttribute('data-action');
                    if (action) {
                        this.handleAction(action);
                    }
                }
            });
        }
    }
    
    // Handle action button clicks
    handleAction(action) {
        const fretboard = document.getElementById('fretboard');
        if (!fretboard || !this.selectedNote) return;
        
        switch(action) {
            case 'highlight-all':
                // Already highlighted, just ensure it's visible
                this.highlightNotePositions(fretboard, this.selectedNote);
                break;
                
            case 'show-intervals':
                // Toggle interval highlighting for this note
                const key = window.fretboardVisualizer?.currentKey || 'C';
                const interval = this.intervalVisualizer.getInterval(key, this.selectedNote);
                if (interval !== null) {
                    // Highlight all notes with same interval
                    this.highlightIntervalPositions(fretboard, key, interval);
                }
                break;
                
            case 'find-chords':
                // Show chords containing this note
                this.showChordsContainingNote(this.selectedNote);
                break;
        }
    }
    
    // Highlight all positions with same interval
    highlightIntervalPositions(fretboardElement, rootNote, targetInterval) {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        
        allFrets.forEach(fret => {
            const note = fret.getAttribute('data-note');
            if (!note) return;
            
            const interval = this.intervalVisualizer.getInterval(rootNote, note);
            if (interval === targetInterval) {
                fret.classList.add('interval-highlighted');
            }
        });
    }
    
    // Show chords containing the selected note
    showChordsContainingNote(note) {
        const key = window.fretboardVisualizer?.currentKey || 'C';
        const scale = window.fretboardVisualizer?.currentScale || 'Major (Ionian)';
        
        const chords = window.fretboardVisualizer?.chordVisualizer?.getChordsInScale(key, scale) || [];
        const containingChords = chords.filter(chord => chord.notes.includes(note));
        
        if (containingChords.length === 0) {
            alert(`No chords in ${key} ${scale} contain the note ${note}`);
            return;
        }
        
        const chordList = containingChords.map(c => c.name).join(', ');
        const infoSection = this.infoPanel.querySelector('.info-section:last-child');
        if (infoSection) {
            const chordDiv = document.createElement('div');
            chordDiv.className = 'chord-list';
            chordDiv.innerHTML = `<strong>Chords containing ${note}:</strong> ${chordList}`;
            infoSection.appendChild(chordDiv);
        }
    }
    
    // Clear note selection
    clearSelection(fretboardElement) {
        const allFrets = fretboardElement.querySelectorAll('.fret');
        allFrets.forEach(fret => {
            fret.classList.remove('note-selected', 'interval-highlighted');
        });
        
        this.selectedNote = null;
        this.selectedPositions = [];
    }
    
    // Hide info panel
    hideInfoPanel() {
        if (this.infoPanel) {
            this.infoPanel.style.display = 'none';
        }
    }
}
