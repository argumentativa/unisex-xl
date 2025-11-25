# Product Requirements Document (PRD)
## UNISEX XL Step Sequencer

---

## 1. Product Overview

### 1.1 Product Name
**UNISEX XL Step Sequencer**

### 1.2 Product Description
A standalone web-based step sequencer for live music creation. It provides a visual, interactive interface for building musical patterns using 12 different Tone.js synthesizers, with real-time visual feedback that responds to user interaction.

### 1.3 Product Vision
Enable musicians and creators to build complex, multi-instrument patterns through an intuitive visual interface where every interaction creates immediate audio and visual feedback.

### 1.4 Target Users
- Electronic music producers
- Live performers
- Music educators
- Hobbyists exploring music creation
- Developers learning audio programming

---

## 2. Goals & Objectives

### 2.1 Primary Goals
1. Provide an intuitive step sequencer interface
2. Support multiple instrument types simultaneously
3. Offer real-time visual feedback tied to musical activity
4. Enable rapid pattern creation and iteration
5. Support live performance workflows

### 2.2 Success Criteria
- Users can create patterns without reading documentation
- Visual feedback clearly communicates musical state
- All 12 instruments can play simultaneously without performance issues
- Patterns play back accurately at various BPMs (60-200)
- Interface is responsive and works on desktop and tablet devices

---

## 3. User Stories

### 3.1 Core User Stories

**US-1: Pattern Creation**
- As a user, I want to click step buttons to create patterns so I can build musical sequences visually.

