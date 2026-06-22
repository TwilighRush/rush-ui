import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";

const [fixtureDirectory, expectedVersion] = process.argv.slice(2);
assert.ok(fixtureDirectory, "缺少兼容性测试目录。");
assert.ok(expectedVersion, "缺少预期 React 版本。");

const fixturePackage = pathToFileURL(path.join(fixtureDirectory, "package.json"));
const fixtureRequire = createRequire(fixturePackage);
const React = fixtureRequire("react");
const { renderToString } = fixtureRequire("react-dom/server");
const { Button, Switch, Tabs } = fixtureRequire("@rush_ui/react");

assert.equal(React.version, expectedVersion);

const html = renderToString(
  React.createElement(
    "main",
    null,
    React.createElement(Button, null, "保存"),
    React.createElement(Switch, { "aria-label": "启用通知", defaultChecked: true }),
    React.createElement(
      Tabs.Root,
      { defaultValue: "members" },
      React.createElement(
        Tabs.List,
        { "aria-label": "设置" },
        React.createElement(Tabs.Trigger, { value: "members" }, "成员")
      ),
      React.createElement(Tabs.Content, { value: "members" }, "成员内容")
    )
  )
);

assert.match(html, /保存/);
assert.match(html, /role="switch"/);
assert.match(html, /role="tabpanel"/);
console.log(`React ${React.version} 打包产物兼容性验证通过。`);
