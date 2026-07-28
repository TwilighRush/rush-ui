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

## 当前公开导出

组件：

- `Alert`
- `Badge`
- `Button`
- `Checkbox`
- `CheckboxGroup`
- `Dialog`
- `DropdownMenu`
- `Empty`
- `Field`
- `IconButton`
- `Input`
- `Pagination`
- `Popover`
- `Radio`
- `RadioGroup`
- `Select`
- `Skeleton`
- `Spinner`
- `Switch`
- `Table`
- `Tabs`
- `Textarea`
- `Tooltip`

类型：

- `AlertProps`
- `AlertVariant`
- `BadgeProps`
- `BadgeSize`
- `BadgeVariant`
- `ButtonProps`
- `ButtonSize`
- `ButtonVariant`
- `CheckboxGroupOrientation`
- `CheckboxGroupProps`
- `CheckboxProps`
- `CheckboxSize`
- `DialogCloseProps`
- `DialogContentProps`
- `DialogDescriptionProps`
- `DialogRootProps`
- `DialogTitleProps`
- `DialogTriggerProps`
- `DropdownMenuContentProps`
- `DropdownMenuItemProps`
- `DropdownMenuLabelProps`
- `DropdownMenuRootProps`
- `DropdownMenuSeparatorProps`
- `DropdownMenuTriggerProps`
- `EmptyProps`
- `EmptySize`
- `FieldControlProps`
- `FieldProps`
- `IconButtonProps`
- `IconButtonSize`
- `IconButtonVariant`
- `InputProps`
- `InputSize`
- `PaginationProps`
- `PaginationSize`
- `PaginationTotalInfo`
- `PopoverContentProps`
- `PopoverRootProps`
- `PopoverTriggerProps`
- `RadioGroupOrientation`
- `RadioGroupProps`
- `RadioProps`
- `RadioSize`
- `SelectOption`
- `SelectProps`
- `SelectSize`
- `SkeletonProps`
- `SkeletonVariant`
- `SpinnerProps`
- `SpinnerSize`
- `SwitchProps`
- `SwitchSize`
- `TableColumn`
- `TableColumnAlign`
- `TableProps`
- `TableRowKey`
- `TableRowSelection`
- `TableSize`
- `TableSortDirection`
- `TableSortState`
- `TabsActivationMode`
- `TabsContentProps`
- `TabsListProps`
- `TabsOrientation`
- `TabsRootProps`
- `TabsTriggerProps`
- `TextareaAutoSizeOptions`
- `TextareaProps`
- `TextareaSize`
- `TooltipContentProps`
- `TooltipRootProps`
- `TooltipTriggerProps`

组件 API、可访问性说明和示例参见 [Rush UI 仓库](https://github.com/TwilighRush/rush-ui)。
