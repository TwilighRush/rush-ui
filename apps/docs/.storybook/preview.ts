import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }]
      }
    },
    layout: "fullscreen",
    options: {
      storySort: {
        order: [
          "指南",
          "组件",
          ["概览", "基础", ["Button", "IconButton"], "表单", ["Field", "Input", "Textarea", "Checkbox", "Radio", "Select", "Switch"], "导航", ["Tabs", "DropdownMenu"], "反馈", ["Dialog", "Popover"], "数据展示", ["Badge"]]
        ]
      }
    }
  }
};

export default preview;
