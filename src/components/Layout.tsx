import { Box, Flex, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { NavLink, Link as RouterLink } from "react-router-dom";
import type { ReactNode } from "react";
import { getAllDemos } from "../registry/demoRegistry";
import { Logo } from "./Logo";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Application shell: top navbar + main content + footer.
 * Clean, production-grade layout inspired by developer tool sites.
 */
export function Layout({ children }: LayoutProps) {
  const demos = getAllDemos();

  return (
    <VStack gap={0} minH="100vh" bg="bg" align="stretch">
      {/* Top Navigation Bar */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={6}
        py={2.5}
        bg="bg.panel"
        borderBottom="1px solid"
        borderColor="border"
        position="sticky"
        top={0}
        zIndex={100}
        backdropFilter="blur(8px)"
      >
        {/* Left: Logo + Demos */}
        <HStack gap={8}>
          <RouterLink to="/" style={{ textDecoration: "none" }}>
            <HStack gap={2}>
              <Logo size={22} />
              <Text fontSize="md" fontWeight="700" color="fg" letterSpacing="tight">
                PowerDuck
              </Text>
            </HStack>
          </RouterLink>

          <HStack gap={0.5}>
            {demos.map((demo) => (
              <NavLink
                key={demo.id}
                to={`/${demo.id}`}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  padding: "5px 10px",
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
          </HStack>
        </HStack>

        {/* Right: Docs + GitHub */}
        <HStack gap={3}>
          <Link
            href="https://www.powerduck.com/docs/getting-started/introduction"
            target="_blank" rel="noopener noreferrer"
            fontSize="sm"
            color="fg.muted"
            _hover={{ color: "fg" }}
            transition="color 0.15s ease"
          >
            Docs
          </Link>
          <Link
            href="https://github.com/PowerDuckie"
            target="_blank" rel="noopener noreferrer"
            fontSize="sm"
            color="fg.muted"
            _hover={{ color: "fg" }}
            transition="color 0.15s ease"
          >
            GitHub
          </Link>
        </HStack>
      </Flex>

      {/* Main Content */}
      <Box as="main" flex="1" overflow="hidden">
        {children}
      </Box>

      {/* Footer */}
      <Flex
        as="footer"
        align="center"
        justify="space-between"
        px={6}
        py={4}
        bg="bg.panel"
        borderTop="1px solid"
        borderColor="border"
      >
        <Text fontSize="xs" color="fg.muted">
          © {new Date().getFullYear()} POWERDUCK LIMITED. All rights reserved.
        </Text>
        <HStack gap={4}>
          <Link
            href="https://www.powerduck.com/privacy.html"
            target="_blank" rel="noopener noreferrer"
            fontSize="xs"
            color="fg.muted"
            _hover={{ color: "fg" }}
          >
            Privacy
          </Link>
          <Link
            href="https://www.powerduck.com/terms.html"
            target="_blank" rel="noopener noreferrer"
            fontSize="xs"
            color="fg.muted"
            _hover={{ color: "fg" }}
          >
            Terms
          </Link>
          <Link
            href="https://github.com/PowerDuckie"
            target="_blank" rel="noopener noreferrer"
            fontSize="xs"
            color="fg.muted"
            _hover={{ color: "fg" }}
          >
            GitHub
          </Link>
        </HStack>
      </Flex>
    </VStack>
  );
}
