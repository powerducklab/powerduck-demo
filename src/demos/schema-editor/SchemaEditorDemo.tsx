import { useMemo, useState } from "react";
import { Box, Text, VStack, HStack, Badge } from "@chakra-ui/react";
import { SchemaEditor } from "@powerduck/schema-editor/react";
import { DemoLayout } from "../../components/DemoLayout";
import type { DemoMeta } from "../../types";

const META: DemoMeta = {
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
};

const petSchema = {
  type: "object",
  required: ["name", "status"],
  properties: {
    name: { type: "string", description: "The pet's name" },
    status: {
      type: "string",
      enum: ["available", "pending", "sold"],
      description: "Pet status in the store",
    },
    photoUrls: {
      type: "array",
      items: { type: "string", format: "uri" },
    },
    tags: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
        },
      },
    },
  },
};

const SAMPLE = `{
  "name": "doggie",
  "status": "available"
}`;

export function SchemaEditorDemo() {
  const [value, setValue] = useState(SAMPLE);

  const controls = useMemo(
    () => (
      <VStack gap={4} align="stretch">
        <Text fontSize="sm" color="fg.muted">
          Start typing in the editor. The JSON Schema below drives completion,
          enum dropdowns, ghost text, and diagnostics.
        </Text>
        <Box p={3} bg="bg.panel" borderRadius="md" border="1px solid" borderColor="border">
          <HStack gap={2} mb={2}>
            <Badge size="sm" colorPalette="blue">JSON Schema</Badge>
          </HStack>
          <Text fontSize="xs" fontFamily="mono" color="fg.muted" whiteSpace="pre-wrap">
            {JSON.stringify(petSchema, null, 2)}
          </Text>
        </Box>
        <Text fontSize="xs" color="fg.muted">
          Try typing <Text as="code">"tags"</Text> or changing <Text as="code">"status"</Text> to see enum completion.
        </Text>
      </VStack>
    ),
    [],
  );

  const preview = useMemo(
    () => (
      <Box h="full" border="1px solid" borderColor="border" borderRadius="md" overflow="hidden">
        <SchemaEditor
          value={value}
          onChange={setValue}
          language="json"
          schema={petSchema}
          theme="dark"
        />
      </Box>
    ),
    [value],
  );

  return <DemoLayout meta={META} controls={controls} preview={preview} />;
}
