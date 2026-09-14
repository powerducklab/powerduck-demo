import { registerDemo } from "./demoRegistry";
import { MdEditorDemo } from "../demos/md-editor/MdEditorDemo";
import { ConfPatchDemo } from "../demos/conf-patch/ConfPatchDemo";
import { OpenApiCodegenDemo } from "../demos/openapi-codegen/OpenApiCodegenDemo";
import { XToOpenApiDemo } from "../demos/x-to-openapi/XToOpenApiDemo";

/**
 * Central registration of all library demos.
 * To add a new demo: import the component and call registerDemo() below.
 */
registerDemo({
  id: "md-editor",
  name: "MD Editor",
  packageName: "@powerduck/md-editor",
  description: "High-performance embeddable Markdown editor",
  longDescription:
    "A high-performance embeddable Markdown editor with KaTeX math, Markmap mindmaps, highlight.js code blocks, admonition blocks, rich toolbar, image upload hooks, and both simple and complex modes with light/dark themes.",
  version: "0.11.2",
  docsUrl: "https://www.npmjs.com/package/@powerduck/md-editor",
  tags: ["markdown", "editor", "wysiwyg", "katex"],
  component: MdEditorDemo,
});

registerDemo({
  id: "conf-patch",
  name: "Conf Patch",
  packageName: "@powerduck/conf-patch",
  description: "Two-layer JSON/YAML config patching editor",
  longDescription:
    "A two-layer configuration editor: pure core for patching JSON, JSONC, and YAML strings in the browser, plus a file layer with atomic writes and locking for Node.js/Electron. Implements RFC 6902 JSON Patch with comment and formatting preservation.",
  version: "0.3.4",
  docsUrl: "https://www.npmjs.com/package/@powerduck/conf-patch",
  tags: ["config", "json-patch", "yaml", "rfc6902"],
  component: ConfPatchDemo,
});

registerDemo({
  id: "openapi-codegen",
  name: "OpenAPI Codegen",
  packageName: "@powerduck/openapi-codegen",
  description: "Generate HTTP request code from OpenAPI docs",
  longDescription:
    "Generate runnable HTTP request examples from OpenAPI documents. Supports 21 languages and 41 client combinations. Browser-compatible with zero runtime dependencies. Includes a built-in reference resolver and example generator.",
  version: "0.5.3",
  docsUrl: "https://www.npmjs.com/package/@powerduck/openapi-codegen",
  tags: ["openapi", "codegen", "http", "api"],
  component: OpenApiCodegenDemo,
});

registerDemo({
  id: "x-to-openapi",
  name: "X to OpenAPI",
  packageName: "@powerduck/x-to-openapi",
  description: "Convert cURL and Postman to OpenAPI 3.2",
  longDescription:
    "An extensible production-grade X-to-OpenAPI 3.2 conversion framework. Convert cURL commands and Postman collections to OpenAPI 3.2 documents with automatic path parameter inference, security detection, and schema validation.",
  version: "0.2.2",
  docsUrl: "https://www.npmjs.com/package/@powerduck/x-to-openapi",
  tags: ["openapi", "curl", "postman", "converter"],
  component: XToOpenApiDemo,
});
