import { Box, Card, Heading, Text, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  /** Optional right-side element (e.g. a badge or action button). */
  headerRight?: ReactNode;
}

/**
 * A consistent card wrapper used for each section of a demo page.
 * Provides a title, optional description, and padded content area.
 */
export function SectionCard({ title, description, children, headerRight }: SectionCardProps) {
  return (
    <Card.Root w="full" variant="outline" bg="bg.panel" shadow="sm">
      <Card.Header pb={2}>
        <VStack gap={1} align="stretch">
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={3}>
            <Heading size="sm" fontWeight="600">
              {title}
            </Heading>
            {headerRight}
          </Box>
          {description && (
            <Text fontSize="xs" color="fg.muted" lineHeight="1.5">
              {description}
            </Text>
          )}
        </VStack>
      </Card.Header>
      <Card.Body pt={2}>{children}</Card.Body>
    </Card.Root>
  );
}
