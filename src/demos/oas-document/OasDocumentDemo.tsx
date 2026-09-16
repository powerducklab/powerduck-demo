import { useMemo, useState } from "react";
import { Box, Text, VStack, Button } from "@chakra-ui/react";
import { OasDocument } from "@powerduck/oas-document/react";
import "@powerduck/oas-document/react/index.css";
import Editor from "@monaco-editor/react";
import { DemoLayout } from "../../components/DemoLayout";
import type { DemoMeta } from "../../types";

const META: DemoMeta = {
  id: "oas-document",
  name: "API Documentation",
  packageName: "@powerduck/oas-document",
  description: "Drop-in Stripe-style API documentation from any OpenAPI document",
  longDescription: "Pass an OpenAPI document and get a full API documentation UI with tree navigation, code examples, and schema exploration.",
  version: "0.1.3",
  docsUrl: "https://www.powerduck.com/docs/oas-document/introduction",
  tags: ["openapi", "docs", "react", "stripe-style"],
  category: "UI Components",
};

const SAMPLE_SPEC = `openapi: "3.2.0"
info:
  title: Petstore API
  version: 1.0.0
  description: A sample API for managing pets in a store.
servers:
  - url: https://petstore.example.com/v1
paths:
  /pets:
    get:
      operationId: listPets
      summary: List all pets
      tags: [Pets]
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
          description: Max number of pets to return
      responses:
        '200':
          description: A list of pets
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
    post:
      operationId: createPet
      summary: Create a pet
      tags: [Pets]
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pet'
      responses:
        '201':
          description: Pet created
components:
  schemas:
    Pet:
      type: object
      required: [name, status]
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        status:
          type: string
          enum: [available, pending, sold]
`;

export function OasDocumentDemo() {
  const [specText, setSpecText] = useState(SAMPLE_SPEC);
  const [spec, setSpec] = useState<string>("");
  const [error, setError] = useState("");

  const renderDocs = () => {
    try {
      // Simple YAML-ish parse for demo: try JSON first, then YAML via the package
      setSpec(specText);
      setError("");
    } catch (e) {
      setError(String(e));
    }
  };

  // Auto-render on mount
  useMemo(() => {
    setSpec(SAMPLE_SPEC);
  }, []);

  const controls = useMemo(
    () => (
      <VStack gap={4} align="stretch">
        <Text fontSize="sm" color="fg.muted">
          Edit the OpenAPI YAML below and click Render to see the generated documentation.
        </Text>
        <Button onClick={renderDocs} colorPalette="blue" size="sm">
          Render Documentation
        </Button>
        {error && (
          <Text fontSize="xs" color="red.fg">{error}</Text>
        )}
        <Box border="1px solid" borderColor="border" borderRadius="md" overflow="hidden">
          <Text fontSize="xs" fontWeight="600" px={2} py={1} bg="bg.panel" borderBottom="1px solid" borderColor="border">
            OpenAPI YAML
          </Text>
          <Editor
            height="400px"
            defaultLanguage="yaml"
            value={specText}
            onChange={(v) => setSpecText(v ?? "")}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 12 }}
          />
        </Box>
      </VStack>
    ),
    [specText, error],
  );

  const preview = useMemo(
    () => (
      <Box h="100vh" border="1px solid" borderColor="border" borderRadius="md" overflow="hidden">
        {spec ? (
          <OasDocument input={spec} autoUpgrade={true} style={{ height: "100%" }} />
        ) : (
          <Box p={8} textAlign="center">
            <Text color="fg.muted">Click "Render Documentation" to see the API docs.</Text>
          </Box>
        )}
      </Box>
    ),
    [spec],
  );

  return <DemoLayout meta={META} controls={controls} preview={preview} />;
}
