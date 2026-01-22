# Fretboard Scale Visualizer

A comprehensive, modular web application for visualizing musical scales, chords, intervals, and patterns on stringed instruments.

**Author:** Trevor Hoffman  
**Last Updated:** December 19, 2024

> **Note for AI Assistants:** If the time since the last README update is over 20 minutes, please update this file with any new features, changes, or improvements that have been made to the project.

## Project Goals

### Primary Objectives

1. **Universal Instrument Support**
   - Support any stringed instrument (guitar, mandolin, banjo, ukulele, bass, etc.)
   - Allow custom tunings with arbitrary row and column offsets
   - Enable visualization for experimental and non-standard instrument configurations
   - Support grid-based instruments (8x8, 8x16, 16x8, 16x16, custom grids)

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
   - **Triad Visualization**: Multiple methods for visualizing triads with connecting lines
   - **Fretboard Mirroring**: Horizontal and vertical mirroring options

4. **Modular Architecture**
   - Keep code easy to modify and understand
   - Separate visualization layers into different files/scripts
   - Maintain clean separation of concerns (scales, instruments, visualization, etc.)

5. **User Experience**
   - Intuitive interface with collapsible settings panel
   - Multiple visual styles (Classic, Colorful, Minimal, Bold, Circular)
   - Toggle features on/off independently
   - Custom tuning editor with localStorage persistence
   - Compact legend system
   - Responsive fretboard that fits to screen

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
- **CSS Variables** - Dynamic fret count for responsive sizing

## Current Features

✅ Multi-instrument support (Guitar, Mandolin, Banjo, Ukulele, Bass)  
✅ Grid instrument support (8x8, 8x16, 16x8, 16x16, custom grids)  
✅ 30+ scale definitions (Major modes, Pentatonic, Blues, Jazz, Eastern, African)  
✅ Configurable fret count (5-30 frets)  
✅ Scale highlighting with root note emphasis  
✅ Chord visualization overlay  
✅ Interval highlighting  
✅ Scale pattern detection (CAGED)  
✅ Note frequency analysis  
✅ Custom tuning editor (in settings menu)  
✅ Interactive circle of fifths visualization  
✅ Interactive chromatic circle visualization  
✅ Multiple visual styles  
✅ Settings panel with feature toggles  
✅ Note click interactions with info panel  
✅ Triad visualization with connection lines  
✅ Horizontal and vertical fretboard mirroring  
✅ Compact legend system  
✅ Fretboard fits to screen (no scrolling)  

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
