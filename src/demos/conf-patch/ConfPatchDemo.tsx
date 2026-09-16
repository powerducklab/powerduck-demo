import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  createListCollection,
  HStack,
  IconButton,
  Input,
  Link,
  Select,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { DemoLayout } from "../../components/DemoLayout";
import { MonacoCodeBlock } from "../../components/MonacoCodeBlock";
import { PanelSection } from "../../components/PanelSection";
import { SAMPLE_JSON_CONFIG, SAMPLE_YAML_CONFIG } from "../../samples/data";
import { patchContent } from "@powerduck/conf-patch/core";
import type { JsonPatchOp } from "@powerduck/conf-patch/core";
import type { DemoMeta } from "../../types";

type Format = "json" | "yaml";
type OpType = "add" | "replace" | "remove";

interface OpRow {
  id: number;
  op: OpType;
  pathText: string;
  valueText: string;
}

const META: DemoMeta = {
  id: "conf-patch",
  name: "Config Patch",
  packageName: "@powerduck/conf-patch",
  description: "Two-layer JSON/YAML config patching editor",
  longDescription:
    "Visually construct RFC 6902 patch operations and apply them to a live JSON or YAML configuration string. The core engine preserves comments and formatting, and runs fully in the browser.",
  version: "0.3.4",
  docsUrl: "https://www.powerduck.com/docs/conf-patch/introduction",
  tags: ["config", "json-patch", "yaml", "rfc6902"],
  category: "Config",
};

let nextId = 1;

const formatCollection = createListCollection({
  items: [
    { label: "JSON", value: "json" },
    { label: "YAML", value: "yaml" },
  ],
});

const opCollection = createListCollection({
  items: [
    { label: "add", value: "add" },
    { label: "replace", value: "replace" },
    { label: "remove", value: "remove" },
  ],
});

interface Preset {
  label: string;
  op: OpType;
  path: string;
  value?: string;
}

const PRESETS: Preset[] = [
  { label: "Set debug=true", op: "replace", path: "app.debug", value: "true" },
  { label: "Change port to 8080", op: "replace", path: "server.port", value: "8080" },
  { label: "Enable SSL", op: "replace", path: "server.ssl.enabled", value: "true" },
  { label: "Remove betaPreview", op: "remove", path: "features.betaPreview" },
  { label: "Add analytics feature", op: "add", path: "features.analytics", value: "true" },
];

function parsePath(pathText: string): (string | number)[] {
  return pathText
    .split(".")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((seg) => (/^\d+$/.test(seg) ? Number(seg) : seg));
}

function parseValue(valueText: string): unknown {
  const trimmed = valueText.trim();
  if (trimmed === "") return "";
  try {
    return JSON.parse(trimmed);
  } catch {
    return valueText;
  }
}

function buildOps(rows: OpRow[]): JsonPatchOp[] {
  const ops: JsonPatchOp[] = [];
  for (const row of rows) {
    const path = parsePath(row.pathText);
    if (path.length === 0) continue;
    if (row.op === "remove") {
      ops.push({ op: "remove", path });
    } else {
      ops.push({ op: row.op, path, value: parseValue(row.valueText) });
    }
  }
  return ops;
}

