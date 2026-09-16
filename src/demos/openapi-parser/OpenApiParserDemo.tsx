import { useMemo, useState } from "react";
import { Box, Button, HStack, Text, VStack, Badge } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { DemoLayout } from "../../components/DemoLayout";
import { upgradeOasTo32, isOpenApiUpgradeError } from "@powerduck/openapi-parser";
import type { DemoMeta } from "../../types";

const META: DemoMeta = {
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
};

const SAMPLE_SWAGGER = `swagger: '2.0'
info:
  title: Pet Store
  version: 1.0.0
  description: A sample API
host: petstore.swagger.io
basePath: /v1
schemes:
  - https
paths:
  /pets:
    get:
      operationId: listPets
      summary: List all pets
      parameters:
        - name: limit
          in: query
          description: Max items to return
          required: false
          type: integer
          format: int32
      responses:
        '200':
          description: A list of pets
          schema:
            type: array
            items:
              $ref: '#/definitions/Pet'
  /pets/{petId}:
    get:
      operationId: getPetById
      summary: Get a pet by ID
      parameters:
        - name: petId
          in: path
          required: true
          type: string
      responses:
        '200':
          description: A single pet
          schema:
            $ref: '#/definitions/Pet'
definitions:
  Pet:
    type: object
    required:
      - id
      - name
    properties:
      id:
        type: integer
        format: int64
      name:
        type: string
      tag:
        type: string
`;

export function OpenApiParserDemo() {
  const [input, setInput] = useState(SAMPLE_SWAGGER);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const runUpgrade = async () => {
    setLoading(true);
    setError("");
    try {
      const doc = await upgradeOasTo32(input, { validateResult: true });
      setOutput(JSON.stringify(doc, null, 2));
    } catch (e) {
      if (isOpenApiUpgradeError(e)) {
        setError(`[${e.code}] ${e.message}`);
      } else {
        setError(String(e));
      }
      setOutput("");
    } finally {
      setLoading(false);
    }
  };

  const controls = useMemo(
    () => (
      <VStack gap={4} align="stretch">
        <Text fontSize="sm" color="fg.muted">
          Paste a Swagger 2.0 or OpenAPI 3.x document (JSON or YAML).
          Click upgrade to get a validated OpenAPI 3.2 document.
        </Text>
        <Button onClick={runUpgrade} loading={loading} colorPalette="blue" size="sm">
          Upgrade to OAS 3.2
        </Button>
        {error && (
          <Box p={3} bg="red.subtle" borderRadius="md" border="1px solid" borderColor="red.muted">
            <Text fontSize="xs" color="red.fg" fontFamily="mono" whiteSpace="pre-wrap">
              {error}
            </Text>
          </Box>
        )}
        <VStack gap={1} align="start">
          <Text fontSize="xs" fontWeight="600" color="fg.muted">Input document</Text>
          <Box border="1px solid" borderColor="border" borderRadius="md" overflow="hidden">
            <Editor
              height="400px"
              defaultLanguage="yaml"
              value={input}
              onChange={(v) => setInput(v ?? "")}
              theme="vs-dark"
              options={{ minimap: { enabled: false }, fontSize: 12, lineNumbers: "on" }}
            />
          </Box>
        </VStack>
      </VStack>
    ),
    [input, error, loading],
  );

  const preview = useMemo(
    () => (
      <Box h="full" display="flex" flexDirection="column">
        <HStack gap={2} mb={2}>
          <Text fontSize="sm" fontWeight="600">Output</Text>
          {output && <Badge size="sm" colorPalette="green">OpenAPI 3.2</Badge>}
        </HStack>
        <Box flex="1" border="1px solid" borderColor="border" borderRadius="md" overflow="hidden">
          <Editor
            height="100%"
            defaultLanguage="json"
            value={output || "// Click Upgrade to see the result"}
            theme="vs-dark"
            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 12 }}
          />
        </Box>
      </Box>
    ),
    [output],
  );

  return <DemoLayout meta={META} controls={controls} preview={preview} />;
}
