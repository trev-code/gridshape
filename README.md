# Fretboard Scale Visualizer

A comprehensive, modular web application for visualizing musical scales, chords, intervals, and patterns on stringed instruments.

**Author:** Trevor Hoffman  
**Last Updated:** December 19, 2024


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

✅ Multi-instrument support (Guitar, 7-string, 8-string, Mandolin, Banjo, Ukulele, Bass 4/5/6-string)  
✅ Grid instrument support (8x8, 8x16, 16x8, 16x16, custom grids)  
✅ Multiple tuning options per instrument (Standard, Drop D, Open tunings, etc.)  
✅ Tuning selector in settings (shows notes in dropdown)  
✅ 30+ scale definitions (Major modes, Pentatonic, Blues, Jazz, Eastern, African)  
✅ Configurable fret count (5-30 frets)  
✅ Scale highlighting with root note emphasis  
✅ Scale degree labels on fretboard  
✅ Fret markers and position indicators  
✅ Chord visualization overlay  
✅ Comprehensive chord library system (triads, 7ths, extended, altered chords)  
✅ Interval highlighting  
✅ Scale pattern detection (CAGED)  
✅ Note frequency analysis  
✅ Custom tuning editor (in settings menu)  
✅ Interactive circle of fifths visualization  
✅ Interactive chromatic circle visualization  
✅ MIDI note visualization/I/O foundation  
✅ Multiple visual styles (Classic, Colorful, Minimal, Bold, Square)  
✅ Multiple note shapes (Square, Circular, Dot, Small Dot)  
✅ Note name formats (Letters, Numbers, Roman numerals)  
✅ Color palettes (Default, Warm, Cool, Vibrant, Monochrome)  
✅ Settings panel with feature toggles  
✅ Note click interactions with info panel  
✅ Triad/diad visualization with gradient connection lines (extend into note shapes)  
✅ Horizontal and vertical fretboard mirroring  
✅ Compact legend system  
✅ Dynamic fretboard background with border  
✅ Fretboard fits to screen (no scrolling)  
✅ Settings persistence (localStorage)  
✅ Real-time debug console with copy functionality  

## Recent Improvements

- **Tuning System**: Instruments now support multiple tunings selectable from a dropdown in settings
- **New Instruments**: Added 6-string bass, 7-string and 8-string guitars
- **Scale Degrees**: Visual scale degree labels (1-7) appear on each note in the scale
- **Fret Markers**: Visual indicators at standard fret positions (3, 5, 7, 9, 12, etc.)
- **Chord Library**: Comprehensive chord definitions system for advanced chord analysis
- **MIDI Support**: Foundation for MIDI note number visualization and I/O
- **Triad Lines**: Connection lines now extend into note shapes with gradient opacity
- **Fretboard Background**: Dynamically sized background with border that fits the fretboard
- **Circle Animations**: Removed scaling animations, kept smooth color transitions
- **Settings Validation**: Improved loading and validation of saved settings

## Future Enhancements

- Arpeggio pattern visualization
- Chord progression analysis
- Export/print functionality
- Scale comparison mode
- Audio playback integration
- Multi-note selection
- Note sequence builder
- Chord voicing suggestions
- Full MIDI I/O implementation

## Project Context

For detailed project context, architecture notes, decision log, and reminders, see `.cursor-context.md` in the project root.
