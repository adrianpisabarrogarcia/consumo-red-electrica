# Tasks: Selector de Tema Dark/Light & Cambio Dinámico

This document breaks down the implementation of the dynamic theme switching, the animated Header toggle, the glassmorphism UI overrides, and the interactive canvas background into structured, sequential, and testable tasks.

---

## Phase 1: Infrastructure & Dynamic Themes

- [ ] **Task 1.1: Remove Static Theme CSS**
  - Locate `src/main.tsx` and remove the static import of the dark theme CSS: `import "primereact/resources/themes/lara-dark-blue/theme.css";`
  - Verify that the app still compiles, though the styling will be missing.

- [ ] **Task 1.2: Dynamic Style Swapping Setup in App.tsx**
  - Add inline CSS imports in `src/App.tsx` for both dark and light themes:
    - `import darkTheme from "primereact/resources/themes/lara-dark-blue/theme.css?inline";`
    - `import lightTheme from "primereact/resources/themes/lara-light-blue/theme.css?inline";`
  - Implement a `theme` state defaulting to `'dark'`: `const [theme, setTheme] = useState<'dark' | 'light'>('dark')`.
  - Add a `toggleTheme` function to swap between `'dark'` and `'light'`.

- [ ] **Task 1.3: Sychronize Theme side-effects in useEffect**
  - Inside `src/App.tsx`, create a `useEffect` responding to `theme` state changes:
    - Toggle the `dark` class on `document.documentElement` (`root.classList.add/remove('dark')`).
    - Set `document.body.style.backgroundColor` and `document.body.style.color` directly:
      - Dark: Background `#0b0f19`, Text `#f3f4f6`
      - Light: Background `#f8fafc` (slate-50), Text `#0f172a` (slate-900)
    - Check if a `<style id="primereact-theme">` element exists in the head. If not, create it.
    - Set the `textContent` of this style element to the active theme's CSS string.

---

## Phase 2: Interactive Canvas Background

- [ ] **Task 2.1: Create AnimatedBackground Component**
  - Create the file `src/components/AnimatedBackground.tsx`.
  - Define the canvas element: `<canvas className="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000 opacity-60 dark:opacity-35" />`.
  - Define a TypeScript interface for props: `interface AnimatedBackgroundProps { theme: 'dark' | 'light'; }`.

- [ ] **Task 2.2: Implement Particle Simulation Loop**
  - Define a `Particle` class with properties: `x`, `y`, `vx`, `vy`, `size`, `color`, `targetColor`, and `colorLerpFactor`.
  - Add methods to update particle positions (drifting) and draw them on the canvas.
  - Implement a `requestAnimationFrame` loop to clear the canvas and redraw the stardust simulation (~50-60 particles).

- [ ] **Task 2.3: Add Mouse Repulsion Physics**
  - Track mouse coordinates (`mouse.x`, `mouse.y`) via a window `mousemove` listener.
  - For each frame, calculate the distance between the mouse and each particle.
  - If a particle is within the repulsion radius (e.g., 120px), apply a vector force pushing the particle away.
  - Integrate a window `resize` listener to dynamically adjust the canvas size to the window dimensions.

- [ ] **Task 2.4: Implement Dynamic Theme Color Transition**
  - When the `theme` prop changes, update the target colors of all particles:
    - Dark mode: `#818cf8` (indigo-400), `#a78bfa` (violet-400), `#22d3ee` (cyan-400)
    - Light mode: `#f59e0b` (amber-500), `#6366f1` (indigo-500)
  - Lerp the current particle color towards the target color over a few frames to ensure a smooth blend.
  - Properly clean up all event listeners (`mousemove`, `resize`) and cancel the animation frame loop on unmount.

---

## Phase 3: Header Component & Animated Toggle

- [ ] **Task 3.1: Refactor Header Component Signature**
  - Modify `src/components/Header.tsx` to accept props: `theme: 'dark' | 'light'` and `toggleTheme: () => void`.
  - Update any parent declarations or tests if necessary (note: the app has no Header component tests, but we must ensure type safety).

- [ ] **Task 3.2: Design and Style the Premium Toggle Switch**
  - Create the layout with the Title on the left ("Consumo Red Eléctrica 🇪🇸") and the Toggle switch on the right.
  - Style the pill-shaped container:
    - CSS: `w-14 h-8 rounded-full bg-slate-800 dark:bg-slate-950/40 border border-slate-700 dark:border-slate-800/60 relative cursor-pointer transition-all duration-300 shadow-inner flex items-center`
    - Hover scales: `hover:scale-105 active:scale-95`
  - Style the absolute-positioned slider circle:
    - CSS: `w-6 h-6 rounded-full bg-indigo-600 dark:bg-indigo-500 absolute top-1 flex items-center justify-center transition-all duration-300 transform shadow-md`
    - Position: `left-[4px]` in Light Mode, `left-[30px]` in Dark Mode.

