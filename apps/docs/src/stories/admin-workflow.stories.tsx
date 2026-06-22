import { useMemo, useState } from "react";

import { Badge, Button, Dialog, DropdownMenu, Field, Input, Select, Switch, Tabs } from "@rush_ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import "./admin-workflow.less";

type WorkflowState = "ready" | "loading" | "empty" | "error";

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "disabled";
  enabled: boolean;
}

const initialMembers: Member[] = [
  { id: 1, name: "林一", email: "linyi@example.com", role: "管理员", status: "active", enabled: true },
  { id: 2, name: "周恬", email: "zhoutian@example.com", role: "编辑者", status: "invited", enabled: true },
  { id: 3, name: "陈屿", email: "chenyu@example.com", role: "只读成员", status: "disabled", enabled: false }
];

const statusMeta = {
  active: { label: "正常", variant: "success" },
  invited: { label: "待加入", variant: "warning" },
  disabled: { label: "已停用", variant: "default" }
} as const;

function MemberManagement({ state = "ready" }: { state?: WorkflowState }) {
  const [members, setMembers] = useState(initialMembers);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<Member | null>(null);

  const visibleMembers = useMemo(() => {
    if (state === "empty") return [];
    return members.filter((member) => {
      const matchesQuery = `${member.name}${member.email}`.toLocaleLowerCase().includes(query.toLocaleLowerCase());
      const matchesStatus = status === "all" || member.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [members, query, state, status]);

  return (
    <main className="member-workflow">
      <header className="member-workflow__header">
        <div>
          <h1>成员管理</h1>
          <p>维护工作区成员、角色和登录状态。</p>
        </div>
        <Button onClick={() => setEditing({ id: 0, name: "", email: "", role: "编辑者", status: "invited", enabled: true })}>邀请成员</Button>
      </header>

      <Tabs.Root defaultValue="members">
        <Tabs.List aria-label="工作区访问管理">
          <Tabs.Trigger value="members">成员</Tabs.Trigger>
          <Tabs.Trigger value="roles">角色与权限</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="members">
          <section aria-label="成员筛选与列表" className="member-workflow__surface">
            <div className="member-workflow__toolbar">
              <Input allowClear aria-label="搜索成员" onValueChange={setQuery} placeholder="搜索姓名或邮箱" value={query} />
              <Select
                aria-label="成员状态"
                onValueChange={setStatus}
                options={[
                  { label: "全部状态", value: "all" },
                  { label: "正常", value: "active" },
                  { label: "待加入", value: "invited" },
                  { label: "已停用", value: "disabled" }
                ]}
                value={status}
              />
            </div>

            {state === "error" ? (
              <div className="member-workflow__message" role="alert">
                <strong>成员数据加载失败</strong>
                <p>网络连接暂时不可用，请稍后重试。</p>
                <Button variant="outline">重新加载</Button>
              </div>
            ) : state === "loading" ? (
              <div aria-label="正在加载成员" aria-live="polite" className="member-workflow__loading">
                {[0, 1, 2].map((item) => <span className="member-workflow__skeleton" key={item} />)}
              </div>
            ) : visibleMembers.length === 0 ? (
              <div className="member-workflow__message">
                <strong>{query || status !== "all" ? "没有匹配的成员" : "还没有工作区成员"}</strong>
                <p>{query || status !== "all" ? "调整关键词或状态筛选后重试。" : "邀请第一位成员开始协作。"}</p>
                <Button onClick={() => { setQuery(""); setStatus("all"); }} variant="outline">清除筛选</Button>
              </div>
            ) : (
              <div className="member-workflow__table-wrap">
                <table>
                  <thead>
                    <tr><th scope="col">成员</th><th scope="col">角色</th><th scope="col">状态</th><th scope="col">允许登录</th><th scope="col"><span className="member-workflow__sr-only">操作</span></th></tr>
                  </thead>
                  <tbody>
                    {visibleMembers.map((member) => {
                      const meta = statusMeta[member.status];
                      return (
                        <tr key={member.id}>
                          <td><strong>{member.name}</strong><span>{member.email}</span></td>
                          <td>{member.role}</td>
                          <td><Badge variant={meta.variant}>{meta.label}</Badge></td>
                          <td>
                            <Switch
                              aria-label={`${member.name}允许登录`}
                              checked={member.enabled}
                              onCheckedChange={(enabled) => setMembers((current) => current.map((item) => item.id === member.id ? { ...item, enabled } : item))}
                              size="sm"
                            />
                          </td>
                          <td>
                            <DropdownMenu.Root>
                              <DropdownMenu.Trigger aria-label={`${member.name}更多操作`}>操作</DropdownMenu.Trigger>
                              <DropdownMenu.Content aria-label={`${member.name}成员操作`}>
                                <DropdownMenu.Item onSelect={() => setEditing(member)}>编辑成员</DropdownMenu.Item>
                                <DropdownMenu.Item>重发邀请</DropdownMenu.Item>
                                <DropdownMenu.Separator />
                                <DropdownMenu.Item>移除成员</DropdownMenu.Item>
                              </DropdownMenu.Content>
                            </DropdownMenu.Root>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </Tabs.Content>
        <Tabs.Content value="roles">
          <div className="member-workflow__message"><strong>角色与权限</strong><p>集中维护工作区角色和默认数据范围。</p></div>
        </Tabs.Content>
      </Tabs.Root>

      <Dialog.Root open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <Dialog.Content>
          <Dialog.Title>{editing?.id === 0 ? "邀请成员" : "编辑成员"}</Dialog.Title>
          <Dialog.Description>成员信息和权限变更会在保存后立即生效。</Dialog.Description>
          <div className="member-workflow__form">
            <Field label="成员姓名" required><Input defaultValue={editing?.name} /></Field>
            <Field label="邮箱" required><Input defaultValue={editing?.email} type="email" /></Field>
            <Field label="角色" required>
              <Select defaultValue={editing?.role === "管理员" ? "admin" : editing?.role === "只读成员" ? "viewer" : "editor"} options={[{ label: "管理员", value: "admin" }, { label: "编辑者", value: "editor" }, { label: "只读成员", value: "viewer" }]} />
            </Field>
          </div>
          <div className="member-workflow__dialog-actions"><Dialog.Close>取消</Dialog.Close><Button onClick={() => setEditing(null)}>保存变更</Button></div>
        </Dialog.Content>
      </Dialog.Root>
    </main>
  );
}

const meta = {
  title: "指南/管理端集成场景",
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: "以成员管理流程验证筛选、状态、菜单、开关、对话框及 loading、empty、error 边界状态的组合行为。" } }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = { name: "完整流程", render: () => <MemberManagement /> };
export const Loading: Story = { name: "加载状态", render: () => <MemberManagement state="loading" /> };
export const Empty: Story = { name: "空状态", render: () => <MemberManagement state="empty" /> };
export const ErrorState: Story = { name: "错误状态", render: () => <MemberManagement state="error" /> };