**US-2: Chromatic Note Selection**
- As a user, I want to cycle through chromatic notes (C → C# → D → ... → B) by clicking a step multiple times so I can select any note in the chromatic scale.

**US-3: Visual Feedback**
- As a user, I want to see visual feedback when I interact with steps so I can understand the current state of my pattern.

**US-4: Multi-Instrument Patterns**
- As a user, I want to use multiple instruments simultaneously so I can create layered, complex musical arrangements.

**US-5: Playback Control**
- As a user, I want to play, pause, and stop my patterns so I can control playback during creation and performance.

**US-6: Tempo Control**
- As a user, I want to adjust BPM in real-time so I can change the tempo of my patterns without stopping playback.

**US-7: Step Indicator**
- As a user, I want to see which step is currently playing so I can follow along with the pattern.

**US-8: Pattern Reset**
- As a user, I want steps to automatically turn off after completing a full chromatic cycle so I can easily clear patterns and start fresh.

---

## 4. Features & Functional Requirements

### 4.1 Core Features

#### FR-1: Step Grid
- **Requirement**: Display 12 instrument rows, each with 16 step buttons
- **Acceptance Criteria**:
  - Each instrument has a unique color hue
  - Steps are arranged in a clear grid layout
  - Grid is scrollable on smaller screens
  - Steps are clearly clickable/tappable

#### FR-2: Chromatic Note Cycling
- **Requirement**: Each step cycles through chromatic scale (C → C# → D → D# → E → F → F# → G → G# → A → A# → B → OFF)
- **Acceptance Criteria**:
  - First click sets note to C
  - Each subsequent click advances to next chromatic note
  - After 12 clicks, step turns off automatically
  - Clicking an inactive step resets to C and activates it
  - Note information is stored per step

#### FR-3: Visual State Feedback
- **Requirement**: Steps provide clear visual feedback about their state
- **Acceptance Criteria**:
  - Active steps glow at 100% saturation
  - Inactive steps are dark gray
  - Color intensity does not dim after activation
  - Each instrument row has a distinct color hue
  - Visual feedback is immediate on click

#### FR-4: Progressive Color System
- **Requirement**: Background and overall interface colors intensify with user interaction
- **Acceptance Criteria**:
  - Background starts dark (#1e1e1e)
  - Background gradients intensify as more steps are activated
  - 5 interaction levels (0-4) based on total active steps
  - Animated gradients shift colors smoothly
  - Per-row activity affects individual row glow intensity

#### FR-5: Step Indicator
- **Requirement**: Visual indicator shows current playing step
- **Acceptance Criteria**:
  - Blue stroke moves through active steps during playback
  - Indicator opacity is 40% for subtlety
  - Current step pulses with animation
  - Indicator syncs with audio playback timing
  - Indicator stops when playback stops

#### FR-6: Instrument Support
- **Requirement**: Support 12 different Tone.js instruments
- **Acceptance Criteria**:
  - All instruments are available as separate rows
  - Each instrument has appropriate default settings
  - Instruments play correct notes based on step state
  - Noise-based instruments (NoiseSynth, Snare) trigger correctly
  - All instruments can play simultaneously

#### FR-7: Playback Controls
- **Requirement**: Play, Pause, Stop controls for pattern playback
- **Acceptance Criteria**:
  - Play button starts playback from beginning
  - Pause button pauses playback (can resume)
  - Stop button stops playback and resets to start
  - Buttons show active state visually
  - Status bar displays current playback state

#### FR-8: BPM Control
- **Requirement**: Real-time BPM adjustment
- **Acceptance Criteria**:
  - BPM slider range: 60-200 BPM
  - Default BPM: 120
  - BPM changes apply immediately during playback
  - BPM value displays current setting
  - Changes are smooth without audio glitches

#### FR-9: Pattern Storage
- **Requirement**: Each step stores its musical state
- **Acceptance Criteria**:
  - Each step stores: noteIndex (0-11), pressCount, isActive
  - State persists during playback
  - State can be modified during playback
  - Patterns are independent per instrument

#### FR-10: Sequence Generation
- **Requirement**: Generate Tone.js sequences from step patterns
- **Acceptance Criteria**:
  - Sequences are created when steps are activated
  - Sequences update when steps are modified
  - Only active steps create notes in sequences
  - Sequences sync to Transport timing
  - Sequences start/stop correctly with playback controls

---

## 5. Technical Specifications

### 5.1 Technology Stack

**Frontend Framework:**
- TypeScript (strict mode)
- ES Modules
- Vite build system

**Audio Engine:**
- Tone.js v15.1.22
- Web Audio API

**UI Framework:**
- Vanilla JavaScript/TypeScript
- CSS3 with custom properties
- HTML5

**Build Tools:**
- Vite 5.0.0
- TypeScript 5.3.0

### 5.2 Architecture

**Component Structure:**
```
sequencer.html (Entry Point)
├── sequencer-main.ts (Initialization & Event Handlers)
├── Sequencer.ts (Core Logic)
│   ├── InstrumentRow.ts (Row Component)
│   │   └── StepButton.ts (Step Component)
│   └── AudioEngine (Audio Management)
└── sequencer.css (Styles)
```

**Data Models:**
```typescript
interface StepState {
  noteIndex: number;      // 0-11 (chromatic position)
  pressCount: number;     // Number of clicks
  isActive: boolean;      // Active state
}

interface StepPattern {
  instrumentId: InstrumentType;
  steps: StepState[];     // 16 steps
}
```

### 5.3 Available Instruments

1. **Synth** - Basic triangle wave synthesizer
2. **PolySynth** - Polyphonic synthesizer (chord-capable)
3. **MonoSynth** - Monophonic synthesizer with filter envelope
4. **FMSynth** - FM synthesis (bright, bell-like)
5. **AMSynth** - Amplitude modulation (hollow, metallic)
6. **MembraneSynth** - Kick drums and bass drums
7. **NoiseSynth** - White noise (percussion, hi-hats)
8. **Snare** - Snare drum (NoiseSynth variant)
9. **PluckSynth** - Plucked string sounds
10. **MetalSynth** - Metallic sounds (cymbals)
11. **DuoSynth** - Dual oscillator synthesizer
12. **Monophonic** - Monophonic base class (uses Synth)

### 5.4 Audio Specifications

**Timing:**
- Resolution: 16th note (16 steps per pattern)
- Sync: Tone.js Transport
- Precision: Sample-accurate timing

**Note Calculation:**
- Base octaves per instrument type:
  - MembraneSynth/Drums: Octave 1 (C1)
  - MonoSynth/Bass: Octave 2 (C2)
  - Standard instruments: Octave 4 (C4)
- Chromatic notes: C, C#, D, D#, E, F, F#, G, G#, A, A#, B

**Sequence Format:**
- Tone.Sequence with 16 steps
- Null values for inactive steps
- Note strings for active steps (e.g., "C4", "C#4", "D4")

### 5.5 Performance Requirements

**Audio Performance:**
- Support 12 simultaneous instruments
- No audio dropouts or glitches
- Latency < 50ms
- CPU usage reasonable for web application

**Visual Performance:**
- Smooth animations (60fps)
- Responsive to user input (< 16ms)
- No layout shifts during interaction
- Efficient color calculations

**Browser Support:**
- Modern browsers with Web Audio API support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

---

## 6. User Experience Requirements

### 6.1 Visual Design

**Color System:**
- Base background: #1e1e1e (dark)
- Active steps: 100% saturation HSL colors
- Inactive steps: #3e3e42 (dark gray)
- Step indicator: rgba(0, 212, 255, 0.4) (cyan, 40% opacity)
- Instrument hues: Unique per instrument (0-360°)

**Typography:**
- Header: 1.8rem, weight 600
- Subtitle: 0.9rem
- Controls: 1rem
- Status: 0.9rem

**Layout:**
- Full viewport height
- Fixed header and footer
- Scrollable grid container
- Responsive grid layout

### 6.2 Interaction Design

**Step Button Interaction:**
- Click to cycle through chromatic scale
- Visual feedback on click (immediate)
- Hover state for better affordance
- Active state clearly visible

**Playback Controls:**
- Large, clearly labeled buttons
- Active state indication
- Immediate response to clicks
- Visual feedback on state changes

**BPM Control:**
- Slider with visible value
- Real-time updates
- Smooth dragging experience

### 6.3 Accessibility

**Requirements:**
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast for visibility
- Focus indicators

---

## 7. Design Specifications

### 7.1 Layout Structure

```
┌─────────────────────────────────────┐
│ Header: "STEP SEQUENCER"            │
├─────────────────────────────────────┤
│ Controls: [▶] [⏸] [⏹] BPM: [120]  │
├─────────────────────────────────────┤
│                                     │
│ Instrument Grid (Scrollable)        │
│ ┌─────────────────────────────────┐│
│ │ Synth:     [○][○][●][○]...       ││
│ │ PolySynth: [○][●][○][○]...       ││
│ │ ...                              ││
│ └─────────────────────────────────┘│
├─────────────────────────────────────┤
│ Status: Ready | Stopped             │
└─────────────────────────────────────┘
```

### 7.2 Component Specifications

**Step Button:**
- Size: Aspect ratio 1:1 (responsive)
- Border: 2px solid, rounded corners
- States: inactive, active, current-step
- Animation: Glow pulse for active, dramatic pulse for current

**Instrument Row:**
- Height: Auto (based on step button size)
- Padding: 0.75rem
- Background: rgba(37, 37, 38, 0.5)
- Border radius: 8px
- Label width: 80px (desktop), 60px (mobile)

**Controls:**
- Button padding: 0.5rem 1rem
- Button border radius: 4px
- Slider width: 150px
- Gap between controls: 2rem

### 7.3 Animation Specifications

**Step Indicator:**
- Animation: pulse-step-dramatic
- Duration: 0.4s
- Easing: ease-in-out
- Infinite loop
- Scale: 1.1 → 1.15 → 1.1

**Glow Effect:**
- Animation: glow-pulse
- Duration: 2s
- Easing: ease-in-out
- Infinite loop
- Saturation: 100% constant

**Background Gradient:**
- Transition: 0.6s ease
- Animation: gradient-shift (per level)
- Duration: 1.5s - 4s (varies by level)
- Transform: translate + rotate + scale

---

## 8. Functional Flow

### 8.1 Pattern Creation Flow

1. User opens sequencer
2. User clicks step button
3. Step activates at C (noteIndex = 0)
4. Step glows at 100% saturation
5. User clicks same step again
6. Step cycles to C# (noteIndex = 1)
7. Process repeats through chromatic scale
8. After 12 clicks, step turns off
9. Next click resets to C

### 8.2 Playback Flow

1. User creates patterns by clicking steps
2. User clicks Play button
3. AudioEngine starts (user gesture required)
4. Sequences are created for all instruments with active steps
5. Transport starts
6. Sequences begin playing
7. Step indicator animates through active steps
8. User can pause/resume or stop
9. User can adjust BPM during playback
10. User can modify steps during playback (sequences update)

### 8.3 Visual Feedback Flow

1. User clicks first step
2. Interaction level increases (0 → 1)
3. Background gradient appears
4. Step glows at 100% saturation
5. User clicks more steps
6. Interaction level increases (1 → 2 → 3 → 4)
7. Background becomes more colorful
8. Per-row activity affects row glow
9. Overall interface becomes more vibrant

---

## 9. Edge Cases & Error Handling

### 9.1 Audio Context

**Issue**: AudioContext requires user gesture
**Solution**: Play button triggers AudioEngine.start()
**Error Handling**: Show error message if audio fails to start

### 9.2 Sequence Management

**Issue**: Sequences must be created before Transport starts
**Solution**: Create sequences immediately when steps are activated
**Error Handling**: Log errors, don't break playback

### 9.3 Note Calculation

**Issue**: Invalid note formats
**Solution**: Validate note strings before passing to Tone.js
**Error Handling**: Catch errors, log with context

### 9.4 Browser Compatibility

**Issue**: Web Audio API not supported
**Solution**: Check for support, show message if unavailable
**Error Handling**: Graceful degradation

---

## 10. Success Metrics

### 10.1 User Engagement
- Time spent creating patterns
- Number of steps activated per session
- Number of instruments used simultaneously

### 10.2 Performance Metrics
- Audio latency < 50ms
- Frame rate > 60fps during animations
- CPU usage < 30% on average hardware

### 10.3 Usability Metrics
- Time to first pattern creation < 30 seconds
- Error rate < 5%
- User satisfaction (qualitative feedback)

---

## 11. Future Enhancements

### 11.1 Pattern Management
- Save/load patterns
- Pattern library
- Export patterns as MIDI
- Import MIDI files

### 11.2 Advanced Features
- Swing/shuffle timing
- Step velocity control
- Step length control (note duration)
- Pattern chaining (multiple patterns)
- Song mode (arrangement)

### 11.3 Visual Enhancements
- Waveform visualization
- Spectrum analyzer
- 3D visualization
- Custom color themes

### 11.4 Collaboration
- Real-time collaboration
- Pattern sharing
- Community pattern library

### 11.5 Instrument Customization
- Instrument parameter controls
- Custom instrument presets
- Effects per instrument
- MIDI input support

---

## 12. Dependencies & Constraints

### 12.1 External Dependencies
- Tone.js v15.1.22
- Web Audio API (browser)
- Modern browser with ES6+ support

### 12.2 Constraints
- Requires user gesture for audio (browser security)
- Limited to browser audio capabilities
- No offline storage (patterns not persisted)
- No MIDI export (future enhancement)

### 12.3 Technical Debt
- Instrument instances created on-demand (could be pre-initialized)
- No pattern undo/redo
- No pattern copy/paste
- Limited error recovery

---

## 13. Glossary

**Step**: A single position in the 16-step pattern
**Step State**: The musical data stored in a step (note, active status)
**Pattern**: A complete 16-step sequence for one instrument
**Sequence**: A Tone.js Sequence object that plays notes
**Chromatic Scale**: The 12-note scale (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
**Transport**: Tone.js global timing system
**Interaction Level**: A value (0-4) representing total user activity
**Row Activity**: A value (0-1) representing activity level of a single instrument row

---

## 14. Appendix

### 14.1 File Structure
```
sequencer.html
src/
├── sequencer-main.ts
├── ui/sequencer/
│   ├── Sequencer.ts
│   ├── InstrumentRow.ts
│   └── StepButton.ts
├── styles/
│   └── sequencer.css
└── core/
    └── audio.ts (AudioEngine)
```

### 14.2 Key Algorithms

**Chromatic Note Cycling:**
```
noteIndex = (noteIndex + 1) % 12
if pressCount >= 12:
  isActive = false
  reset to C
```

**Interaction Level Calculation:**
```
totalActiveSteps = sum of all active steps across all instruments
if totalActiveSteps == 0: level = 0
if totalActiveSteps <= 4: level = 1
if totalActiveSteps <= 8: level = 2
if totalActiveSteps <= 12: level = 3
else: level = 4
```

**Saturation Calculation:**
```
if not isActive: return 0
return 100  // Always 100% for active steps
```

---

**Document Version**: 1.0  
**Last Updated**: Current Implementation  
**Status**: Implemented & Functional

