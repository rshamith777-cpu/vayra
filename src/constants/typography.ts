import { Colors } from "./colors";

/**
 * Inter is used for all UI text. IBM Plex Mono is reserved for live
 * countdowns, timestamps, and coordinates so digits don't jitter on
 * update (see design system panel 03 in the approved prototype).
 *
 * Fonts are loaded via expo-font in app/_layout.tsx. Until fonts are
 * loaded, the system default is used automatically (no layout shift
 * because sizes/weights are still applied).
 */
export const Fonts = {
  sans: "Inter_500Medium",
  sansSemiBold: "Inter_600SemiBold",
  sansBold: "Inter_700Bold",
  sansExtraBold: "Inter_800ExtraBold",
  mono: "IBMPlexMono_600SemiBold",
};

export const Type = {
  display: { fontSize: 26, fontWeight: "800" as const, letterSpacing: -0.3, color: Colors.charcoal },
  h1: { fontSize: 22, fontWeight: "800" as const, letterSpacing: -0.2, color: Colors.charcoal },
  h2: { fontSize: 17, fontWeight: "700" as const, letterSpacing: -0.1, color: Colors.charcoal },
  h3: { fontSize: 16, fontWeight: "700" as const, letterSpacing: -0.1, color: Colors.charcoal },
  body: { fontSize: 14, fontWeight: "500" as const, color: Colors.charcoal },
  bodySmall: { fontSize: 13, fontWeight: "500" as const, color: Colors.ink70 },
  caption: { fontSize: 11.5, fontWeight: "600" as const, color: Colors.ink50 },
  eyebrow: { fontSize: 11, fontWeight: "700" as const, letterSpacing: 0.6, color: Colors.ink50 },
  mono: { fontSize: 18, fontWeight: "600" as const, color: Colors.charcoal },
};
