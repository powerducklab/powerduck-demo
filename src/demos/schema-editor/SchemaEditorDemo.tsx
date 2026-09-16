import { useState } from "react";
import { Box, Text, VStack, HStack, Badge, createListCollection } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
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

const SAMPLE_JSON = `{
  "name": "doggie",
  "status": "available"
}`;

const SAMPLE_YAML = `name: doggie
status: available
`;

const languageCollection = createListCollection({
  items: [
    { label: "JSON", value: "json" },
    { label: "YAML", value: "yaml" },
  ],
});

const themeCollection = createListCollection({
  items: [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ],
});

export function SchemaEditorDemo() {
  const [value, setValue] = useState(SAMPLE_JSON);
  const [language, setLanguage] = useState<"json" | "yaml">("json");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const handleLanguageChange = (lang: "json" | "yaml") => {
    setLanguage(lang);
    setValue(lang === "yaml" ? SAMPLE_YAML : SAMPLE_JSON);
  };

  const controls = (
    <VStack gap={4} align="stretch">
      <Text fontSize="sm" color="fg.muted">
        Start typing in the editor. The JSON Schema below drives completion,
        enum dropdowns, ghost text, and diagnostics.
      </Text>

      <VStack gap={2} align="stretch">
        <Box>
          <Text fontSize="xs" fontWeight="600" mb={1}>Language</Text>
          <Select.Root
            size="sm"
            value={[language]}
            collection={languageCollection}
            onValueChange={(e) => handleLanguageChange(e.value[0] as "json" | "yaml")}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select language" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {languageCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </Box>

        <Box>
          <Text fontSize="xs" fontWeight="600" mb={1}>Theme</Text>
          <Select.Root
            size="sm"
            value={[theme]}
            collection={themeCollection}
            onValueChange={(e) => setTheme(e.value[0] as "light" | "dark")}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select theme" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
              {themeCollection.items.map((item) => (
                <Select.Item key={item.value} item={item}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </Box>
      </VStack>

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
  );

  const preview = (
    <Box flex="1" minH={0} border="1px solid" borderColor="border" borderRadius="md" overflow="hidden">
      <SchemaEditor
        value={value}
        onChange={setValue}
        language={language}
        schema={petSchema}
        theme={theme}
      />
    </Box>
  );

  return <DemoLayout meta={META} controls={controls} preview={preview} />;
}
