/** Sample markdown content for the md-editor demo. */
export const SAMPLE_MARKDOWN = `# Welcome to Markdown Editor

A high-performance embeddable editor with **rich features**.

## Features

- KaTeX math rendering
- Markmap mindmaps
- highlight.js code blocks
- Admonition blocks
- Image / video / YouTube uploads

## Math Example

The quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$

## Code Block

\`\`\`typescript
import { MarkdownEditorReact } from "@powerduck/md-editor/react";

function App() {
  return <MarkdownEditorReact defaultValue="# Hello" mode="complex" />;
}
\`\`\`

## Admonition

::: tip
This is a tip block. Use it to highlight helpful information.
:::

::: warning
This is a warning block. Pay attention to important caveats.
:::

## Table

| Feature | Simple Mode | Complex Mode |
|---------|-------------|--------------|
| Toolbar | No          | Yes          |
| Preview | Yes         | Yes          |
| Status  | No          | Yes          |

## Blockquote

> The best way to predict the future is to invent it.
> — Alan Kay

## Task List

- [x] Install the package
- [x] Import the React component
- [ ] Customize the toolbar
- [ ] Add image upload hook
`;
