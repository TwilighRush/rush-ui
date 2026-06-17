import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    options: {
      storySort: {
        order: [
          "指南",
          "组件",
          ["概览", "基础", ["Button", "IconButton"], "表单", ["Field", "Input", "Textarea", "Checkbox", "Radio", "Select"], "反馈", "数据展示", ["Badge"]]
        ]
      }
    }
  }
};

export default preview;
