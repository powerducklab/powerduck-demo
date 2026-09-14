import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { getAllDemos } from "../registry/demoRegistry";

/**
 * Left sidebar with app branding and demo navigation.
 * Uses NavLink for active-state styling.
 */
export function Sidebar() {
  const demos = getAllDemos();

  return (
    <VStack
      gap={0}
      w="260px"
      minW="260px"
      h="100vh"
      bg="bg.panel"
      borderRight="1px solid"
      borderColor="border"
      position="sticky"
      top={0}
      overflowY="auto"
    >
      {/* Brand */}
      <Box px={5} py={5} w="full" borderBottom="1px solid" borderColor="border">
        <HStack gap={2}>
          <Box
            w="8"
            h="8"
            borderRadius="md"
            bgGradient="to-br"
            gradientFrom="blue.500"
            gradientTo="purple.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="sm" fontWeight="800" color="white">
              P
            </Text>
          </Box>
          <VStack gap={0} align="start">
            <Heading size="sm" fontWeight="700" letterSpacing="tight">
              PowerDuck
            </Heading>
            <Text fontSize="2xs" color="fg.muted">
              Library Playground
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Nav label */}
      <Box px={5} pt={4} pb={2} w="full">
        <Text fontSize="2xs" fontWeight="600" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
          Demos
        </Text>
      </Box>

      {/* Demo links */}
      <VStack gap={0.5} w="full" px={2} pb={4}>
        {demos.map((demo) => (
          <NavLink
            key={demo.id}
            to={`/${demo.id}`}
            style={{ textDecoration: "none", width: "100%" }}
          >
            {({ isActive }) => (
              <Box
                px={3}
                py={2.5}
                borderRadius="md"
                cursor="pointer"
                transition="all 0.15s ease"
                bg={isActive ? "blue.50" : "transparent"}
                _hover={{ bg: isActive ? "blue.50" : "bg.muted" }}
                borderLeft="3px solid"
                borderColor={isActive ? "blue.500" : "transparent"}
              >
                <Text fontSize="sm" fontWeight={isActive ? "600" : "400"} color={isActive ? "blue.600" : "fg"}>
                  {demo.name}
                </Text>
                <Text fontSize="2xs" color="fg.muted" mt={0.5} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                  {demo.description}
                </Text>
              </Box>
            )}
          </NavLink>
        ))}
      </VStack>

      {/* Footer */}
      <Box px={5} py={4} w="full" mt="auto" borderTop="1px solid" borderColor="border">
        <Text fontSize="2xs" color="fg.muted">
          Built with Chakra UI 3.36.1
        </Text>
        <Text fontSize="2xs" color="fg.muted">
          React + TypeScript + Vite
        </Text>
      </Box>
    </VStack>
  );
}
