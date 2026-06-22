export const tokens = {
  color: {
    surface: "#fffaf1",
    canvas: "#f6efe3",
    ink: "#1d1a16",
    inkHover: "#342f2a",
    accent: "#c56a1b",
    accentMuted: "#f2d3b3",
    accentMutedHover: "#ebc59b",
    accentText: "#5f3309",
    border: "#d6c6b2",
    borderStrong: "#8f7c67",
    borderHover: "#6f5f50",
    focusRing: "rgba(197, 106, 27, 0.28)",
    interaction: {
      hover: "rgba(29, 26, 22, 0.05)",
      selected: "rgba(29, 26, 22, 0.08)"
    },
    overlay: {
      backdrop: "rgba(29, 26, 22, 0.48)"
    },
    status: {
      default: {
        bg: "rgba(29, 26, 22, 0.06)",
        border: "rgba(29, 26, 22, 0.16)",
        text: "#3d352d",
        indicator: "#6f5f50"
      },
      success: {
        bg: "#e5f4eb",
        border: "#9fd1b2",
        text: "#1f6b3a",
        indicator: "#27824a"
      },
      warning: {
        bg: "#fff0cc",
        border: "#e0b45b",
        text: "#7a4a05",
        indicator: "#b7791f"
      },
      error: {
        bg: "#fce6e4",
        border: "#e8a29b",
        text: "#9f1f17",
        indicator: "#c02f24"
      },
      info: {
        bg: "#e5f1fb",
        border: "#99c4e7",
        text: "#1d5f8f",
        indicator: "#2679b8"
      },
      processing: {
        bg: "#ece9fb",
        border: "#bbb2ee",
        text: "#5c4a9a",
        indicator: "#6d5bd0"
      }
    }
  },
  radius: {
    sm: "6px",
    md: "12px",
    lg: "20px",
    pill: "999px"
  },
  space: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px"
  },
  shadow: {
    card: "0 10px 30px rgba(29, 26, 22, 0.08)",
    action: "0 4px 8px rgba(29, 26, 22, 0.12)",
    floating: "0 8px 12px rgba(29, 26, 22, 0.14)",
    modal: "0 8px 12px rgba(29, 26, 22, 0.18)",
    thumb: "0 1px 3px rgba(29, 26, 22, 0.28)"
  },
  zIndex: {
    dropdown: 200,
    popover: 300,
    modalBackdrop: 400,
    modal: 410
  }
} as const;

export type Tokens = typeof tokens;
