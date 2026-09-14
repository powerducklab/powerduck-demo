import { Box, HStack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface PanelSectionProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}

/**
 * Compact section header used inside demo panels.
 * Provides consistent visual hierarchy with a subtle uppercase label
 * and an optional right-aligned control.
 */
export function PanelSection({ title, subtitle, right, children }: PanelSectionProps) {
  return (
    <Box>
      <HStack justify="space-between" align="flex-end" mb={2}>
        <Box>
          <Text
            fontSize="10.5px"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.07em"
            color="fg.muted"
            lineHeight={1.2}
          >
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="xs" color="fg.muted" mt={0.5} opacity={0.75}>
              {subtitle}
            </Text>
          )}
        </Box>
        {right}
      </HStack>
      {children}
    </Box>
  );
}
