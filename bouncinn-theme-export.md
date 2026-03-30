# Bouncinn Styling and Theme Export

This document contains all the styling information, colors, fonts, and theme definitions used in the Bouncinn CRM project. This file is designed to be fed into an AI agent to replicate the exact design system and aesthetics for any new Bouncinn website or project.

## 1. Core Frameworks
- **CSS Framework**: Tailwind CSS (v4 based on the `@theme inline` directive).
- **Design System**: Premium Zinc Scale mapping with custom Bouncinn brand colors.
- **Dark Mode**: Configured using standard `.dark` class targeting.

## 2. Fonts
The application uses two primary fonts (usually initialized via `next/font`):
- **Sans Serif Base Font**: `var(--font-geist-sans)` (Geist Sans)
- **Monospace Font**: `var(--font-geist-mono)` (Geist Mono)

## 3. Brand & Status Colors

These are the primary distinctive colors for Bouncinn. You MUST use these exact hex codes for CTA buttons, branding elements, and semantic statuses.

### Brand Colors
- **Brand Yellow (Primary Base)**: `#F2FD0A`
- **Brand Yellow Hover**: `#D9E409`
- **Brand Yellow Dark**: `#C4C400`
- **Brand Green**: `#1E514E`

### Status / Indicator Colors
- **Success**: `#22C55E`
- **Danger/Destructive**: `#EF4444` (`#7F1D1D` in dark mode)
- **Warning**: `#F59E0B`
- **Live Red**: `#FF4848`
- **Verified Blue**: `#007BFF`
- **Online Green**: `#00FF00`

## 4. Light and Dark Theme Palette (Premium Zinc Scale)

The application implements a custom Zinc-based neutral palette for Light and Dark modes.

### Light Theme
- **Background**: `#FAFAFA` (Zinc 50)
- **Foreground (Text)**: `#09090B` (Zinc 950)
- **Card Background**: `#FFFFFF`
- **Card Foreground**: `#09090B`
- **Popover Base**: `#FFFFFF`
- **Popover Text**: `#09090B`
- **Primary (Buttons/Action)**: `#18181B` (Zinc 900)
- **Primary Text**: `#FAFAFA`
- **Secondary Base**: `#F4F4F5` (Zinc 100)
- **Secondary Text**: `#18181B`
- **Muted Base**: `#F4F4F5`
- **Muted Text**: `#71717A` (Zinc 500)
- **Accent Base**: `#F4F4F5`
- **Accent Text**: `#18181B`
- **Border**: `#E4E4E7` (Zinc 200)
- **Input Border**: `#E4E4E7`
- **Focus Ring**: `#18181B`

### Dark Theme
- **Background**: `#09090B` (Zinc 950)
- **Foreground (Text)**: `#FAFAFA` (Zinc 50)
- **Card Background**: `#18181B` (Zinc 900)
- **Card Foreground**: `#FAFAFA`
- **Popover Base**: `#18181B`
- **Popover Text**: `#FAFAFA`
- **Primary (Buttons/Action)**: `#FAFAFA`
- **Primary Text**: `#18181B`
- **Secondary Base**: `#27272A` (Zinc 800)
- **Secondary Text**: `#FAFAFA`
- **Muted Base**: `#27272A`
- **Muted Text**: `#A1A1AA` (Zinc 400)
- **Accent Base**: `#27272A`
- **Accent Text**: `#FAFAFA`
- **Border**: `#27272A`
- **Input Border**: `#27272A`
- **Focus Ring**: `#D4D4D8`

## 5. Standard Border Radius
The base radius size (`--radius`) is `0.5rem` (`8px`). Based on this, the extended tailwind utility values are:
- `radius-sm`: `4px`
- `radius-md`: `6px`
- `radius-lg`: `8px` (base)
- `radius-xl`: `12px`
- `radius-2xl`: `16px`
- `radius-3xl`: `20px`
- `radius-4xl`: `24px`

## 6. Authentication & Specialized View Variables
The Auth flow uses specific aliases to guarantee consistent branding across login pages:

### Light Mode Auth Form
- **Auth Card Background**: `#FFFFFF`
- **Auth Text / Title**: `#09090B`
- **Auth Subtitles / Labels**: `#71717A`
- **Auth Link Default**: `#71717A`
- **Auth Link Hover**: `#09090B`
- **Auth Decorative Opacity** (Drip / Circles): `0.05`

### Dark Mode Auth Form
- **Auth Card Background**: `#18181B`
- **Auth Text / Title**: `#FAFAFA`
- **Auth Subtitles / Labels**: `#A1A1AA`
- **Auth Link Default**: `#A1A1AA`
- **Auth Link Hover**: `#FAFAFA`
- **Auth Decorative Opacity** (Drip / Circles): `0.1`

## 7. Global Setup Instructions & Component Usage
- Use `@layer base` to configure base document semantics, explicitly targeting `body { @apply bg-background text-foreground; }`.
- Ensure everything unifies properly under focus handling using `@apply border-border outline-ring/50;`.
- Use the distinctive Yellow (`#F2FD0A`) actively as primary CTAs (Call to Actions) and highlight colors.
- Incorporate smooth animations/transitions for hover effect toggling on brand colors (ex: `hover:bg-brand-yellow-hover`).
- If you use Shadcn/UI or a similar library, paste the exact color palette listed above into your `globals.css` and use `.dark` wrapping for theming hooks.
