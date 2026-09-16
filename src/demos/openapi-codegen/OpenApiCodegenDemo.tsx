import {
  Badge,
  Box,
  createListCollection,
  Field,
  HStack,
  Input,
  Link,
  Select,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { generate, list, registerBuiltins } from "@powerduck/openapi-codegen";
import { DemoLayout } from "../../components/DemoLayout";
import { MonacoCodeBlock } from "../../components/MonacoCodeBlock";
import { PanelSection } from "../../components/PanelSection";
import { OPENAPI_SAMPLES } from "../../samples/openapi";
import type { DemoMeta } from "../../types";

registerBuiltins();

interface GeneratorInfo {
  language: string;
  client: string;
}

const GENERATORS: GeneratorInfo[] = list();
const LANGUAGES: string[] = Array.from(new Set(GENERATORS.map((g) => g.language))).sort((a, b) =>
  a.localeCompare(b),
);

const languageCollection = createListCollection({
  items: LANGUAGES.map((label) => ({ label, value: label })),
});

function clientsFor(language: string): string[] {
  return GENERATORS.filter((g) => g.language === language).map((g) => g.client);
}

const HTTP_METHODS = ["get", "post", "put", "delete", "patch"] as const;
type HttpMethod = (typeof HTTP_METHODS)[number];

interface OperationEntry {
  method: HttpMethod;
  path: string;
  operationId: string;
  hasSecurity: boolean;
}

interface RawOperation {
  operationId?: string;
  security?: unknown[];
}

const METHOD_COLOR: Record<HttpMethod, string> = {
  get: "green",
  post: "blue",
  put: "orange",
  delete: "red",
  patch: "purple",
};

const META: DemoMeta = {
  id: "openapi-codegen",
  name: "OpenAPI Codegen",
  packageName: "@powerduck/openapi-codegen",
  description: "Generate HTTP request code from OpenAPI docs",
  longDescription:
    "Generate runnable HTTP request examples from OpenAPI documents. Supports 21 languages and 41 client combinations. Browser-compatible with zero runtime dependencies.",
  version: "0.5.3",
  docsUrl: "https://www.powerduck.com/docs/openapi-codegen/introduction",
  tags: ["openapi", "codegen", "http", "api"],
  category: "Codegen",
};

function extractOperations(spec: unknown): OperationEntry[] {
  const ops: OperationEntry[] = [];
  if (!spec || typeof spec !== "object") return ops;
  const paths = (spec as { paths?: Record<string, unknown> }).paths;
  if (!paths || typeof paths !== "object") return ops;

  for (const [path, item] of Object.entries(paths)) {
    if (!item || typeof item !== "object") continue;
    for (const method of HTTP_METHODS) {
      const op = (item as Record<string, unknown>)[method] as RawOperation | undefined;
      if (op) {
        ops.push({
          method,
          path,
          operationId: op.operationId ?? `${method.toUpperCase()} ${path}`,
          hasSecurity: Array.isArray(op.security) && op.security.length > 0,
        });
      }
    }
  }
  return ops;
}

export function OpenApiCodegenDemo() {
  const [specText, setSpecText] = useState<string>(JSON.stringify(OPENAPI_SAMPLES[0].spec, null, 2));
  const [spec, setSpec] = useState<unknown>(OPENAPI_SAMPLES[0].spec);
  const [parseError, setParseError] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<HttpMethod>("get");
  const [language, setLanguage] = useState<string>(LANGUAGES[0]);
  const [client, setClient] = useState<string>(clientsFor(LANGUAGES[0])[0] ?? "");
  const [serverUrl, setServerUrl] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const operations = useMemo(() => extractOperations(spec), [spec]);

  useEffect(() => {
    if (operations.length > 0) {
      setSelectedPath(operations[0].path);
      setSelectedMethod(operations[0].method);
    }
    const servers = (spec as { servers?: Array<{ url: string }> })?.servers;
    if (servers && servers.length > 0) {
      setServerUrl(servers[0].url);
    }
  }, [spec, operations]);

  const selectedOperation =
    operations.find((o) => o.path === selectedPath && o.method === selectedMethod) ?? operations[0];

  const clientOptions = clientsFor(language);
  const clientCollection = createListCollection({
    items: clientOptions.map((label) => ({ label, value: label })),
  });

  const handleLanguageChange = (next: string) => {
    setLanguage(next);
    setClient(clientsFor(next)[0] ?? "");
  };

  const handleSpecChange = (value: string | undefined) => {
    const text = value ?? "";
    setSpecText(text);
    try {
      const parsed = JSON.parse(text);
      setSpec(parsed);
      setParseError(null);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const loadSample = (sampleId: string) => {
    const sample = OPENAPI_SAMPLES.find((s) => s.id === sampleId);
    if (sample) {
      const text = JSON.stringify(sample.spec, null, 2);
      setSpecText(text);
      setSpec(sample.spec);
      setParseError(null);
    }
  };

  const regenerate = useCallback(() => {
    if (!selectedOperation || parseError) {
      setCode("");
      setError(parseError ?? "No operation selected");
      return;
    }
    try {
      const out = generate({
        document: spec,
        path: selectedOperation.path,
        method: selectedOperation.method,
        language,
        client,
        serverUrl: serverUrl || undefined,
        securityValues: token ? { bearerAuth: token } : undefined,
      });
      setCode(out);
      setError(null);
    } catch (e) {
      setCode("");
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [spec, selectedOperation, language, client, serverUrl, token, parseError]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const controls = (
    <VStack gap={5} align="stretch">
      {/* Spec Input */}
      <PanelSection
        title="OpenAPI Spec"
        right={
          <Badge size="sm" variant="subtle" colorPalette="gray" fontSize="10px">
            {operations.length} ops
          </Badge>
        }
      >
        <Box
          borderWidth="1px"
          borderColor={parseError ? "red.300" : "border"}
          borderRadius="md"
          overflow="hidden"
          h="220px"
        >
          <Editor
            height="100%"
            language="json"
            value={specText}
            onChange={handleSpecChange}
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
              foldingHighlight: false,
            }}
          />
        </Box>
        {parseError && (
          <Text fontSize="xs" color="red.500" mt={1.5} fontFamily="mono">
            {parseError}
          </Text>
        )}
        <HStack gap={3} mt={2} flexWrap="wrap">
          <Text fontSize="10.5px" color="fg.muted" textTransform="uppercase" letterSpacing="0.05em" fontWeight="600">
            Samples
          </Text>
          {OPENAPI_SAMPLES.map((sample) => (
            <Link
              key={sample.id}
              onClick={() => loadSample(sample.id)}
              cursor="pointer"
              fontSize="xs"
              color="fg.muted"
              _hover={{ color: "accent" }}
              transition="color 0.15s ease"
              title={sample.description}
            >
              {sample.label}
            </Link>
          ))}
        </HStack>
      </PanelSection>

      {/* Operation Selector */}
      <PanelSection title="Select Operation">
        <Box
          maxH="180px"
          overflowY="auto"
          borderWidth="1px"
          borderColor="border"
          borderRadius="md"
          css={{
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "var(--chakra-colors-border)" },
          }}
        >
          <Table.Root size="sm" variant="outline">
            <Table.Header position="sticky" top={0} bg="bg.panel" zIndex={1}>
              <Table.Row>
                <Table.ColumnHeader width="55px">Method</Table.ColumnHeader>
                <Table.ColumnHeader>Path</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {operations.map((op) => {
                const active =
                  op.path === selectedOperation?.path && op.method === selectedOperation?.method;
                return (
                  <Table.Row
                    key={`${op.method}:${op.path}`}
                    onClick={() => {
                      setSelectedPath(op.path);
                      setSelectedMethod(op.method);
                    }}
                    cursor="pointer"
                    bg={active ? "blue.muted" : undefined}
                    _hover={{ bg: active ? "blue.muted" : "gray.50" }}
                  >
                    <Table.Cell>
                      <Badge size="xs" colorPalette={METHOD_COLOR[op.method]} variant="subtle">
                        {op.method.toUpperCase()}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell fontFamily="mono" fontSize="xs">
                      {op.path}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Box>
      </PanelSection>

      {/* Generation Params */}
      <PanelSection title="Generation">
        <VStack gap={3} align="stretch">
          <Field.Root>
            <Field.Label fontSize="xs">Language</Field.Label>
            <Select.Root
              collection={languageCollection}
              value={[language]}
              onValueChange={(e) => handleLanguageChange(e.value[0] ?? LANGUAGES[0])}
              size="sm"
            >
              <Select.Trigger>
                <Select.ValueText />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Content>
                {languageCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Field.Root>

          <Field.Root>
            <Field.Label fontSize="xs">HTTP Client</Field.Label>
            <Select.Root
              collection={clientCollection}
              value={[client]}
              onValueChange={(e) => setClient(e.value[0] ?? "")}
              size="sm"
            >
              <Select.Trigger>
                <Select.ValueText />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Content>
                {clientCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Field.Root>

          <Field.Root>
            <Field.Label fontSize="xs">Server URL (override)</Field.Label>
            <Input
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="https://api.example.com/v1"
              size="sm"
              fontSize="xs"
            />
          </Field.Root>

          {selectedOperation?.hasSecurity && (
            <Field.Root>
              <Field.Label fontSize="xs">Bearer Token</Field.Label>
              <Input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIs..."
                type="password"
                size="sm"
                fontSize="xs"
              />
            </Field.Root>
          )}
        </VStack>
      </PanelSection>
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
      code={code}
      language={language}
      title={`${language} / ${client}`}
    />
  );

  return <DemoLayout meta={META} controls={controls} preview={previewPanel} />;
}
