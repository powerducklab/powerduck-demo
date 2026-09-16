import { useMemo, useState } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { Tree } from "@powerduck/tree/react";
import type { TreeNode } from "@powerduck/tree/core";
import { DemoLayout } from "../../components/DemoLayout";
import type { DemoMeta } from "../../types";

const META: DemoMeta = {
  id: "tree",
  name: "Navigation Tree",
  packageName: "@powerduck/tree",
  description: "Extensible tree component for API navigation and schema exploration",
  longDescription: "Interactive tree component with search, expand/collapse, and keyboard navigation.",
  version: "0.7.7",
  docsUrl: "https://www.powerduck.com/docs/tree/introduction",
  tags: ["tree", "navigation", "react", "openapi"],
  category: "UI Components",
};

interface PetNodeMeta {
  method?: string;
  path?: string;
  operationId?: string;
  type?: "tag" | "operation";
}

const sampleNodes: TreeNode<PetNodeMeta>[] = [
  {
    id: "pets",
    name: "Pets",
    metadata: { type: "tag" },
    children: [
      {
        id: "listPets",
        name: "GET /pets",
        metadata: { type: "operation", method: "get", path: "/pets", operationId: "listPets" },
      },
      {
        id: "createPet",
        name: "POST /pets",
        metadata: { type: "operation", method: "post", path: "/pets", operationId: "createPet" },
      },
      {
        id: "getPetById",
        name: "GET /pets/{petId}",
        metadata: { type: "operation", method: "get", path: "/pets/{petId}", operationId: "getPetById" },
      },
      {
        id: "updatePet",
        name: "PUT /pets/{petId}",
        metadata: { type: "operation", method: "put", path: "/pets/{petId}", operationId: "updatePet" },
      },
      {
        id: "deletePet",
        name: "DELETE /pets/{petId}",
        metadata: { type: "operation", method: "delete", path: "/pets/{petId}", operationId: "deletePet" },
      },
    ],
  },
  {
    id: "users",
    name: "Users",
    metadata: { type: "tag" },
    children: [
      {
        id: "listUsers",
        name: "GET /users",
        metadata: { type: "operation", method: "get", path: "/users", operationId: "listUsers" },
      },
      {
        id: "getUserById",
        name: "GET /users/{userId}",
        metadata: { type: "operation", method: "get", path: "/users/{userId}", operationId: "getUserById" },
      },
    ],
  },
  {
    id: "store",
    name: "Store",
    metadata: { type: "tag" },
    children: [
      {
        id: "inventory",
        name: "GET /store/inventory",
        metadata: { type: "operation", method: "get", path: "/store/inventory", operationId: "getInventory" },
      },
      {
        id: "order",
        name: "POST /store/order",
        metadata: { type: "operation", method: "post", path: "/store/order", operationId: "placeOrder" },
      },
    ],
  },
];

export function TreeDemo() {
  const [selected, setSelected] = useState<string>("");

  const controls = useMemo(
    () => (
      <VStack gap={4} align="stretch">
        <Text fontSize="sm" color="fg.muted">
          A navigation tree built with <Text as="code" fontSize="xs">@powerduck/tree/react</Text>.
          Search, expand/collapse, and click operations to select them.
        </Text>
        <Box p={3} bg="bg.panel" borderRadius="md" border="1px solid" borderColor="border">
          <Text fontSize="xs" fontWeight="600" mb={1}>Selected</Text>
          <Text fontSize="sm" fontFamily="mono" color="fg.muted">
            {selected || "None"}
          </Text>
        </Box>
      </VStack>
    ),
    [selected],
  );

  const preview = useMemo(
    () => (
      <Box h="full" border="1px solid" borderColor="border" borderRadius="md" p={2} bg="bg.panel">
        <Tree
          nodes={sampleNodes}
          searchable
          defaultExpandDepth={2}
          showExpandAll
          onSelect={(node) => setSelected(`${node.metadata?.method?.toUpperCase()} ${node.metadata?.path} (${node.metadata?.operationId})`)}
        />
      </Box>
    ),
    [],
  );

  return <DemoLayout meta={META} controls={controls} preview={preview} />;
}
