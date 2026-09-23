import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { getAllDemos } from "../registry/demoRegistry";
import { GlobalHeader } from "./GlobalHeader";
import type { DemoEntry } from "../types";

interface LayoutProps {
  children: ReactNode;
}

const CATEGORY_ORDER = ["Converters", "Codegen", "Editors", "Config", "UI Components"] as const;

/**
 * Application shell: a global cross-product header on top, then a row with the
 * left sidebar (grouped by category) and the main content. Clean, tool-focused
 * layout inspired by Stripe / Vercel dashboards.
 */
export function Layout({ children }: LayoutProps) {
  const demos = getAllDemos();

  // Group demos by category
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: demos.filter((d) => d.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <Flex h="100vh" bg="bg" direction="column" overflow="hidden">
      <GlobalHeader />

      <Flex flex="1" minH={0} align="stretch" overflow="hidden">
        {/* Left Sidebar */}
        <Flex
          as="aside"
          direction="column"
          w={260}
          minW={260}
          bg="bg.panel"
          borderRight="1px solid"
          borderColor="border"
          h="100%"
          overflowY="auto"
        >
          {/* Nav groups */}
          <VStack gap={0} flex="1" py={3} align="stretch">
            {grouped.map((group) => (
              <Box key={group.category} px={2} mb={2}>
                <Text
                  fontSize="10px"
                  fontWeight="600"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                  color="fg.muted"
                  px={3}
                  py={1.5}
                >
                  {group.category}
                </Text>
                <VStack gap={0.5} align="stretch">
                  {group.items.map((demo: DemoEntry) => (
                    <NavLink
                      key={demo.id}
                      to={`/${demo.id}`}
                      className="nav-link"
                      style={({ isActive }) => ({
                        textDecoration: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: isActive ? "600" : "400",
                        color: isActive ? "var(--chakra-colors-fg)" : "var(--chakra-colors-fg-muted)",
                        backgroundColor: isActive ? "var(--chakra-colors-bg-emphasized)" : "transparent",
                        transition: "all 0.15s ease",
                      })}
                    >
                      {demo.name}
                    </NavLink>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>

          {/* Bottom links */}
          <VStack gap={0} px={4} py={3} borderTop="1px solid" borderColor="border" align="stretch">
            <Link
              href="https://www.powerduck.com/docs/overview/introduction"
              target="_blank" rel="noopener noreferrer"
              fontSize="sm" color="fg.muted" px={2} py={1.5}
              _hover={{ color: "fg" }}
            >
              Documentation
            </Link>
            <Link
              href="https://github.com/powerducklab"
              target="_blank" rel="noopener noreferrer"
              fontSize="sm" color="fg.muted" px={2} py={1.5}
              _hover={{ color: "fg" }}
            >
              GitHub
            </Link>
          </VStack>
        </Flex>

        {/* Main Content */}
        <Box as="main" flex="1" minW={0} minH={0} overflow="hidden">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
