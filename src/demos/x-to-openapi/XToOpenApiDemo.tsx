import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Field,
  Flex,
  HStack,
  Input,
  Link,
  Spinner,
  Switch,
  Table,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
import type {
  ConvertOptions,
  ConvertResult,
  Diagnostic,
  NormalizedRequest,
} from "@powerduck/x-to-openapi";
import { DemoLayout } from "../../components/DemoLayout";
import { MonacoCodeBlock } from "../../components/MonacoCodeBlock";
import { PanelSection } from "../../components/PanelSection";
import { CURL_SAMPLES } from "../../samples/data";
import type { DemoMeta } from "../../types";

const META: DemoMeta = {
  id: "x-to-openapi",
  name: "X to OpenAPI",
  packageName: "@powerduck/x-to-openapi",
  description: "Convert cURL and Postman to OpenAPI 3.2",
  longDescription:
    "An extensible production-grade X-to-OpenAPI 3.2 conversion framework. Convert cURL commands and Postman collections to OpenAPI 3.2 documents with automatic path parameter inference, security detection, and schema validation.",
  version: "0.2.2",
  docsUrl: "https://www.powerduck.com/docs/x-to-openapi/introduction",
  tags: ["openapi", "curl", "postman", "converter"],
};

const DEFAULT_OPTIONS: ConvertOptions = {
  title: "Converted API",
  version: "1.0.0",
  description: "",
  inferPathParameters: true,
  pathParameterMinSamples: 2,
  inferSecurity: true,
  includeCommonHeaders: false,
  includeCookies: false,
  includeExamples: true,
  useServerBasePath: true,
  validate: true,
  strict: false,
};

const SAMPLE_POSTMAN = JSON.stringify(
  {
    info: {
      name: "User API Collection",
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    item: [
      {
        name: "List Users",
        request: {
          method: "GET",
          header: [{ key: "Accept", value: "application/json" }],
          url: {
            raw: "https://api.example.com/v1/users?limit=10",
            host: ["api", "example", "com"],
            path: ["v1", "users"],
            query: [{ key: "limit", value: "10" }],
          },
        },
      },
      {
        name: "Create User",
        request: {
          method: "POST",
          header: [
            { key: "Content-Type", value: "application/json" },
            { key: "Authorization", value: "Bearer token123" },
          ],
          body: {
            mode: "raw",
            raw: '{"name":"Jane Doe","email":"jane@example.com"}',
          },
          url: {
            raw: "https://api.example.com/v1/users",
            host: ["api", "example", "com"],
            path: ["v1", "users"],
          },
        },
      },
    ],
  },
  null,
  2,
);

type InputType = "curl" | "postman";

const METHOD_COLORS: Record<string, string> = {
  get: "green",
  post: "blue",
  put: "orange",
  delete: "red",
  patch: "purple",
  head: "gray",
  options: "gray",
};

const SEVERITY_COLORS: Record<Diagnostic["severity"], string> = {
  info: "blue",
  warning: "orange",
  error: "red",
};

function methodColor(method: string): string {
  return METHOD_COLORS[method.toLowerCase()] ?? "gray";
}

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}

function ToggleRow({ label, checked, onChange }: ToggleRowProps) {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={(e) => onChange(e.checked)}
      justifyContent="space-between"
      width="full"
      size="sm"
    >
      <Switch.HiddenInput />
      <Switch.Label fontSize="xs">{label}</Switch.Label>
      <Switch.Control />
    </Switch.Root>
  );
}

