import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("../packages/react/", import.meta.url));
const esmEntry = new URL("../packages/react/dist/index.js", import.meta.url);
const cjsEntry = fileURLToPath(new URL("../packages/react/dist/index.cjs", import.meta.url));
const cssEntry = fileURLToPath(new URL("../packages/react/dist/react.css", import.meta.url));
const typesEntry = fileURLToPath(new URL("../packages/react/dist/index.d.ts", import.meta.url));

await Promise.all([access(fileURLToPath(esmEntry)), access(cjsEntry), access(cssEntry), access(typesEntry)]);

const esm = await import(esmEntry.href);
const cjs = createRequire(import.meta.url)(cjsEntry);

for (const exportName of [
  "Badge",
  "Button",
  "Checkbox",
  "Dialog",
  "DropdownMenu",
  "Field",
  "IconButton",
  "Input",
  "Popover",
  "Radio",
  "Select",
  "Switch",
  "Tabs",
  "Textarea"
]) {
  assert.equal(typeof esm[exportName], "object", `ESM 缺少 ${exportName} 导出`);
  assert.equal(typeof cjs[exportName], "object", `CJS 缺少 ${exportName} 导出`);
}

assert.ok(packageRoot.endsWith("packages/react/"));
console.log("React 包 ESM、CJS、类型入口和样式产物验证通过。");
