import { useCallback, useRef, useState } from "react";
import {
  Box,
  createListCollection,
  Field,
  HStack,
  Link,
  Select,
  Slider,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MarkdownEditorReact } from "@powerduck/md-editor/react";
import type { MarkdownEditorHandle } from "@powerduck/md-editor/react";
import type { MentionItem, DocItem } from "@powerduck/md-editor";
import "@powerduck/md-editor/dist/style.css";

import { DemoLayout } from "../../components/DemoLayout";
import { PanelSection } from "../../components/PanelSection";
import { SAMPLE_MARKDOWN } from "../../samples/markdown";
import type { DemoMeta } from "../../types";

type EditorMode = "simple" | "complex";
type EditorTheme = "light" | "dark";

const META: DemoMeta = {
  id: "md-editor",
  name: "MD Editor",
  packageName: "@powerduck/md-editor",
  description: "High-performance embeddable Markdown editor",
  longDescription:
    "A high-performance embeddable Markdown editor with KaTeX math, Markmap mindmaps, highlight.js code blocks, admonition blocks, rich toolbar, @mentions, /doc-link insertion, image upload hooks, and both simple and complex modes with light/dark themes.",
  version: "0.11.2",
  docsUrl: "https://www.powerduck.com/docs/md-editor/introduction",
  tags: ["markdown", "editor", "wysiwyg", "katex"],
};

const DEFAULTS = {
  mode: "complex" as EditorMode,
  theme: "light" as EditorTheme,
  math: true,
  mindmap: true,
  codeHighlight: true,
  tips: true,
  preview: true,
  autoPreview: true,
  renderDebounce: 200,
  mention: true,
  docLink: true,
};

const MODE_COLLECTION = createListCollection<{ value: EditorMode; label: string }>({
  items: [
    { value: "simple", label: "Simple" },
    { value: "complex", label: "Complex" },
  ],
  itemToValue: (item) => item.value,
  itemToString: (item) => item.label,
});

const THEME_COLLECTION = createListCollection<{ value: EditorTheme; label: string }>({
  items: [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ],
  itemToValue: (item) => item.value,
  itemToString: (item) => item.label,
});

const SAMPLE_USERS: MentionItem[] = [
  { id: "1", label: "Alice Chen", description: "Frontend Engineer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice" },
  { id: "2", label: "Bob Smith", description: "Backend Engineer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob" },
  { id: "3", label: "Carol Wang", description: "Product Manager", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol" },
  { id: "4", label: "David Lee", description: "DevOps Engineer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david" },
  { id: "5", label: "Eva Brown", description: "UX Designer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=eva" },
  { id: "6", label: "Frank Zhang", description: "Data Scientist", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=frank" },
];

const SAMPLE_DOCS: DocItem[] = [
  {
    id: "1",
    title: "Getting Started Guide",
    url: "https://docs.example.com/getting-started",
    description: "Quick start tutorial for new users",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=120&fit=crop",
  },
  {
    id: "2",
    title: "API Reference",
    url: "https://docs.example.com/api",
    description: "Complete API documentation",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=120&fit=crop",
  },
  {
    id: "3",
    title: "Configuration Options",
    url: "https://docs.example.com/config",
    description: "All configuration parameters explained",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=120&fit=crop",
  },
  {
    id: "4",
    title: "Deployment Guide",
    url: "https://docs.example.com/deploy",
    description: "How to deploy to production",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=120&fit=crop",
  },
  {
    id: "5",
    title: "Changelog",
    url: "https://docs.example.com/changelog",
    description: "Version history and release notes",
    thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=200&h=120&fit=crop",
  },
  {
    id: "6",
    title: "FAQ",
    url: "https://docs.example.com/faq",
    description: "Frequently asked questions",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=120&fit=crop",
  },
];

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Switch.Root checked={checked} onCheckedChange={(e) => onChange(e.checked)} size="sm" justifyContent="space-between" width="full">
      <Switch.HiddenInput />
      <Switch.Label fontSize="xs">{label}</Switch.Label>
      <Switch.Control />
    </Switch.Root>
  );
}

