// MIDI Note Visualization and I/O Support
class MIDISupport {
    constructor() {
        this.allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        this.midiNoteOffset = 12; // C4 = MIDI note 60
    }
    
    // Convert note name to MIDI note number (C4 = 60)
    noteToMIDI(noteName, octave = 4) {
        try {
            if (!noteName) {
                console.warn('MIDISupport: Invalid note name');
                return null;
            }
            
            const noteIndex = this.allNotes.indexOf(noteName);
            if (noteIndex === -1) {
                console.warn(`MIDISupport: Unknown note: ${noteName}`);
                return null;
            }
            
            return (octave * 12) + noteIndex + this.midiNoteOffset;
        } catch (error) {
            console.error('MIDISupport: Error converting note to MIDI:', error);
            return null;
        }
    }
    
    // Convert MIDI note number to note name and octave
    midiToNote(midiNumber) {
        try {
            if (midiNumber < 0 || midiNumber > 127) {
                console.warn(`MIDISupport: MIDI number out of range: ${midiNumber}`);
                return null;
            }
            
            const adjustedNote = midiNumber - this.midiNoteOffset;
            const octave = Math.floor(adjustedNote / 12);
            const noteIndex = adjustedNote % 12;
            
            return {
                note: this.allNotes[noteIndex],
                octave: octave
            };
        } catch (error) {
            console.error('MIDISupport: Error converting MIDI to note:', error);
            return null;
        }
    }
    
    // Get MIDI note number for a fretboard position
    getMIDIFromPosition(tuning, stringIndex, fret) {
        try {
            if (!tuning || stringIndex < 0 || stringIndex >= tuning.length || fret < 0) {
                console.warn('MIDISupport: Invalid position parameters');
                return null;
            }
            
            const openNote = tuning[stringIndex];
            const openNoteIndex = this.allNotes.indexOf(openNote);
            
            if (openNoteIndex === -1) {
                console.warn(`MIDISupport: Unknown open note: ${openNote}`);
                return null;
            }
            
            // Estimate octave based on string (lower strings = lower octave)
            // This is approximate - actual octave depends on instrument
            const baseOctave = 4 - (tuning.length - stringIndex - 1);
            const noteIndex = (openNoteIndex + fret) % 12;
            const octave = baseOctave + Math.floor((openNoteIndex + fret) / 12);
            
            return this.noteToMIDI(this.allNotes[noteIndex], octave);
        } catch (error) {
            console.error('MIDISupport: Error getting MIDI from position:', error);
            return null;
        }
    }
    
    // Apply MIDI note numbers as data attributes to fretboard
    applyMIDILabels(fretboardElement, tuning) {
        try {
            if (!fretboardElement || !tuning) {
                console.warn('MIDISupport: Missing required parameters');
                return;
            }
            
            const allFrets = fretboardElement.querySelectorAll('.fret');
            if (!allFrets || allFrets.length === 0) {
                console.warn('MIDISupport: No fret elements found');
                return;
            }
            
            allFrets.forEach(fret => {
                const stringIndex = parseInt(fret.getAttribute('data-string'));
                const fretNum = parseInt(fret.getAttribute('data-fret'));
                
                if (isNaN(stringIndex) || isNaN(fretNum)) return;
                
                const midiNumber = this.getMIDIFromPosition(tuning, stringIndex, fretNum);
                if (midiNumber !== null) {
                    fret.setAttribute('data-midi', midiNumber);
                }
            });
        } catch (error) {
            console.error('MIDISupport: Error applying MIDI labels:', error);
            if (window.debugConsole) {
                window.debugConsole.addEntry('error', `MIDI label error: ${error.message}`);
            }
        }
    }
    
    // Request MIDI access (Web MIDI API)
    async requestMIDIAccess() {
        try {
            if (!navigator.requestMIDIAccess) {
                console.warn('MIDISupport: Web MIDI API not available');
                return null;
            }
            
            const access = await navigator.requestMIDIAccess({ sysex: false });
            return access;
        } catch (error) {
            console.error('MIDISupport: Error requesting MIDI access:', error);
            return null;
        }
    }
}