export function ConfPatchDemo() {
  const [format, setFormat] = useState<Format>("json");
  const [sourceContent, setSourceContent] = useState<string>(SAMPLE_JSON_CONFIG);
  const [rows, setRows] = useState<OpRow[]>([]);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");

  function apply(currentRows: OpRow[], currentSource: string, fmt: Format) {
    const ops = buildOps(currentRows);
    try {
      const result = patchContent(currentSource, ops, fmt);
      setOutput(result);
      setError("");
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function handleFormatChange(value: string) {
    const fmt = value as Format;
    setFormat(fmt);
    setSourceContent(fmt === "yaml" ? SAMPLE_YAML_CONFIG : SAMPLE_JSON_CONFIG);
    setOutput("");
    setError("");
  }

  function updateRow(id: number, patch: Partial<OpRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { id: nextId++, op: "replace", pathText: "", valueText: "" }]);
  }

  function removeRow(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function handleApply() {
    apply(rows, sourceContent, format);
  }

  function handleClear() {
    setRows([]);
    setOutput("");
    setError("");
  }

  function applyPreset(preset: Preset) {
    const newRow: OpRow = {
      id: nextId++,
      op: preset.op,
      pathText: preset.path,
      valueText: preset.value ?? "",
    };
    const newRows = [...rows, newRow];
    setRows(newRows);
    apply(newRows, sourceContent, format);
  }

  const controls = (
    <VStack gap={5} align="stretch">
      <PanelSection
        title="Source Configuration"
        right={
          <Select.Root
            collection={formatCollection}
            value={[format]}
            onValueChange={(e) => handleFormatChange(e.value[0] ?? "json")}
            size="xs"
            w="80px"
          >
            <Select.Trigger>
              <Select.ValueText />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Content>
              {formatCollection.items.map((item) => (
                <Select.Item key={item.value} item={item}>
                  <Select.ItemText>{item.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        }
      >
        <Box borderWidth="1px" borderColor="border" borderRadius="md" overflow="hidden" h="220px">
          <Editor
            height="100%"
            language={format}
            value={sourceContent}
            onChange={(v) => setSourceContent(v ?? "")}
            theme="light"
            options={{
              minimap: { enabled: false },
              fontSize: 11.5,
              lineHeight: 1.55,
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              scrollBeyondLastLine: false,
              scrollbar: { vertical: "auto", horizontal: "auto", useShadows: false },
              padding: { top: 8, bottom: 8 },
              renderLineHighlight: "none",
              automaticLayout: true,
              wordWrap: "off",
              folding: true,
            }}
          />
        </Box>
      </PanelSection>

      <PanelSection
        title="Patch Operations"
        right={
          <HStack gap={1}>
            <Link
              onClick={addRow}
              cursor="pointer"
              fontSize="xs"
              color="fg.muted"
              _hover={{ color: "accent" }}
              transition="color 0.15s ease"
            >
              + Add
            </Link>
            <Text fontSize="xs" color="fg.muted" opacity={0.4}>
              |
            </Text>
            <Link
              onClick={handleClear}
              cursor="pointer"
              fontSize="xs"
              color="fg.muted"
              _hover={{ color: "red.500" }}
              transition="color 0.15s ease"
            >
              Clear
            </Link>
          </HStack>
        }
      >
        <Box maxH="200px" overflowY="auto" borderWidth="1px" borderColor="border" borderRadius="md">
          <Table.Root size="sm" variant="outline">
            <Table.Header position="sticky" top={0} bg="bg.panel" zIndex={1}>
              <Table.Row>
                <Table.ColumnHeader width="80px">Op</Table.ColumnHeader>
                <Table.ColumnHeader>Path</Table.ColumnHeader>
                <Table.ColumnHeader>Value</Table.ColumnHeader>
                <Table.ColumnHeader width="32px"></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={4}>
                    <Text fontSize="xs" color="fg.muted" textAlign="center" py={2}>
                      No operations. Click + Add or use a preset.
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                rows.map((row) => (
                  <Table.Row key={row.id}>
                    <Table.Cell>
                      <Select.Root
                        collection={opCollection}
                        value={[row.op]}
                        onValueChange={(e) => updateRow(row.id, { op: (e.value[0] ?? "replace") as OpType })}
                        size="xs"
                      >
                        <Select.Trigger>
                          <Select.ValueText />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Content>
                          {opCollection.items.map((item) => (
                            <Select.Item key={item.value} item={item}>
                              <Select.ItemText>{item.label}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        value={row.pathText}
                        onChange={(e) => updateRow(row.id, { pathText: e.target.value })}
                        placeholder="server.port"
                        fontFamily="mono"
                        fontSize="xs"
                        size="xs"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {row.op === "remove" ? (
                        <Text fontSize="xs" color="fg.muted" fontStyle="italic">
                          (none)
                        </Text>
                      ) : (
                        <Input
                          value={row.valueText}
                          onChange={(e) => updateRow(row.id, { valueText: e.target.value })}
                          placeholder='true or "value"'
                          fontFamily="mono"
                          fontSize="xs"
                          size="xs"
                        />
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <IconButton
                        aria-label="Delete operation"
                        size="xs"
                        variant="ghost"
                        colorPalette="red"
                        onClick={() => removeRow(row.id)}
                      >
                        x
                      </IconButton>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </PanelSection>

      <PanelSection title="Quick Presets">
        <VStack gap={1.5} align="stretch">
          {PRESETS.map((preset) => (
            <Link
              key={preset.label}
              onClick={() => applyPreset(preset)}
              cursor="pointer"
              fontSize="xs"
              color="fg.muted"
              _hover={{ color: "accent" }}
              transition="color 0.15s ease"
              py={0.5}
            >
              <HStack gap={2}>
                <Badge size="xs" variant="subtle" colorPalette={preset.op === "remove" ? "red" : preset.op === "add" ? "green" : "blue"} fontSize="9px">
                  {preset.op}
                </Badge>
                <Text fontFamily="mono" fontSize="xs">{preset.path}</Text>
                {preset.value && <Text fontSize="xs" opacity={0.6}>= {preset.value}</Text>}
              </HStack>
            </Link>
          ))}
        </VStack>
      </PanelSection>

      <Button
        onClick={handleApply}
        fontSize="xs"
        fontWeight="600"
        variant={"outline"}
        py={2}
        size={"sm"}
        borderRadius="md"
        cursor="pointer"
        transition="opacity 0.15s ease"
        _hover={{ opacity: 0.9 }}
      >
        Apply Patches
      </Button>
    </VStack>
  );

  const previewPanel = error ? (
    <Box
      bg="red.subtle"
      color="red.fg"
      p={4}
      borderRadius="md"
      fontSize="sm"
      whiteSpace="pre-wrap"
      fontFamily="mono"
    >
      {error}
    </Box>
  ) : (
    <MonacoCodeBlock
      code={output || "// Patched output appears here after applying patches."}
      language={format}
      title={`Patched ${format.toUpperCase()}`}
    />
  );

  return <DemoLayout meta={META} controls={controls} preview={previewPanel} />;
}
