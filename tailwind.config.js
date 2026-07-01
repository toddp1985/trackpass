/** Static build of the config previously inlined on every page (cdn.tailwindcss.com). */
module.exports = {
  content: ["./*.html", "./blog/**/*.html", "./courses/**/*.html", "./assets/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "inverse-on-surface": "#d4fae2", "on-primary-container": "#80ad90", "on-primary-fixed": "#002111",
        "surface-container-lowest": "#ffffff", "on-tertiary-container": "#5fb482", "tertiary-fixed": "#9ef5be",
        "secondary-fixed": "#ffdea8", "surface-off-white": "#FAF9F4", "sky-blue": "#C2E1F2",
        "on-secondary": "#ffffff", "on-error": "#ffffff", "on-tertiary-fixed": "#002110",
        "error-container": "#ffdad6", "on-surface-variant": "#414943", "error": "#ba1a1a",
        "surface-container-high": "#cbf1da", "secondary-container": "#fdc65e", "on-background": "#002113",
        "primary-fixed-dim": "#a3d1b3", "surface-container": "#d1f7e0", "on-secondary-container": "#745200",
        "on-primary": "#ffffff", "tertiary-fixed-dim": "#82d8a3", "on-tertiary": "#ffffff",
        "deep-forest": "#103223", "primary": "#002a17", "surface-container-low": "#d6fde5",
        "on-tertiary-fixed-variant": "#00522f", "surface": "#e8ffef", "on-error-container": "#93000a",
        "secondary": "#7c5800", "primary-fixed": "#bfedce", "inverse-primary": "#a3d1b3",
        "tertiary-container": "#004326", "on-surface": "#002113", "surface-dim": "#bde3cc",
        "surface-variant": "#c6ebd5", "on-secondary-fixed-variant": "#5e4200", "on-secondary-fixed": "#271900",
        "inverse-surface": "#153627", "primary-container": "#16412b", "surface-bright": "#e8ffef",
        "tertiary": "#002b16", "outline-variant": "#c1c8c1"
      },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
      spacing: { gutter: "24px", unit: "8px", "margin-desktop": "40px", "margin-mobile": "20px", "container-max": "1200px" },
      fontFamily: {
        "body-md": ["Manrope"], "headline-lg-mobile": ["Sora"], "headline-md": ["Sora"], "display-lg": ["Sora"],
        "body-lg": ["Manrope"], "display-lg-mobile": ["Sora"], "label-sm": ["Manrope"], "label-lg": ["Manrope"], "headline-lg": ["Sora"],
        "body": ["Manrope", "sans-serif"], "display": ["Sora", "sans-serif"]
      },
      fontSize: {
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "display-lg-mobile": ["36px", { lineHeight: "42px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }]
      }
    }
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")]
};
