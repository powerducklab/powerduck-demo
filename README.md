# PowerDuck Library Playground

An interactive demo application showcasing the PowerDuck open-source library ecosystem. Built with React, TypeScript, Vite, and Chakra UI 3.

## Features

- **Interactive demos** for each library with live parameter controls
- **Visual configuration** panels with sliders, switches, selects, and inputs
- **Generated config JSON** with one-click copy-to-clipboard
- **Extensible architecture** via a registry pattern - add new library demos in minutes
- **Clean, tool-focused UI** inspired by professional developer tool websites

## Libraries Demonstrated

| Library | Version | Description |
|---------|---------|-------------|
| `@powerduck/md-editor` | 0.11.1 | High-performance embeddable Markdown editor with KaTeX, mindmaps, syntax highlighting |
| `@powerduck/conf-patch` | 0.3.3 | RFC 6902 JSON Patch for JSON/JSONC/YAML configs with comment preservation |
| `@powerduck/openapi-codegen` | 0.5.2 | Generate HTTP request code in 21 languages / 41 clients from OpenAPI specs |
| `@powerduck/x-to-openapi` | 0.2.1 | Convert cURL commands and Postman collections to OpenAPI 3.2 documents |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

The app will be available at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Shared UI components
│   ├── Layout.tsx       # App shell with sidebar + content area
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── DemoPage.tsx     # Base template for demo pages
│   ├── SectionCard.tsx  # Reusable card with title/description
│   └── JsonOutput.tsx   # JSON display with copy-to-clipboard
├── demos/               # Library demo pages (one per library)
│   ├── md-editor/
│   ├── conf-patch/
│   ├── openapi-codegen/
│   └── x-to-openapi/
├── pages/
│   └── HomePage.tsx     # Landing page with demo grid
├── registry/
│   ├── demoRegistry.ts  # Extensible demo registry
│   └── registerAll.ts   # Central registration of all demos
├── samples/              # Sample data for demos
│   ├── markdown.ts
│   ├── openapi.ts
│   └── data.ts
├── types/
│   └── index.ts         # Shared TypeScript types
├── App.tsx              # Root component with routing
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Adding a New Library Demo

1. Create a new directory under `src/demos/<library-name>/`
2. Create a demo component that uses the `DemoPage` wrapper
3. Register it in `src/registry/registerAll.ts`:

```typescript
import { MyNewDemo } from "../demos/my-new-lib/MyNewDemo";

registerDemo({
  id: "my-new-lib",
  name: "My New Lib",
  packageName: "@powerduck/my-new-lib",
  description: "Short description",
  longDescription: "Longer description for the demo page header",
  version: "1.0.0",
  docsUrl: "https://www.npmjs.com/package/@powerduck/my-new-lib",
  tags: ["tag1", "tag2"],
  component: MyNewDemo,
});
```

4. The demo will automatically appear in the sidebar and home page.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Chakra UI 3.36.1** for all UI components
- **React Router 7** for navigation
- **PowerDuck libraries** for the actual functionality

## License

MIT
