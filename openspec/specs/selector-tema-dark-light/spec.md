# Theme Selector and Dynamic Switching Specification

## Purpose
This specification defines the functional requirements and behavioral criteria for the dynamic theme switching system, the premium interactive theme selector in the Header, the responsive glassmorphism light mode overrides across the dashboard, and the interactive particle canvas background.

## Requirements

| ID | Requirement | Strength | Description |
|---|---|---|---|
| REQ-THEME-DYNAMIC | Dynamic Theme Switching | MUST | Load and inject the active PrimeReact theme CSS dynamically, update `document.documentElement` classes, and set `document.body` background and text colors without page reload. |
| REQ-THEME-SELECTOR | Cool Theme Selector | MUST | Render an animated, pill-shaped theme toggle switch in the Header showing moon/sun icons with custom animations depending on the active theme. |
| REQ-THEME-OVERRIDES | Light/Dark UI Adaptations | MUST | Update all dashboard cards, skeletons, and tables to support an elegant glassmorphism light mode design and preserve their deep dark mode design, ensuring high readability. |
| REQ-THEME-BACKGROUND | Animated Interactive Background | MUST | Render a high-performance, full-screen canvas particle background that reacts to mouse movements with a gentle repulsion force and dynamically adapts particle colors to the active theme. |
| REQ-THEME-EDGE | Safety and Performance | MUST | Clean up all canvas animation frames and event listeners, prevent flashes of unstyled content, and achieve 60fps rendering. |

---

### Requirement: REQ-THEME-DYNAMIC (Dynamic Theme Switching)
The application MUST support switching between 'dark' and 'light' modes. The active PrimeReact theme CSS string MUST be dynamically injected into a `<style id="primereact-theme">` element in the document head.

#### Scenario: Switching to Light Theme
- GIVEN the application is running in 'dark' mode
- WHEN the user toggles the theme to 'light'
- THEN the `dark` class MUST be removed from `document.documentElement`
- AND the background of `document.body` MUST be set to `#f8fafc` (slate-50) and text to `#0f172a` (slate-900)
- AND the `<style id="primereact-theme">` element MUST contain the Lara Light Blue theme CSS
- AND the `theme` state MUST be set to `'light'`.

#### Scenario: Switching to Dark Theme
- GIVEN the application is running in 'light' mode
- WHEN the user toggles the theme to 'dark'
- THEN the `dark` class MUST be added to `document.documentElement`
- AND the background of `document.body` MUST be set to `#0b0f19` and text to `#f3f4f6`
- AND the `<style id="primereact-theme">` element MUST contain the Lara Dark Blue theme CSS
- AND the `theme` state MUST be set to `'dark'`.

---

### Requirement: REQ-THEME-SELECTOR (Cool Theme Selector)
The Header component MUST render a highly interactive, animated theme selector switch.

#### Scenario: Rendering Theme Selector
- GIVEN the Header is rendered with `theme` and `toggleTheme` props
- THEN it MUST display a pill-shaped container of width `w-14` and height `h-8` with smooth borders and transition effects
- AND it MUST contain an absolute positioned slider circle of size `w-6 h-6` that shifts position:
  - When theme is `'dark'`, the slider is at `left-[30px]` and displays a pulsing moon icon (`pi pi-moon`)
  - When theme is `'light'`, the slider is at `left-[4px]` and displays a slowly rotating sun icon (`pi pi-sun`)
- AND clicking the pill container MUST invoke the `toggleTheme` callback.

---

### Requirement: REQ-THEME-OVERRIDES (Light/Dark UI Adaptations)
All main dashboard components (Summary cards, Skeletons, Recommendations, and Price Table) MUST support a consistent glassmorphism design in Light Mode while maintaining their dark mode aesthetic.

#### Scenario: Light Mode Card Aesthetic
- GIVEN the theme is `'light'`
- WHEN dashboard cards are rendered
- THEN they MUST use a translucent white glassmorphism look: `bg-white/80 border-slate-200/80 backdrop-blur-md shadow-sm`
- AND text elements MUST use dark slate colors: `text-slate-800` for primary text and `text-slate-500` for subtitles.

#### Scenario: Dark Mode Card Aesthetic
- GIVEN the theme is `'dark'`
- WHEN dashboard cards are rendered
- THEN they MUST preserve their deep dark design: `bg-slate-950/30 border-slate-800/60 backdrop-blur-md shadow-xl`
- AND text elements MUST use light slate colors: `text-slate-100` for primary text and `text-slate-400` for subtitles.

---

### Requirement: REQ-THEME-BACKGROUND (Animated Interactive Background)
The application MUST render a full-screen background using an interactive canvas particle simulation.

#### Scenario: Particle Theme Adaptation
- GIVEN the theme is `'dark'`
- WHEN the particle simulation runs
- THEN the particles MUST be drawn in deep indigo, violet, and cyan tones (`#818cf8`, `#a78bfa`, `#22d3ee`)
- GIVEN the theme is `'light'`
- WHEN the particle simulation runs
- THEN the particles MUST be drawn in soft warm amber and indigo tones (`#f59e0b`, `#6366f1`).

#### Scenario: Mouse Repulsion Interaction
- GIVEN the canvas particle background is mounted
- WHEN the user moves the mouse cursor near a particle
- THEN a gentle repulsion force MUST be applied to push the particle away from the cursor
- AND when the cursor moves away, the particle MUST return to its normal drifting motion.

---

### Requirement: REQ-THEME-EDGE (Safety and Performance)
All animation frames and window event listeners MUST be cleanly disposed of.

#### Scenario: Component Unmount
- GIVEN the `AnimatedBackground` component is mounted
- WHEN the component is unmounted
- THEN the `requestAnimationFrame` loop MUST be cancelled
- AND the `mousemove` and `resize` event listeners MUST be removed from the window.
