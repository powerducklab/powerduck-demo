import { Badge, Box, Code, Heading, HStack, Link, Text, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { DemoMeta } from "../types";

interface DemoPageProps {
  meta: DemoMeta;
  children: ReactNode;
}

/**
 * Base template for every demo page.
 * Renders a consistent header with package name, version badge,
 * description, and docs link, then the demo-specific content below.
 */
export function DemoPage({ meta, children }: DemoPageProps) {
  return (
    <VStack gap={6} align="stretch" w="full">
      {/* Page header */}
      <Box>
        <HStack gap={3} mb={2} flexWrap="wrap">
          <Heading size="lg" fontWeight="700" letterSpacing="tight">
            {meta.name}
          </Heading>
          <Badge size="sm" variant="subtle" colorPalette="blue">
            v{meta.version}
          </Badge>
          <Code fontSize="xs" px={2} py={0.5} color="fg.muted">
            {meta.packageName}
          </Code>
        </HStack>
        <Text fontSize="sm" color="fg.muted" maxW="3xl" lineHeight="1.6">
          {meta.longDescription}
        </Text>
        {meta.docsUrl && (
          <Link
            href={meta.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            fontSize="xs"
            color="blue.500"
            mt={1}
            _hover={{ textDecoration: "underline" }}
          >
            View documentation &rarr;
          </Link>
        )}
      </Box>

      {/* Demo content */}
      {children}
    </VStack>
  );
}
