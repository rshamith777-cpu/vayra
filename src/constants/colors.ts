/**
 * Design tokens — ported 1:1 from the approved visual prototype
 * (atmospheric-ai-mobile-ux.html). Do not invent new colors here;
 * extend by adding new *semantic* aliases if a screen needs one.
 */
export const Colors = {
  offWhite: "#F6F5F1",
  paper: "#FBFAF8",
  white: "#FFFFFF",
  charcoal: "#14171A",
  ink70: "#40454B",
  ink50: "#6B7076",
  ink30: "#9BA0A6",
  line: "#E3E1DA",

  navy900: "#0B1626",
  navy800: "#101F35",
  navy700: "#16283F",
  navy600: "#1E3A5C",

  blue: "#3A6FE0",
  blueTint: "#EAF0FD",

  orange: "#E38A1C",
  orangeTint: "#FCEFDC",
  orangeDeep: "#9A5B0E",

  moderate: "#E3B23C",
  moderateTint: "#FEF6DE",
  moderateDeep: "#8A6C0A",

  red: "#D9372E",
  redDeep: "#B7241D",
  redTint: "#FBE9E7",

  green: "#2E8B57",
  greenTint: "#E7F4EC",
  greenDeep: "#1F6E43",
};

export const Radius = {
  lg: 26,
  md: 16,
  sm: 10,
  pill: 999,
};

export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};

/** Semantic risk-severity color mapping — color is always paired with a text label, never used alone. */
export const SeverityColors = {
  low: { bg: Colors.greenTint, fg: Colors.greenDeep, dot: Colors.green },
  moderate: { bg: Colors.moderateTint, fg: Colors.moderateDeep, dot: Colors.moderate },
  high: { bg: Colors.orangeTint, fg: Colors.orangeDeep, dot: Colors.orange },
  critical: { bg: Colors.redTint, fg: Colors.redDeep, dot: Colors.red },
} as const;

export const Shadow = {
  card: {
    shadowColor: "#0F141E",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  sheet: {
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    elevation: 8,
  },
};
