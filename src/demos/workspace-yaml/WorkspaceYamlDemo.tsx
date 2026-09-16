import { useMemo, useState } from "react";
import { Box, Button, HStack, Input, Text, VStack, Badge } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { DemoLayout } from "../../components/DemoLayout";
import type { DemoMeta } from "../../types";

const META: DemoMeta = {
  id: "workspace-yaml",
  name: "Workspace YAML Generator",
  packageName: "@powerduck/workspace-yaml",
  description: "Generate workspace.yaml and OpenAPI 3.2 YAML from a form",
  longDescription: "Fill in a form to generate workspace.yaml and OpenAPI 3.2 YAML file content.",
  version: "0.2.3",
  docsUrl: "https://www.powerduck.com/docs/workspace-yaml/introduction",
  tags: ["workspace", "yaml", "openapi", "generator"],
  category: "Config",
};

export function WorkspaceYamlDemo() {
  const [apiId, setApiId] = useState("my-api");
  const [apiName, setApiName] = useState("My API");
  const [apiTitle, setApiTitle] = useState("My API Documentation");
  const [version, setVersion] = useState("1.0.0");
  const [serverUrl, setServerUrl] = useState("https://api.example.com");
  const [workspaceYaml, setWorkspaceYaml] = useState("");
  const [openapiYaml, setOpenapiYaml] = useState("");

  const generate = () => {
    // Generate workspace.yaml
    const ws = `activeOasFileId: ${apiId}
defaultEnvironment: production
oasFiles:
  - id: ${apiId}
    name: ${apiName}
    file: oasFiles/${apiId}.openapi.yaml
`;
    setWorkspaceYaml(ws);

    // Generate OpenAPI YAML
    const oas = `openapi: "3.2.0"
info:
  title: ${apiTitle}
  version: ${version}
servers:
  - url: ${serverUrl}
    description: Production
paths: {}
`;
    setOpenapiYaml(oas);
  };

  const controls = useMemo(
    () => (
      <VStack gap={3} align="stretch">
        <Text fontSize="sm" color="fg.muted">
          Fill in the API details below and click Generate to create workspace.yaml and OpenAPI YAML.
        </Text>
        <VStack gap={2}>
          <Box w="full">
            <Text fontSize="xs" fontWeight="600" mb={1}>API ID</Text>
            <Input size="sm" value={apiId} onChange={(e) => setApiId(e.target.value)} />
          </Box>
          <Box w="full">
            <Text fontSize="xs" fontWeight="600" mb={1}>Display Name</Text>
            <Input size="sm" value={apiName} onChange={(e) => setApiName(e.target.value)} />
          </Box>
          <Box w="full">
            <Text fontSize="xs" fontWeight="600" mb={1}>API Title</Text>
            <Input size="sm" value={apiTitle} onChange={(e) => setApiTitle(e.target.value)} />
          </Box>
          <Box w="full">
            <Text fontSize="xs" fontWeight="600" mb={1}>Version</Text>
            <Input size="sm" value={version} onChange={(e) => setVersion(e.target.value)} />
          </Box>
          <Box w="full">
            <Text fontSize="xs" fontWeight="600" mb={1}>Server URL</Text>
            <Input size="sm" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} />
          </Box>
        </VStack>
        <Button onClick={generate} colorPalette="blue" size="sm">Generate YAML</Button>
      </VStack>
    ),
    [apiId, apiName, apiTitle, version, serverUrl],
  );

  const preview = useMemo(
    () => (
      <VStack gap={3} h="full" align="stretch">
        <Box flex="1" border="1px solid" borderColor="border" borderRadius="md" overflow="hidden">
          <HStack px={2} py={1} bg="bg.panel" borderBottom="1px solid" borderColor="border">
            <Badge size="sm" colorPalette="blue">workspace.yaml</Badge>
          </HStack>
          <Editor
            height="250px"
            defaultLanguage="yaml"
            value={workspaceYaml || "# Click Generate to see workspace.yaml"}
            theme="vs-dark"
            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 12 }}
          />
        </Box>
        <Box flex="1" border="1px solid" borderColor="border" borderRadius="md" overflow="hidden">
          <HStack px={2} py={1} bg="bg.panel" borderBottom="1px solid" borderColor="border">
            <Badge size="sm" colorPalette="green">oasFiles/{apiId}.openapi.yaml</Badge>
          </HStack>
          <Editor
            height="250px"
            defaultLanguage="yaml"
            value={openapiYaml || "# Click Generate to see the OpenAPI YAML"}
            theme="vs-dark"
            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 12 }}
          />
        </Box>
      </VStack>
    ),
    [workspaceYaml, openapiYaml, apiId],
  );

  return <DemoLayout meta={META} controls={controls} preview={preview} />;
}
