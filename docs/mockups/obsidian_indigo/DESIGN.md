# Design System Strategy: The Luminous Vault

## 1. Overview & Creative North Star

**Creative North Star: The Luminous Vault**
This design system rejects the "utilitarian spreadsheet" aesthetic common in fintech. Instead, we are building a premium, editorial experience that treats financial data as a curated gallery. We move beyond standard dark mode by utilizing deep tonal depth, high-contrast accents, and "Luminous" layering. 

The system breaks the rigid grid through **intentional asymmetry**: large-scale display typography is paired with micro-labels to create a sense of rhythm and hierarchy. We don't just show numbers; we give them a stage. By utilizing overlapping elements and varying surface textures, we create a mobile-first interface that feels fluid, professional, and bespoke.

---

## 2. Colors

The color palette is built on a foundation of "Deep Charcoal" and "Navy," with "Electric Indigo" acting as the high-energy pulse of the application.

### The Palette
- **Primary (Electric Indigo):** `#c2c1ff` – Used for primary actions and brand presence.
- **Surface Foundations:** 
  - `surface`: `#0b1326` (Deep Base)
  - `surface_container`: `#171f33` (Secondary Depth)
  - `surface_bright`: `#31394d` (Elevated Layers)
- **Semantic Accents:**
  - **Success (Emerald):** Inferred for income/success flows.
  - **Error (Rose):** `#ffb4ab` (Expenses/Warnings).
  - **Warning (Gold):** `#ffb77d` (Budgets/Alerts).

### The "No-Line" Rule
Standard UI relies on borders to separate content. **In this system, 1px solid borders for sectioning are strictly prohibited.** Boundaries must be defined solely through background color shifts. For example, a `surface_container_low` section sitting on a `surface` background provides enough contrast to signify a new area without the visual "noise" of a line.

### Surface Hierarchy & Nesting
Think of the UI as a series of physical layers—like stacked sheets of frosted glass. 
- Use `surface_container_lowest` for the main background.
- Use `surface_container` for secondary content areas.
- Use `surface_container_highest` for interactive cards or modals.
This nesting creates a natural "Z-axis" that guides the eye toward the most important information.

### The "Glass & Gradient" Rule
To achieve a signature look, use **Glassmorphism** for floating elements (like bottom navigation or top app bars). Apply `surface_variant` with a 60% opacity and a 20px backdrop-blur. 
**Signature Texture:** Main CTAs should not be flat. Use a subtle linear gradient transitioning from `primary` (#c2c1ff) to `primary_container` (#5856d6) at a 135-degree angle to give the button "soul" and a metallic, premium sheen.

---

## 3. Typography

The typography uses **Inter** to maintain a clean, high-performance feel, but we apply editorial styling to differentiate the experience.

- **Display (display-lg/md):** Use for hero balances or primary data points. These should feel authoritative.
- **Headline & Title:** Used for page headings. Pair these with significant vertical whitespace to let the data "breathe."
- **Body:** The workhorse of the app. Ensure `body-md` (#dae2fd) has sufficient line height (1.5x) for maximum readability against dark backgrounds.
- **Labels:** `label-sm` should be used for metadata. Increase letter spacing by 0.05rem for a sophisticated, technical look.

**The Editorial Contrast:** Always pair a `display-sm` value with a `label-md` nearby. The massive scale difference between the "Main Number" and the "Contextual Label" creates the high-end look we are striving for.

---

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** rather than traditional structural lines.

- **The Layering Principle:** Stack `surface-container` tiers to create depth. A card using `surface_container_highest` placed on a `surface` background creates a soft, natural lift.
- **Ambient Shadows:** Shadows should be used sparingly for "floating" elements only. Use extra-diffused shadows (Blur: 30px+) with low-opacity (4%-8%). The shadow color must be a tinted version of the background (`#060e20`) to mimic natural, ambient light.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use a **Ghost Border**: the `outline_variant` token at 15% opacity. Never use 100% opaque borders.
- **Glassmorphism:** Use semi-transparent surface colors to allow background tones to bleed through. This makes the layout feel integrated and "liquid" rather than static.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (Electric Indigo), high-contrast text (`on_primary_fixed` #0c006a). Roundedness: `full`.
- **Secondary:** Transparent fill with a "Ghost Border" and `primary` text.
- **Tertiary:** Text-only with an underline or icon for subtle secondary actions.

### Cards
Cards are the core of the financial experience.
- **Style:** Use `surface_container_high` with a `lg` (1rem) corner radius.
- **Dividers:** **Forbidden.** Use vertical spacing of `1rem` or a `surface_variant` background shift to separate "Header" from "List Items" within a card.

### Input Fields
- **State:** When active, the field should utilize a subtle glow using the `primary` color at 10% opacity as a background fill, with a 1px `primary` border to signal focus.
- **Labeling:** Floating labels that transition to `label-md` when the field is active.

### Chips (Budget/Tagging)
- Use `tertiary_container` for budget chips to distinguish them from primary actions. Use the `md` (0.75rem) roundedness scale.

---

## 6. Do's and Don'ts

### Do
- **Do** use whitespace as a functional tool. If in doubt, add more padding.
- **Do** use "Electric Indigo" sparingly to highlight critical paths (e.g., "Transfer Funds").
- **Do** utilize the `surface_container` tiers to create a logical flow of information.
- **Do** ensure all text on dark surfaces meets WCAG AA contrast standards (using `#dae2fd` for body text).

### Don't
- **Don't** use 1px solid white or light grey lines to separate content. It breaks the "Luminous" immersion.
- **Don't** use "pure black" (#000000). Use the `surface` token (#0b1326) to allow for depth and color bleeding.
- **Don't** apply heavy shadows to every card. Let the tonal shifts do the heavy lifting.
- **Don't** use "Electric Indigo" for error states; only use the `error` (#ffb4ab) palette.