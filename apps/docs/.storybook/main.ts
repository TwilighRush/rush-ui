import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  viteFinal: async (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@rush_ui/react": new URL("../../../packages/react/src/index.ts", import.meta.url).pathname,
      "@rush_ui/tokens": new URL("../../../packages/tokens/src/index.ts", import.meta.url).pathname
    };

    return config;
  }
};

export default config;
