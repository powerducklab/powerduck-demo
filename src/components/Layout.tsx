import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react";
import { NavLink, Link as RouterLink } from "react-router-dom";
import type { ReactNode } from "react";
import { getAllDemos } from "../registry/demoRegistry";
import { Logo } from "./Logo";
import type { DemoEntry } from "../types";

interface LayoutProps {
  children: ReactNode;
}

const CATEGORY_ORDER = ["Converters", "Codegen", "Editors", "Config", "UI Components"] as const;

/**
 * Application shell: left sidebar grouped by category + main content.
 * Clean, tool-focused layout inspired by Stripe / Vercel dashboards.
 */
export function Layout({ children }: LayoutProps) {
  const demos = getAllDemos();

  // Group demos by category
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: demos.filter((d) => d.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <Flex h="100vh" bg="bg" align="stretch" overflow="hidden">
      {/* Left Sidebar */}
      <Flex
        as="aside"
        direction="column"
        w={260}
        minW={260}
        bg="bg.panel"
        borderRight="1px solid"
        borderColor="border"
        position="sticky"
        top={0}
        h="100vh"
        overflowY="auto"
      >
        {/* Logo */}
        <RouterLink to="/" style={{ textDecoration: "none" }}>
          <Flex align="center" gap={2} px={5} py={4} borderBottom="1px solid" borderColor="border">
            <Logo size={22} />
            <Text fontSize="md" fontWeight="700" color="fg" letterSpacing="tight">
              PowerDuck
            </Text>
          </Flex>
        </RouterLink>

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
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: isActive ? "600" : "400",
                      color: isActive ? "#006adc" : "var(--chakra-colors-fg-muted)",
                      backgroundColor: isActive ? "rgba(0, 106, 220, 0.08)" : "transparent",
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
            href="https://www.powerduck.com/docs/getting-started/introduction"
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
      <Box as="main" flex="1" overflow="hidden" minW={0} h="100vh">
        {children}
      </Box>
    </Flex>
  );
}
