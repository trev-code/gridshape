# Fretboard Scale Visualizer

A comprehensive, modular web application for visualizing musical scales, chords, intervals, and patterns on stringed instruments.

## Project Goals

### Primary Objectives

1. **Universal Instrument Support**
   - Support any stringed instrument (guitar, mandolin, banjo, ukulele, bass, etc.)
   - Allow custom tunings with arbitrary row and column offsets
   - Enable visualization for experimental and non-standard instrument configurations

2. **Comprehensive Scale Visualization**
   - Display all major modes (Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian)
   - Support pentatonic, blues, jazz, Eastern, and African scales
   - Highlight scale notes overlaid on the fretboard grid
   - Make root note and key selectable via dropdowns

3. **Advanced Visualization Features**
   - **Chord Overlay**: Show chord shapes that fit within selected scales
   - **Interval Highlighting**: Color-code intervals from root (2nd, 3rd, 5th, 7th, etc.)
   - **Scale Patterns**: Highlight CAGED system and 3-note-per-string patterns
   - **Note Frequency**: Display how often each note appears across the fretboard
   - **Circle Visualizations**: Interactive circle of fifths and chromatic circle

4. **Modular Architecture**
   - Keep code easy to modify and understand
   - Separate visualization layers into different files/scripts
   - Maintain clean separation of concerns (scales, instruments, visualization, etc.)

5. **User Experience**
   - Intuitive interface with collapsible settings panel
   - Multiple visual styles (Classic, Colorful, Minimal, Bold, Circular)
   - Toggle features on/off independently
   - Custom tuning editor with localStorage persistence

6. **Extensibility**
   - 5-option AI assistance system for feature recommendations
   - Easy to add new scales, instruments, and visualization modes
   - Framework for future enhancements (arpeggios, chord progressions, etc.)

## Technical Approach

- **Pure JavaScript** - No external dependencies, runs in browser
- **Modular Design** - Each feature in separate, focused files
- **SVG Visualizations** - Circle of fifths and chromatic circle
- **LocalStorage** - Persist custom tunings
- **Responsive Design** - Works on desktop and mobile devices

## Current Features

✅ Multi-instrument support (Guitar, Mandolin, Banjo, Ukulele, Bass)  
✅ 30+ scale definitions (Major modes, Pentatonic, Blues, Jazz, Eastern, African)  
✅ 20-fret fretboard visualization  
✅ Scale highlighting with root note emphasis  
✅ Chord visualization overlay  
✅ Interval highlighting  
✅ Scale pattern detection (CAGED)  
✅ Note frequency analysis  
✅ Custom tuning editor  
✅ Circle of fifths visualization  
✅ Chromatic circle visualization  
✅ Multiple visual styles  
✅ Settings panel with feature toggles  
✅ Note click interactions with info panel  

## Future Enhancements

- Scale degree labels on fretboard
- Arpeggio pattern visualization
- Chord progression analysis
- Fret markers and position indicators
- Export/print functionality
- Scale comparison mode
- Audio playback integration
- Multi-note selection
- Note sequence builder

## Project Context

For detailed project context, architecture notes, decision log, and reminders, see `.cursor-context.md` in the project root.
