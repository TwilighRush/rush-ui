# @rush_ui/react

Rush UI 的 React 组件包，面向后台与管理端应用。

## 安装

```bash
pnpm add @rush_ui/react react react-dom
```

## 使用

在应用入口加载样式，然后按需导入组件：

```tsx
import "@rush_ui/react/styles.css";
import { Button } from "@rush_ui/react";

export function App() {
  return <Button>保存</Button>;
}
```

组件 API、可访问性说明和示例参见 [Rush UI 仓库](https://github.com/TwilighRush/rush-ui)。
