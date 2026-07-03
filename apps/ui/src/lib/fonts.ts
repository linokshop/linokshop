import { Bitter, Golos_Text, Oswald, Roboto } from "next/font/google"

export const fontRoboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
  variable: "--font-roboto",
})

// ЛінОк brand fonts. Cyrillic subset is required for the uk/ru UI copy.
// Each exposes a CSS variable consumed by the design-system font tokens
// (--font-golos / --font-oswald / --font-bitter in theme.css).

// Body / UI text.
export const fontGolos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--ff-golos",
})

// Labels, navigation, uppercase accents.
export const fontOswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--ff-oswald",
})

// Display headings (e.g. static pages).
export const fontBitter = Bitter({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
  variable: "--ff-bitter",
})
