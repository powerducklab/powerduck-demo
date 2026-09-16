import { registerDemo } from "./demoRegistry";
import { MdEditorDemo } from "../demos/md-editor/MdEditorDemo";
import { ConfPatchDemo } from "../demos/conf-patch/ConfPatchDemo";
import { OpenApiCodegenDemo } from "../demos/openapi-codegen/OpenApiCodegenDemo";
import { XToOpenApiDemo } from "../demos/x-to-openapi/XToOpenApiDemo";
import { OpenApiParserDemo } from "../demos/openapi-parser/OpenApiParserDemo";
import { TreeDemo } from "../demos/tree/TreeDemo";
import { SchemaEditorDemo } from "../demos/schema-editor/SchemaEditorDemo";
import { OasDocumentDemo } from "../demos/oas-document/OasDocumentDemo";
import { WorkspaceYamlDemo } from "../demos/workspace-yaml/WorkspaceYamlDemo";

/**
 * Central registration of all library tools.
 * Each entry is a live, interactive online tool — not just a demo.
 */

// --- Converters ---
registerDemo({
  id: "x-to-openapi",
  name: "cURL to OpenAPI",
  packageName: "@powerduck/x-to-openapi",
  description: "Convert cURL commands and Postman collections to OpenAPI 3.2",
  longDescription:
    "Paste a cURL command or Postman collection and instantly convert it to a valid OpenAPI 3.2 document.",
  version: "0.2.5",
  docsUrl: "https://www.powerduck.com/docs/x-to-openapi/introduction",
  tags: ["openapi", "curl", "postman", "converter"],
  category: "Converters",
  component: XToOpenApiDemo,
});

registerDemo({
  id: "openapi-parser",
  name: "OpenAPI Upgrader",
  packageName: "@powerduck/openapi-parser",
  description: "Upgrade Swagger 2.0 / OpenAPI 3.x to validated OpenAPI 3.2",
  longDescription:
    "Paste any Swagger 2.0, OpenAPI 3.0, 3.1, or 3.2 document and upgrade it to a validated OpenAPI 3.2 document.",
  version: "0.3.6",
  docsUrl: "https://www.powerduck.com/docs/openapi-parser/introduction",
  tags: ["openapi", "swagger", "upgrade", "validate"],
  category: "Converters",
  component: OpenApiParserDemo,
});

// --- Codegen ---
registerDemo({
  id: "openapi-codegen",
  name: "Request Code Generator",
  packageName: "@powerduck/openapi-codegen",
  description: "Generate runnable HTTP request code from OpenAPI documents",
  longDescription:
    "Generate runnable HTTP request examples from OpenAPI documents. Supports 21 languages and 41 client combinations.",
  version: "0.6.3",
  docsUrl: "https://www.powerduck.com/docs/openapi-codegen/introduction",
  tags: ["openapi", "codegen", "http", "api"],
  category: "Codegen",
  component: OpenApiCodegenDemo,
});

// --- Editors ---
registerDemo({
  id: "md-editor",
  name: "Markdown Editor",
  packageName: "@powerduck/md-editor",
  description: "High-performance embeddable Markdown editor with KaTeX and diagrams",
  longDescription:
    "A high-performance embeddable Markdown editor with KaTeX math, Markmap mindmaps, highlight.js code blocks, and rich toolbar.",
  version: "0.11.7",
  docsUrl: "https://www.powerduck.com/docs/md-editor/introduction",
  tags: ["markdown", "editor", "wysiwyg", "katex"],
  category: "Editors",
  component: MdEditorDemo,
});

registerDemo({
  id: "schema-editor",
  name: "Schema Editor",
  packageName: "@powerduck/schema-editor",
  description: "Schema-aware Monaco editor for JSON, YAML, and JavaScript",
  longDescription:
    "A Monaco editor driven by any JSON Schema with ghost text, popup completion, enum dropdowns, example auto-fill, and diagnostics.",
  version: "0.2.3",
  docsUrl: "https://www.powerduck.com/docs/schema-editor/introduction",
  tags: ["monaco", "json-schema", "editor", "autocomplete"],
  category: "Editors",
  component: SchemaEditorDemo,
});

// --- Config ---
registerDemo({
  id: "conf-patch",
  name: "Config Patcher",
  packageName: "@powerduck/conf-patch",
  description: "RFC 6902 JSON Patch editor for JSON, JSONC, and YAML",
  longDescription:
    "Apply RFC 6902 JSON Patch operations to JSON, JSONC, or YAML strings with comment preservation.",
  version: "0.3.6",
  docsUrl: "https://www.powerduck.com/docs/conf-patch/introduction",
  tags: ["config", "json-patch", "yaml", "rfc6902"],
  category: "Config",
  component: ConfPatchDemo,
});

registerDemo({
  id: "workspace-yaml",
  name: "Workspace YAML Generator",
  packageName: "@powerduck/workspace-yaml",
  description: "Generate workspace.yaml and OpenAPI 3.2 YAML from a form",
  longDescription:
    "Fill in a form to generate a workspace.yaml and OpenAPI 3.2 YAML file content.",
  version: "0.2.3",
  docsUrl: "https://www.powerduck.com/docs/workspace-yaml/introduction",
  tags: ["workspace", "yaml", "openapi", "generator"],
  category: "Config",
  component: WorkspaceYamlDemo,
});

// --- UI Components ---
registerDemo({
  id: "tree",
  name: "Navigation Tree",
  packageName: "@powerduck/tree",
  description: "Extensible tree component for API navigation and schema exploration",
  longDescription:
    "Interactive tree component with search, expand/collapse, and keyboard navigation.",
  version: "0.7.7",
  docsUrl: "https://www.powerduck.com/docs/tree/introduction",
  tags: ["tree", "navigation", "react", "openapi"],
  category: "UI Components",
  component: TreeDemo,
});

registerDemo({
  id: "oas-document",
  name: "API Documentation",
  packageName: "@powerduck/oas-document",
  description: "Drop-in Stripe-style API documentation from any OpenAPI document",
  longDescription:
    "Pass an OpenAPI document and get a full API documentation UI with tree navigation, code examples, and schema exploration.",
  version: "0.1.3",
  docsUrl: "https://www.powerduck.com/docs/oas-document/introduction",
  tags: ["openapi", "docs", "react", "stripe-style"],
  category: "UI Components",
  component: OasDocumentDemo,
});
