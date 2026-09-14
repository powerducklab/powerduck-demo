import { useEffect } from "react";
import { Box, Badge, Flex, Heading, HStack, Link, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { DemoMeta } from "../types";

interface DemoLayoutProps {
  meta: DemoMeta;
  /** Left panel: parameter controls and input */
  controls: ReactNode;
  /** Right panel: live preview / code output */
  preview: ReactNode;
}

/**
 * Two-column demo layout with a compact header.
 * Left: input and configuration. Right: live output.
 * Each panel has its own scroll region; no artificial height caps on content.
 */
export function DemoLayout({ meta, controls, preview }: DemoLayoutProps) {
  useEffect(() => {
    document.title = `${meta.name} - PowerDuck Interactive Demo`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", meta.longDescription || meta.description);

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: meta.name,
      description: meta.longDescription || meta.description,
      version: meta.version,
      url: meta.docsUrl,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    };

    let script = document.getElementById("ld-json-demo") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script") as HTMLScriptElement;
      script.id = "ld-json-demo";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [meta]);

  return (
    <VStack gap={0} align="stretch" h="calc(100vh - 96px)">
      {/* Compact page header */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={5}
        py={2.5}
        borderBottom="1px solid"
        borderColor="border"
        bg="bg.panel"
        flexShrink={0}
      >
        <HStack gap={2.5} flex="1" minW={0}>
          <Heading as="h1" size="sm" fontWeight="600" letterSpacing="tight" whiteSpace="nowrap">
            {meta.name}
          </Heading>
          <Badge
            size="sm"
            variant="subtle"
            colorPalette="gray"
            fontFamily="mono"
            fontSize="10.5px"
            px={1.5}
            py={0}
          >
            {meta.packageName}
          </Badge>
          <Badge
            size="sm"
            variant="subtle"
            colorPalette="blue"
            fontFamily="mono"
            fontSize="10.5px"
            px={1.5}
            py={0}
          >
            v{meta.version}
          </Badge>
        </HStack>

        <HStack gap={1.5} flexShrink={0}>
          {meta.docsUrl && (
            <Link
              href={meta.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              fontSize="xs"
              color="fg.muted"
              _hover={{ color: "accent" }}
              px={2}
              py={1}
              borderRadius="sm"
              transition="color 0.15s ease"
            >
              Documentation
            </Link>
          )}
          <Link
            href="https://github.com/PowerDuckie"
            target="_blank"
            rel="noopener noreferrer"
            fontSize="xs"
            color="fg.muted"
            _hover={{ color: "fg" }}
            px={2}
            py={1}
            borderRadius="sm"
            transition="color 0.15s ease"
          >
            GitHub
          </Link>
        </HStack>
      </Flex>

      {/* Two-column content area */}
      <Flex flex="1" overflow="hidden" minH={0}>
        {/* Left: Controls */}
        <Box
          as="aside"
          w="380px"
          minW="380px"
          borderRight="1px solid"
          borderColor="border"
          overflowY="auto"
          overflowX="hidden"
          bg="bg.panel"
          css={{
            "&::-webkit-scrollbar": { width: "5px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "var(--chakra-colors-border)",
              borderRadius: "3px",
            },
          }}
        >
          <Box p={4}>{controls}</Box>
        </Box>

        {/* Right: Preview / Output */}
        <Box
          as="main"
          flex="1"
          minW={0}
          overflow="hidden"
          bg="bg"
          display="flex"
          flexDirection="column"
        >
          <Box flex="1" minH={0} p={4}>
            {preview}
          </Box>
        </Box>
      </Flex>
    </VStack>
  );
}