export function XToOpenApiDemo() {
  const [inputText, setInputText] = useState<string>(CURL_SAMPLES[0].commands);
  const [inputType, setInputType] = useState<InputType>("curl");
  const [options, setOptions] = useState<ConvertOptions>({
    ...DEFAULT_OPTIONS,
  });
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runConvert = useCallback(
    async (text: string, type: InputType, opts: ConvertOptions) => {
      setIsLoading(true);
      setError(null);
      try {
        const res =
          type === "curl"
            ? await curlToOpenApi(text, opts)
            : await postmanToOpenApi(JSON.parse(text), opts);
        setResult(res);
      } catch (e) {
        setResult(null);
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void runConvert(CURL_SAMPLES[0].commands, "curl", DEFAULT_OPTIONS);
  }, [runConvert]);

  const handleConvert = () => {
    void runConvert(inputText, inputType, options);
  };

  const patchOption = <K extends keyof ConvertOptions>(
    key: K,
    value: ConvertOptions[K],
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const loadCurlSample = (sampleId: string) => {
    const sample = CURL_SAMPLES.find((s) => s.id === sampleId);
    if (sample) {
      setInputText(sample.commands);
      setInputType("curl");
      void runConvert(sample.commands, "curl", options);
    }
  };

  const controls = (
    <VStack gap={5} align="stretch">
      <PanelSection title="Input Source">
        <Tabs.Root
          value={inputType}
          onValueChange={(e) => setInputType(e.value as InputType)}
          variant="line"
          size="sm"
        >
          <Tabs.List>
            <Tabs.Trigger value="curl">cURL</Tabs.Trigger>
            <Tabs.Trigger value="postman">Postman</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="curl" pt={3}>
            <VStack gap={2} align="stretch">
              <Box
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                overflow="hidden"
                h="200px"
              >
                <Editor
                  height="100%"
                  language="shell"
                  value={inputType === "curl" ? inputText : ""}
                  onChange={(v) => setInputText(v ?? "")}
                  theme="light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 11.5,
                    lineHeight: 1.55,
                    fontFamily:
                      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                    scrollBeyondLastLine: false,
                    scrollbar: {
                      vertical: "auto",
                      horizontal: "auto",
                      useShadows: false,
                    },
                    padding: { top: 8, bottom: 8 },
                    renderLineHighlight: "none",
                    automaticLayout: true,
                    wordWrap: "off",
                    folding: false,
                  }}
                />
              </Box>
              <HStack gap={3} mt={1} flexWrap="wrap">
                <Text
                  fontSize="10.5px"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                  fontWeight="600"
                >
                  Samples
                </Text>
                {CURL_SAMPLES.map((sample) => (
                  <Link
                    key={sample.id}
                    onClick={() => loadCurlSample(sample.id)}
                    cursor="pointer"
                    fontSize="xs"
                    color="fg.muted"
                    _hover={{ color: "accent" }}
                    transition="color 0.15s ease"
                  >
                    {sample.label}
                  </Link>
                ))}
              </HStack>
            </VStack>
          </Tabs.Content>

          <Tabs.Content value="postman" pt={3}>
            <VStack gap={2} align="stretch">
              <Box
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                overflow="hidden"
                h="200px"
              >
                <Editor
                  height="100%"
                  language="json"
                  value={inputType === "postman" ? inputText : SAMPLE_POSTMAN}
                  onChange={(v) => {
                    setInputType("postman");
                    setInputText(v ?? "");
                  }}
                  theme="light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 11.5,
                    lineHeight: 1.55,
                    fontFamily:
                      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                    scrollBeyondLastLine: false,
                    scrollbar: {
                      vertical: "auto",
                      horizontal: "auto",
                      useShadows: false,
                    },
                    padding: { top: 8, bottom: 8 },
                    renderLineHighlight: "none",
                    automaticLayout: true,
                    wordWrap: "off",
                    folding: true,
                  }}
                />
              </Box>
              <Link
                onClick={() => {
                  setInputText(SAMPLE_POSTMAN);
                  setInputType("postman");
                }}
                cursor="pointer"
                fontSize="xs"
                color="fg.muted"
                _hover={{ color: "accent" }}
                transition="color 0.15s ease"
              >
                Load sample collection
              </Link>
            </VStack>
          </Tabs.Content>
        </Tabs.Root>
      </PanelSection>

      <PanelSection title="Conversion Options">
        <VStack gap={3} align="stretch">
          <Field.Root>
            <Field.Label fontSize="xs">Title</Field.Label>
            <Input
              value={options.title ?? ""}
              onChange={(e) => patchOption("title", e.target.value)}
              placeholder="Converted API"
              size="sm"
              fontSize="xs"
            />
          </Field.Root>

          <Field.Root>
            <Field.Label fontSize="xs">Version</Field.Label>
            <Input
              value={options.version ?? ""}
              onChange={(e) => patchOption("version", e.target.value)}
              placeholder="1.0.0"
              size="sm"
              fontSize="xs"
            />
          </Field.Root>

          <VStack gap={1.5} align="stretch">
            <ToggleRow
              label="Infer path parameters"
              checked={options.inferPathParameters ?? true}
              onChange={(v) => patchOption("inferPathParameters", v)}
            />
            <ToggleRow
              label="Infer security schemes"
              checked={options.inferSecurity ?? true}
              onChange={(v) => patchOption("inferSecurity", v)}
            />
            <ToggleRow
              label="Include common headers"
              checked={options.includeCommonHeaders ?? false}
              onChange={(v) => patchOption("includeCommonHeaders", v)}
            />
            <ToggleRow
              label="Include cookies"
              checked={options.includeCookies ?? false}
              onChange={(v) => patchOption("includeCookies", v)}
            />
            <ToggleRow
              label="Include examples"
              checked={options.includeExamples ?? true}
              onChange={(v) => patchOption("includeExamples", v)}
            />
            <ToggleRow
              label="Use server base path"
              checked={options.useServerBasePath ?? true}
              onChange={(v) => patchOption("useServerBasePath", v)}
            />
            <ToggleRow
              label="Validate output"
              checked={options.validate ?? true}
              onChange={(v) => patchOption("validate", v)}
            />
            <ToggleRow
              label="Strict mode"
              checked={options.strict ?? false}
              onChange={(v) => patchOption("strict", v)}
            />
          </VStack>
        </VStack>
      </PanelSection>

      <Button
        onClick={handleConvert}
        variant={"outline"}
        fontSize="xs"
        size={"sm"}
        fontWeight="600"
        py={2}
        borderRadius="md"
        cursor={isLoading ? "not-allowed" : "pointer"}
        _hover={{ opacity: isLoading ? 0.6 : 0.9 }}
        opacity={isLoading ? 0.6 : 1}
      >
        {isLoading ? "Converting..." : "Convert to OpenAPI"}
      </Button>
    </VStack>
  );

  const previewPanel = (
    <VStack gap={0} align="stretch" h="full">
      {isLoading ? (
        <Flex justify="center" align="center" h="full">
          <Spinner size="md" />
        </Flex>
      ) : error ? (
        <Alert.Root status="error" size="sm">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title fontSize="sm">Conversion failed</Alert.Title>
            <Alert.Description fontSize="xs">{error}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ) : result ? (
        <>
          <HStack justify="space-between" mb={2.5} flexShrink={0}>
            <Text
              fontSize="xs"
              fontWeight="600"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              Conversion Result
            </Text>
            <HStack gap={1.5}>
              <Badge
                size="sm"
                variant="subtle"
                colorPalette={result.documentValid ? "green" : "red"}
                fontSize="10px"
              >
                {result.documentValid ? "Valid" : "Invalid"}
              </Badge>
              <Badge
                size="sm"
                variant="subtle"
                colorPalette="blue"
                fontSize="10px"
              >
                {result.requests.length} reqs
              </Badge>
              <Badge
                size="sm"
                variant="subtle"
                colorPalette="purple"
                fontSize="10px"
              >
                {result.diagnostics.length} diag
              </Badge>
            </HStack>
          </HStack>

          <Tabs.Root
            defaultValue="document"
            variant="line"
            size="sm"
            flex="1"
            display="flex"
            flexDirection="column"
          >
            <Tabs.List flexShrink={0}>
              <Tabs.Trigger value="document">OpenAPI</Tabs.Trigger>
              <Tabs.Trigger value="requests">Requests</Tabs.Trigger>
              <Tabs.Trigger value="diagnostics">Diagnostics</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content
              value="document"
              pt={3}
              flex="1"
              minH={0}
              display="flex"
              flexDirection="column"
            >
              <Box flex="1" minH={0}>
                <MonacoCodeBlock
                  code={JSON.stringify(result.document, null, 2)}
                  language="yaml"
                  title="OpenAPI 3.2 Document"
                />
              </Box>
            </Tabs.Content>

            <Tabs.Content
              value="requests"
              pt={3}
              flex="1"
              minH={0}
              overflow="hidden"
            >
              {result.requests.length === 0 ? (
                <Text fontSize="sm" color="fg.muted">
                  No requests detected.
                </Text>
              ) : (
                <Box maxH="100%" overflowY="auto">
                  <Table.Root size="sm" variant="outline">
                    <Table.Header
                      position="sticky"
                      top={0}
                      bg="bg.panel"
                      zIndex={1}
                    >
                      <Table.Row>
                        <Table.ColumnHeader width="60px">
                          Method
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>URL</Table.ColumnHeader>
                        <Table.ColumnHeader width="50px" textAlign="center">
                          Body
                        </Table.ColumnHeader>
                        <Table.ColumnHeader width="50px" textAlign="center">
                          Auth
                        </Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {result.requests.map(
                        (req: NormalizedRequest, idx: number) => (
                          <Table.Row key={idx}>
                            <Table.Cell>
                              <Badge
                                size="xs"
                                colorPalette={methodColor(req.method)}
                                variant="subtle"
                              >
                                {req.method.toUpperCase()}
                              </Badge>
                            </Table.Cell>
                            <Table.Cell fontFamily="mono" fontSize="xs">
                              {req.urlString ?? req.url.toString()}
                            </Table.Cell>
                            <Table.Cell textAlign="center" fontSize="xs">
                              {req.body ? "Yes" : "No"}
                            </Table.Cell>
                            <Table.Cell textAlign="center" fontSize="xs">
                              {req.auth ? "Yes" : "No"}
                            </Table.Cell>
                          </Table.Row>
                        ),
                      )}
                    </Table.Body>
                  </Table.Root>
                </Box>
              )}
            </Tabs.Content>

            <Tabs.Content
              value="diagnostics"
              pt={3}
              flex="1"
              minH={0}
              overflow="hidden"
            >
              {result.diagnostics.length === 0 ? (
                <Text fontSize="sm" color="fg.muted">
                  No diagnostics produced.
                </Text>
              ) : (
                <VStack gap={2} align="stretch" maxH="100%" overflowY="auto">
                  {result.diagnostics.map((d: Diagnostic, idx: number) => (
                    <Alert.Root
                      key={idx}
                      status={
                        d.severity === "error"
                          ? "error"
                          : d.severity === "warning"
                            ? "warning"
                            : "info"
                      }
                      size="sm"
                    >
                      <Alert.Indicator />
                      <Alert.Content>
                        <HStack gap={2} wrap="wrap">
                          <Badge
                            size="xs"
                            colorPalette={SEVERITY_COLORS[d.severity]}
                          >
                            {d.severity}
                          </Badge>
                          <Text
                            fontSize="xs"
                            fontWeight="600"
                            fontFamily="mono"
                          >
                            {d.code}
                          </Text>
                        </HStack>
                        <Alert.Description fontSize="xs">
                          {d.message}
                          {d.path ? ` (${d.path})` : ""}
                        </Alert.Description>
                      </Alert.Content>
                    </Alert.Root>
                  ))}
                </VStack>
              )}
            </Tabs.Content>
          </Tabs.Root>
        </>
      ) : (
        <Flex justify="center" align="center" h="full">
          <Text fontSize="sm" color="fg.muted">
            Run a conversion to see results.
          </Text>
        </Flex>
      )}
    </VStack>
  );

  return <DemoLayout meta={META} controls={controls} preview={previewPanel} />;
}
