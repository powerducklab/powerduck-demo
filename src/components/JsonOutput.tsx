import { useState } from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";

interface JsonOutputProps {
  /** The JSON-serializable value to display. */
  data: unknown;
  /** Optional title shown above the code block. */
  title?: string;
  /** Max height before scrolling. */
  maxHeight?: string;
}

/**
 * Displays a JSON value with formatting and a copy button.
 * Uses navigator.clipboard for copy-to-clipboard functionality.
 */
export function JsonOutput({ data, title = "Generated Config JSON", maxHeight = "400px" }: JsonOutputProps) {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = jsonString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <VStack gap={3} align="stretch" w="full">
      <HStack justify="space-between">
        <Text fontSize="sm" fontWeight="600" color="fg.muted">
          {title}
        </Text>
        <Button size="sm" variant="outline" colorPalette="gray" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy JSON"}
        </Button>
      </HStack>
      <Box
        bg="bg.muted"
        borderRadius="md"
        p={4}
        overflow="auto"
        maxHeight={maxHeight}
      >
        <Text as="pre" fontSize="xs" lineHeight="1.6" fontFamily="mono" whiteSpace="pre" m={0}>
          {jsonString}
        </Text>
      </Box>
    </VStack>
  );
}