- [ ] **Task 3.3: Add Animated Sun and Moon Icons**
  - Inside the slider circle:
    - Render a moon icon (`pi pi-moon text-indigo-100 text-xs animate-pulse`) when `theme === 'dark'`.
    - Render a sun icon (`pi pi-sun text-amber-100 text-xs animate-spin-slow`) when `theme === 'light'`.
  - Add custom spinning animation for the sun (or utilize Tailwind's transitions and standard animations).

---

## Phase 4: Dashboard Components Theme Overrides

- [ ] **Task 4.1: Update Loading Skeletons in App.tsx**
  - Update the loading skeletons in `src/App.tsx` with `dark:` Tailwind classes:
    - Dark mode: Keep dark backgrounds (`bg-slate-950/30`, `border-slate-800`, skeleton elements `bg-slate-800`).
    - Light mode: Use light translucent cards (`bg-white/80`, `border-slate-200/80`, skeleton elements `bg-slate-200`).

- [ ] **Task 4.2: Refactor PriceSummary Component**
  - Update `src/components/PriceSummary.tsx` to support both modes:
    - Cards: `bg-white/80 border-slate-200/80 backdrop-blur-md shadow-sm dark:bg-slate-950/30 dark:border-slate-800/60 dark:shadow-xl`
    - Texts: Primary titles to `text-slate-800 dark:text-slate-100`, subtitles to `text-slate-500 dark:text-slate-400`.
    - Accent elements: Recolor card icons, borders, and badges to ensure premium aesthetics and readable contrast.

- [ ] **Task 4.3: Refactor ApplianceRecommendations Component**
  - Update `src/components/ApplianceRecommendations.tsx`:
    - Appliance Cards: Adapt to white glassmorphism vs. deep dark glassmorphism.
    - Energy Traffic Light Lists (Semáforo Energético):
      - Light Mode: Soft green (`bg-emerald-50 text-emerald-800 border-emerald-100`) and soft red (`bg-rose-50 text-rose-800 border-rose-100`).
      - Dark Mode: Glowing transparent cards (`bg-emerald-500/5 text-emerald-300 border-emerald-500/10`) and (`bg-rose-500/5 text-rose-300 border-rose-500/10`).
    - Tips Banner: Apply readable backgrounds and text colors.

- [ ] **Task 4.4: Refactor PriceTable Component**
  - Update `src/components/PriceTable.tsx`:
    - Primary table card container: Swaps between white and dark glassmorphism.
    - DataTable component styling: Ensure PrimeReact DataTable borders, headers, and rows adapt perfectly to light/dark themes.
    - Table filters: Styled dropdown selectors to ensure they are readable and look premium in both light/dark modes.

- [ ] **Task 4.5: App.tsx Root Integration**
  - Add `<AnimatedBackground theme={theme} />` right below the opening tag of the App component.
  - Pass `theme` and `toggleTheme` to `<Header theme={theme} toggleTheme={toggleTheme} />`.

---

## Phase 5: Quality Gates & Verification

- [ ] **Task 5.1: Run TypeScript Compilation Check**
  - Execute type-checking using `npx tsc -b` or `npx tsc --noEmit`.
  - Ensure zero compilation errors and zero warnings.

- [ ] **Task 5.2: Execute Vitest Test Suite**
  - Run `npx vitest run` to ensure all 37 tests continue to pass.
  - Since we didn't change the underlying price calculations, tests should pass successfully.

- [ ] **Task 5.3: Write Verification Report**
  - Document the compliance matrix for each requirement in `openspec/changes/selector-tema-dark-light/verify-report.md`.

---

## Phase 6: SDD Archiving

- [ ] **Task 6.1: Archive Documentation**
  - Create the directory `openspec/changes/archive/2026-06-24-selector-tema-dark-light/`.
  - Move `proposal.md`, `design.md`, `tasks.md`, and `verify-report.md` to this archive folder.
  - Keep `openspec/specs/selector-tema-dark-light/spec.md` in its permanent place.
  - Clean up the active `openspec/changes/selector-tema-dark-light/` folder.

- [ ] **Task 6.2: Write Archive Report**
  - Write `openspec/changes/archive/2026-06-24-selector-tema-dark-light/archive-report.md` summarizing the change lifecycle.
