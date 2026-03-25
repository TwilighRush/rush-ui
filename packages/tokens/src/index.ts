export const tokens = {
  color: {
    surface: "#fffaf1",
    canvas: "#f6efe3",
    ink: "#1d1a16",
    accent: "#c56a1b",
    accentMuted: "#f2d3b3",
    border: "#d6c6b2"
  },
  radius: {
    sm: "6px",
    md: "12px",
    lg: "20px"
  },
  space: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px"
  },
  shadow: {
    card: "0 10px 30px rgba(29, 26, 22, 0.08)"
  }
} as const;

export type Tokens = typeof tokens;