export function MdEditorDemo() {
  const editorRef = useRef<MarkdownEditorHandle>(null);

  const [mode, setMode] = useState<EditorMode>(DEFAULTS.mode);
  const [theme, setTheme] = useState<EditorTheme>(DEFAULTS.theme);
  const [math, setMath] = useState<boolean>(DEFAULTS.math);
  const [mindmap, setMindmap] = useState<boolean>(DEFAULTS.mindmap);
  const [codeHighlight, setCodeHighlight] = useState<boolean>(DEFAULTS.codeHighlight);
  const [tips, setTips] = useState<boolean>(DEFAULTS.tips);
  const [preview, setPreview] = useState<boolean>(DEFAULTS.preview);
  const [autoPreview, setAutoPreview] = useState<boolean>(DEFAULTS.autoPreview);
  const [renderDebounce, setRenderDebounce] = useState<number>(DEFAULTS.renderDebounce);
  const [mention, setMention] = useState<boolean>(DEFAULTS.mention);
  const [docLink, setDocLink] = useState<boolean>(DEFAULTS.docLink);

  const handleReset = useCallback(() => {
    setMode(DEFAULTS.mode);
    setTheme(DEFAULTS.theme);
    setMath(DEFAULTS.math);
    setMindmap(DEFAULTS.mindmap);
    setCodeHighlight(DEFAULTS.codeHighlight);
    setTips(DEFAULTS.tips);
    setPreview(DEFAULTS.preview);
    setAutoPreview(DEFAULTS.autoPreview);
    setRenderDebounce(DEFAULTS.renderDebounce);
    setMention(DEFAULTS.mention);
    setDocLink(DEFAULTS.docLink);
    editorRef.current?.setValue(SAMPLE_MARKDOWN);
  }, []);

  const handleMentionSearch = useCallback((query: string): MentionItem[] => {
    const q = query.toLowerCase();
    return SAMPLE_USERS.filter(
      (u) => u.label.toLowerCase().includes(q) || u.description?.toLowerCase().includes(q),
    ).slice(0, 6);
  }, []);

  const handleDocSearch = useCallback((query: string): DocItem[] => {
    const q = query.toLowerCase();
    return SAMPLE_DOCS.filter(
      (d) => d.title.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q),
    ).slice(0, 6);
  }, []);

  const controls = (
    <VStack gap={5} align="stretch">
      <PanelSection title="Editor Settings">
        <VStack gap={3} align="stretch">
          <Field.Root>
            <Field.Label fontSize="xs">Mode</Field.Label>
            <Select.Root
              collection={MODE_COLLECTION}
              value={[mode]}
              onValueChange={(e) => setMode((e.value[0] ?? "complex") as EditorMode)}
              size="sm"
            >
              <Select.Trigger>
                <Select.ValueText placeholder="Select mode" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Content>
                {MODE_COLLECTION.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Field.Root>

          <Field.Root>
            <Field.Label fontSize="xs">Theme</Field.Label>
            <Select.Root
              collection={THEME_COLLECTION}
              value={[theme]}
              onValueChange={(e) => setTheme((e.value[0] ?? "light") as EditorTheme)}
              size="sm"
            >
              <Select.Trigger>
                <Select.ValueText placeholder="Select theme" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Content>
                {THEME_COLLECTION.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Field.Root>
        </VStack>
      </PanelSection>

      <PanelSection title="Features">
        <VStack gap={1.5} align="stretch">
          <ToggleRow label="Math (KaTeX)" checked={math} onChange={setMath} />
          <ToggleRow label="Mindmap (Markmap)" checked={mindmap} onChange={setMindmap} />
          <ToggleRow label="Code Highlight" checked={codeHighlight} onChange={setCodeHighlight} />
          <ToggleRow label="Admonition Tips" checked={tips} onChange={setTips} />
        </VStack>
      </PanelSection>

      <PanelSection title="Interactive">
        <VStack gap={1.5} align="stretch">
          <ToggleRow label="@Mentions" checked={mention} onChange={setMention} />
          <ToggleRow label="/Doc Links" checked={docLink} onChange={setDocLink} />
        </VStack>
      </PanelSection>

      <PanelSection title="Preview">
        <VStack gap={1.5} align="stretch">
          <ToggleRow label="Preview Pane" checked={preview} onChange={setPreview} />
          <ToggleRow label="Auto Preview" checked={autoPreview} onChange={setAutoPreview} />
        </VStack>
      </PanelSection>

      <PanelSection title="Performance">
        <Slider.Root
          value={[renderDebounce]}
          onValueChange={(e) => setRenderDebounce(e.value[0])}
          min={0}
          max={500}
          step={50}
          size="sm"
        >
          <HStack justify="space-between" w="full" mb={1}>
            <Slider.Label fontSize="xs">Render Debounce</Slider.Label>
            <Slider.ValueText fontSize="xs" fontFamily="mono">{renderDebounce} ms</Slider.ValueText>
          </HStack>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0} />
          </Slider.Control>
        </Slider.Root>
      </PanelSection>

      <HStack gap={3}>
        <Link
          onClick={handleReset}
          cursor="pointer"
          fontSize="xs"
          color="fg.muted"
          _hover={{ color: "accent" }}
          transition="color 0.15s ease"
        >
          Reset to Defaults
        </Link>
      </HStack>

      <Box
        p={3}
        bg="blue.50"
        borderRadius="md"
        borderWidth="1px"
        borderColor="blue.100"
        _dark={{ bg: "blue.900", borderColor: "blue.800" }}
      >
        <Text fontSize="xs" fontWeight="600" color="blue.700" _dark={{ color: "blue.300" }} mb={1}>
          Try it out
        </Text>
        <Text fontSize="xs" color="blue.600" _dark={{ color: "blue.400" }} lineHeight="1.5">
          Type <strong>@</strong> to mention a user, or <strong>/</strong> to insert a document link with preview card.
        </Text>
      </Box>
    </VStack>
  );

  const previewPanel = (
    <Box w="full" h="full" minH={0}>
      <MarkdownEditorReact
        ref={editorRef}
        defaultValue={SAMPLE_MARKDOWN}
        mode={mode}
        theme={theme}
        math={math}
        mindmap={mindmap}
        codeHighlight={codeHighlight}
        tips={tips}
        preview={preview}
        autoPreview={autoPreview}
        renderDebounce={renderDebounce}
        mention={mention ? { onMentionSearch: handleMentionSearch, minChars: 0, maxItems: 6 } : undefined}
        docLink={docLink ? { onDocSearch: handleDocSearch, insertStyle: "card", minChars: 0, maxItems: 6 } : undefined}
      />
    </Box>
  );

  return <DemoLayout meta={META} controls={controls} preview={previewPanel} />;
}
