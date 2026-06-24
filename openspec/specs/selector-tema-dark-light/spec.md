# Theme Selector and Dynamic Switching Specification

## Purpose
This specification defines the functional requirements and behavioral criteria for the dynamic theme switching system, the premium interactive theme selector in the Header, the responsive glassmorphism light mode overrides across the dashboard, and the interactive particle canvas background.

## Requirements

| ID | Requirement | Strength | Description |
|---|---|---|---|
| REQ-THEME-DYNAMIC | Dynamic Theme Switching | MUST | Load and inject the active PrimeReact theme CSS dynamically, update `document.documentElement` classes, manage theme persistence in `localStorage`, and switch themes smoothly without page reload. |
| REQ-THEME-SELECTOR | Cool Theme Selector | MUST | Render an animated, pill-shaped theme toggle switch in the Header showing moon/sun icons with custom animations depending on the active theme. |
| REQ-THEME-OVERRIDES | Light/Dark UI Adaptations | MUST | Update all dashboard cards, skeletons, and tables to support an elegant solid light mode design and preserve their deep dark mode design, ensuring maximum contrast and readability. |
| REQ-THEME-BACKGROUND | Animated Interactive Background | MUST | Render a high-performance, full-screen canvas particle background that reacts to mouse movements with gravitational attraction and velocity sweep forces, adapting particle colors to the active theme. |
| REQ-THEME-SCROLLBAR | Custom Premium Scrollbar | MUST | Style a custom scrollbar with a fully transparent track and a floating pill-shaped thumb that adapts to the active theme and turns into a glowing indigo color on hover. |
| REQ-THEME-EDGE | Safety and Performance | MUST | Clean up all canvas animation frames and event listeners, prevent flashes of unstyled content, and achieve 60fps rendering. |

---

### Requirement: REQ-THEME-DYNAMIC (Dynamic Theme Switching)
The application MUST support switching between 'dark' and 'light' modes. The active PrimeReact theme CSS string MUST be dynamically injected into a `<style id="primereact-theme">` element in the document head. The theme preference MUST be persisted in `localStorage` and restored on page reload.

#### Scenario: Switching to Light Theme
- GIVEN the application is running in 'dark' mode
- WHEN the user toggles the theme to 'light'
- THEN the `dark` class MUST be removed from `document.documentElement`
- AND the background color wrapper div MUST transition to `#f8fafc` and the body text to `#0f172a`
- AND the `<style id="primereact-theme">` element MUST contain the Lara Light Blue theme CSS
- AND the `theme` state MUST be saved to `localStorage` under the key `"theme"` as `"light"`.

#### Scenario: Switching to Dark Theme
- GIVEN the application is running in 'light' mode
- WHEN the user toggles the theme to 'dark'
- THEN the `dark` class MUST be added to `document.documentElement`
- AND the background color wrapper div MUST transition to `#0b0f19` and the body text to `#f3f4f6`
- AND the `<style id="primereact-theme">` element MUST contain the Lara Dark Blue theme CSS
- AND the `theme` state MUST be saved to `localStorage` under the key `"theme"` as `"dark"`.

#### Scenario: Restoring Theme from LocalStorage
- GIVEN the application is booting
- WHEN `localStorage` contains `"theme"` set to `"light"`
- THEN the theme state MUST be initialized to `"light"` on load
- ELSE if no theme is saved, the application MUST default to `"dark"`.

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
All main dashboard components (Summary cards, Skeletons, Recommendations, and Price Table) MUST support a highly legible, solid design in Light Mode to completely block background particle noise while maintaining their dark mode aesthetic.

#### Scenario: Light Mode Card Aesthetic
- GIVEN the theme is `'light'`
- WHEN dashboard cards are rendered
- THEN they MUST use a solid white look: `bg-white border-slate-200/80 shadow-sm`
- AND primary headings and values MUST use high-contrast dark slate: `text-slate-900` for headings and `text-slate-950` for values (such as prices)
- AND secondary descriptions and subtitles MUST use readable colors: `text-slate-755` or `text-slate-700`.

#### Scenario: Dark Mode Card Aesthetic
- GIVEN the theme is `'dark'`
- WHEN dashboard cards are rendered
- THEN they MUST preserve their deep dark glassmorphism design: `bg-slate-950/30 border-slate-800/60 backdrop-blur-md shadow-xl`
- AND text elements MUST use light slate colors: `text-slate-100` for primary text, `text-slate-200` for values, and `text-slate-400` for subtitles.

---

### Requirement: REQ-THEME-BACKGROUND (Animated Interactive Background)
The application MUST render a high-performance, full-screen background using an interactive canvas particle simulation that adapts to the theme and responds dynamically to the mouse.

#### Scenario: Particle Theme Adaptation
- GIVEN the theme is `'dark'`
- WHEN the particle simulation runs
- THEN the particles MUST be drawn in deep indigo, violet, and cyan tones (`#818cf8`, `#a78bfa`, `#22d3ee`) with a global canvas opacity of `0.60`
- GIVEN the theme is `'light'`
- WHEN the particle simulation runs
- THEN the particles MUST be drawn in soft warm amber and indigo tones (`#f59e0b`, `#6366f1`) with a global canvas opacity of `0.90`.

#### Scenario: Gravitational Attraction and Velocity Sweep
- GIVEN the canvas particle background is mounted
- WHEN the user moves the mouse cursor near a particle
- THEN a gravitational pull force MUST be applied to draw the particle towards the cursor position
- AND a velocity sweep force MUST be applied to accelerate the particle in the direction of the cursor's motion
- AND when the cursor is stationary or moves away, the particle MUST decelerate smoothly and resume its slow upwards drift.

---

### Requirement: REQ-THEME-SCROLLBAR (Custom Premium Scrollbar)
The application MUST style a custom scrollbar that is cohesive with the premium, minimalist design of the dashboard.

#### Scenario: Rendering Scrollbar
- GIVEN the application is running
- THEN the scrollbar track MUST be completely transparent to allow background stars to drift underneath
- AND the scrollbar thumb MUST render as a rounded floating pill that adapts to the active theme:
  - In light mode, the thumb is soft slate (`#cbd5e1`)
  - In dark mode, the thumb is dark slate (`#334155`)
- AND when the user hovers over the scrollbar, the thumb MUST transition to a glowing brand indigo color (`#6366f1` in light mode, `#818cf8` in dark mode).

---

### Requirement: REQ-THEME-EDGE (Safety and Performance)
All animation frames and window event listeners MUST be cleanly disposed of.

#### Scenario: Component Unmount
- GIVEN the `AnimatedBackground` component is mounted
- WHEN the component is unmounted
- THEN the `requestAnimationFrame` loop MUST be cancelled
- AND the `mousemove` and `resize` event listeners MUST be removed from the window.
