import { Badge, Button, Checkbox, CheckboxGroup, Field, IconButton, Input, Radio, RadioGroup, Select, Textarea } from "@rush_ui/react";
import { tokens } from "@rush_ui/tokens";

const packageRoles = [
  {
    name: "@rush_ui/react",
    description: "对外发布的 React 组件入口，承载组件、类型和组合约定。"
  },
  {
    name: "@rush_ui/tokens",
    description: "可序列化的设计 token，覆盖颜色、间距、圆角和阴影。"
  },
  {
    name: "@rush_ui/utils",
    description: "跨包共享的通用工具函数，不绑定具体框架。"
  }
] as const;

const colorSwatches = [
  { name: "surface", value: tokens.color.surface },
  { name: "canvas", value: tokens.color.canvas },
  { name: "ink", value: tokens.color.ink },
  { name: "accent", value: tokens.color.accent },
  { name: "accentMuted", value: tokens.color.accentMuted },
  { name: "border", value: tokens.color.border }
] as const;

const selectStatusOptions = [
  { label: "待处理", textValue: "pending", value: "pending" },
  { label: "处理中", textValue: "processing", value: "processing" },
  { label: "已完成", textValue: "done", value: "done" }
] as const;

export function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Rush UI</p>
        <h1>面向后台系统的 React 组件库基础工程</h1>
        <p className="lede">
          这个工作区已经接入组件包构建、Storybook 预览、自动化测试和 Changesets 版本管理。
        </p>
      </section>

      <section className="grid">
        {packageRoles.map((item) => (
          <article className="info-card" key={item.name}>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="token-card">
        <h2>基础设计 token</h2>
        <div className="swatches">
          {colorSwatches.map(({ name, value }) => (
            <div className="swatch" key={name}>
              <span className="chip" style={{ backgroundColor: value }} />
              <div>
                <strong>{name}</strong>
                <p>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="token-card">
        <h2>Badge 文档示例</h2>
        <p className="lede">Badge 用于表格、筛选器和流程记录中的轻量状态标识，支持六种状态语义和三档尺寸。</p>
        <div className="button-demo-row">
          <Badge>默认</Badge>
          <Badge variant="success">成功</Badge>
          <Badge variant="warning">警告</Badge>
          <Badge variant="error">错误</Badge>
          <Badge variant="info">信息</Badge>
          <Badge variant="processing">处理中</Badge>
        </div>
      </section>

      <section className="token-card">
        <h2>Button 文档示例</h2>
        <p className="lede">
          Button 已接入 RFC 约定，支持 variant、size、disabled、loading，以及前后图标插槽。
        </p>
        <div className="button-demo-row">
          <Button>默认按钮</Button>
          <Button variant="outline">次要操作</Button>
          <Button startIcon={<span>+</span>} variant="subtle">
            新建项目
          </Button>
          <Button endIcon={<span>→</span>} loading loadingText="保存中">
            保存变更
          </Button>
          <Button disabled variant="ghost">
            不可用
          </Button>
        </div>
      </section>

      <section className="token-card">
        <h2>IconButton 文档示例</h2>
        <p className="lede">纯图标操作需要通过 aria-label 或 aria-labelledby 提供稳定的可访问名称。</p>
        <div className="button-demo-row">
          <IconButton aria-label="新建记录" icon={<span>+</span>} variant="solid" />
          <IconButton aria-label="刷新列表" icon={<span>↻</span>} variant="outline" />
          <IconButton aria-label="更多操作" icon={<span>⋯</span>} />
          <IconButton aria-label="关闭面板" icon={<span>×</span>} loading variant="subtle" />
        </div>
      </section>

      <section className="token-card">
        <h2>Input 文档示例</h2>
        <p className="lede">单行输入框支持受控/非受控、禁用、只读、错误态、清空按钮、字数统计、图标和前后缀。</p>
        <div className="input-demo-grid">
          <Input allowClear aria-label="项目名称" defaultValue="客户运营后台" maxLength={20} showCount />
          <Input aria-label="金额" endAddon="CNY" placeholder="0.00" startAddon="¥" />
          <Input allowClear aria-label="邮箱" errorText="请输入有效邮箱" invalid placeholder="name@example.com" suffix="@" />
        </div>
      </section>

      <section className="token-card">
        <h2>Checkbox 文档示例</h2>
        <p className="lede">复选框支持原生表单语义、受控/非受控、半选、复选组、说明文本和错误态，适合权限、筛选和批量选择。</p>
        <div className="input-demo-grid">
          <Checkbox defaultChecked description="开启后成员可以查看当前工作区内所有客户资料。">
            授予客户资料访问权限
          </Checkbox>
          <Checkbox indeterminate>本页部分记录已选</Checkbox>
          <Field helpText="用于控制成员在客户资料中的操作范围。" label="权限范围" required>
            <CheckboxGroup defaultValue={["read"]} name="permission">
              <Checkbox value="read">查看</Checkbox>
              <Checkbox value="export">导出</Checkbox>
              <Checkbox value="archive">归档</Checkbox>
            </CheckboxGroup>
          </Field>
          <Field errorText="请至少选择一个通知渠道" label="通知渠道" required>
            <CheckboxGroup name="channels">
              <Checkbox value="email">邮件通知</Checkbox>
              <Checkbox value="sms">短信通知</Checkbox>
            </CheckboxGroup>
          </Field>
        </div>
      </section>

      <section className="token-card">
        <h2>Radio 文档示例</h2>
        <p className="lede">单选组使用原生 radio 表单语义，并补齐组内方向键移动、错误态和 Field 组合。</p>
        <div className="input-demo-grid">
          <Field helpText="方向键会在可用选项之间移动焦点并更新选择。" label="默认通知方式" required>
            <RadioGroup defaultValue="email" name="defaultNotice">
              <Radio description="适合审批、账单和权限变更等高优先级事件。" value="email">
                邮件通知
              </Radio>
              <Radio value="sms">短信通知</Radio>
              <Radio disabled value="webhook">
                Webhook 暂不可用
              </Radio>
            </RadioGroup>
          </Field>
          <RadioGroup aria-label="审批模式" defaultValue="manual" orientation="horizontal">
            <Radio value="manual">人工审批</Radio>
            <Radio value="auto">自动通过低风险项</Radio>
          </RadioGroup>
          <RadioGroup aria-label="导出范围" errorText="请选择导出范围" invalid>
            <Radio value="current">当前页</Radio>
            <Radio value="all">全部结果</Radio>
          </RadioGroup>
        </div>
      </section>

      <section className="token-card">
        <h2>Select 文档示例</h2>
        <p className="lede">选择器采用 combobox/listbox 模式，支持单选受控、键盘导航、typeahead、空态、错误态和 Field 组合。</p>
        <div className="input-demo-grid">
          <Field helpText="支持方向键、Enter、Escape、Home、End 和首字母定位。" label="项目状态" required>
            <Select name="status" options={selectStatusOptions} placeholder="请选择状态" />
          </Field>
          <Select
            aria-label="客户范围"
            defaultValue="owner"
            options={[
              { description: "只显示当前登录成员负责的记录。", label: "我的客户", textValue: "owner", value: "owner" },
              { description: "显示所在团队有权限访问的记录。", label: "团队客户", textValue: "team", value: "team" },
              { description: "需要管理员权限。", disabled: true, label: "全部客户", textValue: "all", value: "all" }
            ]}
          />
          <Select aria-label="导出状态" emptyText="暂无状态" options={[]} placeholder="请选择状态" />
        </div>
      </section>

      <section className="token-card">
        <h2>Textarea 文档示例</h2>
        <p className="lede">多行文本域与 Input 保持同族表单输入样式，支持错误态、字数统计、受控/非受控、自适应高度和后置内容。</p>
        <div className="input-demo-grid">
          <Textarea
            aria-label="处理说明"
            autoSize={{ minRows: 2, maxRows: 5 }}
            defaultValue={"已完成客户资料核对。\n待销售同事补充跟进记录。"}
            maxLength={160}
            showCount
          />
          <Textarea aria-label="快捷备注" placeholder="输入后按快捷键提交" suffix="⌘ Enter" />
          <Textarea aria-label="审批意见" errorText="请输入审批意见" invalid placeholder="请输入审批意见" />
        </div>
      </section>

      <section className="token-card">
        <h2>Field 文档示例</h2>
        <p className="lede">表单项负责标签、说明文本、必填标记和错误态传递，让 Input、Textarea、CheckboxGroup、RadioGroup 与 Select 形成稳定组合。</p>
        <div className="input-demo-grid">
          <Field helpText="用于侧边栏、面包屑和操作日志展示。" label="项目名称" required>
            <Input allowClear defaultValue="客户运营后台" maxLength={20} showCount />
          </Field>
          <Field label="项目域名" optionalText="选填">
            <Input endAddon=".rushui.cn" placeholder="workspace" />
          </Field>
          <Field errorText="请补充处理动作和下一步跟进计划" label="审批意见" required>
            <Textarea maxLength={120} placeholder="请输入审批意见" showCount />
          </Field>
        </div>
      </section>
    </main>
  );
}
