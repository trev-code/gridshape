# Fretboard Scale Visualizer

A comprehensive, modular web application for visualizing musical scales, chords, intervals, and patterns on stringed instruments.

**Author:** Trevor Hoffman  
**Last Updated:** December 20, 2024


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
✅ Triad line opacity control (slider 0-100%)  
✅ Triad triangle fill/shading option  
✅ Enhanced pattern visualization (multiple patterns, connecting lines, color-coded)  
✅ Horizontal and vertical fretboard mirroring  
✅ Compact legend system  
✅ Dynamic fretboard background with border  
✅ Fretboard fits to screen (no scrolling)  
✅ Settings persistence (localStorage)  
✅ Real-time debug console with copy functionality  
✅ Grid interval presets (4ths, Tritone, 5ths, Midimech)  
✅ Fret number indicators (numbers or pips)  
✅ Column labels for grid layouts (C1, C2, etc.)  

## Recent Improvements

- **Tuning System**: Instruments now support multiple tunings selectable from a dropdown in settings
- **New Instruments**: Added 6-string bass, 7-string and 8-string guitars
- **Scale Degrees**: Visual scale degree labels (1-7) appear on each note in the scale
- **Fret Markers**: Visual indicators at standard fret positions (3, 5, 7, 9, 12, etc.)
- **Chord Library**: Comprehensive chord definitions system for advanced chord analysis
- **MIDI Support**: Foundation for MIDI note number visualization and I/O
- **Triad Lines**: Connection lines now extend into note shapes with gradient opacity
- **Triad Controls**: Added opacity slider (0-100%) and triangle fill/shading option
- **Pattern Visualization**: Enhanced with multiple patterns, connecting lines, and color-coding
- **Feature Toggle Validation**: All feature toggles now validate data before activating
- **Grid Interval Presets**: Quick access to common interval configurations (4ths, Tritone, 5ths, Midimech)
- **Fret Number Display**: Choose between numbers or traditional pips (dots) for fret indicators
- **Grid Column Labels**: Column labels (C1, C2, etc.) for grid layouts matching row labels
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

## Planned Improvements & Upgrades

### High Priority

1. **Arpeggio Pattern Visualization**
   - **Plan**: Create `arpeggios.js` module similar to `triads.js`
   - **Approach**: Define arpeggio patterns (ascending, descending, alternating), find positions on fretboard, visualize with connecting lines
   - **Dependencies**: Scale notes, instrument tuning/grid layout
   - **Estimated Complexity**: Medium

2. **Chord Progression Analysis**
   - **Plan**: Create `progressions.js` module to analyze chord relationships
   - **Approach**: Calculate common progressions (I-IV-V, ii-V-I, etc.), highlight on fretboard, show voice leading
   - **Dependencies**: Chord library, scale manager
   - **Estimated Complexity**: Medium-High

3. **Export/Print Functionality**
   - **Plan**: Add export buttons in settings menu
   - **Approach**: Use Canvas API or SVG export, generate PDF via browser print API, support PNG/SVG formats
   - **Dependencies**: Fretboard rendering, current visualizations
   - **Estimated Complexity**: Low-Medium

### Medium Priority

4. **Scale Comparison Mode**
   - **Plan**: Add toggle to compare two scales side-by-side or overlay
   - **Approach**: Dual-scale visualization with different colors, toggle between scales, highlight differences
   - **Dependencies**: Scale visualizer, UI controls
   - **Estimated Complexity**: Medium

5. **Audio Playback Integration**
   - **Plan**: Integrate Web Audio API for note/chord playback
   - **Approach**: Click notes to play, play scale sequences, chord arpeggios, use MIDI-like synthesis
   - **Dependencies**: Web Audio API, frequency calculations
   - **Estimated Complexity**: Medium-High

6. **Multi-Note Selection**
   - **Plan**: Extend note interaction system to support multiple selections
   - **Approach**: Shift+click or drag selection, show combined info panel, analyze selected notes as chord/scale
   - **Dependencies**: Note interaction manager
   - **Estimated Complexity**: Medium

### Lower Priority

7. **Note Sequence Builder**
   - **Plan**: Create sequence editor for building melodic patterns
   - **Approach**: Click notes to add to sequence, playback sequence, save/load sequences, export as MIDI
   - **Dependencies**: Audio playback (if implemented), sequence storage
   - **Estimated Complexity**: High

8. **Chord Voicing Suggestions**
   - **Plan**: Algorithm to suggest optimal chord voicings based on context
   - **Approach**: Analyze current position, suggest nearby voicings, show voice leading paths, consider string sets
   - **Dependencies**: Chord library, triad visualizer
   - **Estimated Complexity**: High

9. **Full MIDI I/O Implementation**
   - **Plan**: Complete MIDI support with input/output
   - **Approach**: Web MIDI API integration, MIDI input to highlight notes, MIDI output for playback, device selection
   - **Dependencies**: MIDI support foundation, Web MIDI API
   - **Estimated Complexity**: Medium-High

10. **Advanced Pattern Recognition**
    - **Plan**: Extend pattern visualizer with more pattern types
    - **Approach**: Add 3-note-per-string, diagonal patterns, box patterns, show pattern names and positions
    - **Dependencies**: Pattern visualizer
    - **Estimated Complexity**: Medium

## Project Context

For detailed project context, architecture notes, decision log, and reminders, see `.cursor-context.md` in the project root.
