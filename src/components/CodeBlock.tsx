import { useState } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  maxHeight?: string;
  showLineNumbers?: boolean;
}

/**
 * Lightweight code block with syntax-aware styling and copy button.
 * Uses monospace font and subtle background for a production-grade look.
 */
export function CodeBlock({
  code,
  language = "text",
  title,
  maxHeight = "400px",
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="md"
      overflow="hidden"
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
    >
      {/* Header bar */}
      <HStack
        justify="space-between"
        px={3}
        py={2}
        borderBottomWidth="1px"
        borderColor="border"
        bg="bg.panel"
      >
        <HStack gap={2}>
          {title && (
            <Text fontSize="xs" fontWeight="500" color="fg.muted">
              {title}
            </Text>
          )}
          <Text fontSize="xs" color="fg.muted" fontFamily="mono" opacity={0.6}>
            {language}
          </Text>
        </HStack>
        <Box
          as="button"
          onClick={handleCopy}
          fontSize="xs"
          color="fg.muted"
          _hover={{ color: "fg" }}
          cursor="pointer"
          bg="transparent"
          border="none"
          p={1}
          borderRadius="sm"
        >
          {copied ? "Copied!" : "Copy"}
        </Box>
      </HStack>

      {/* Code content */}
      <Box
        overflow="auto"
        maxH={maxHeight}
        css={{
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "var(--chakra-colors-border)",
            borderRadius: "3px",
          },
        }}
      >
        <Box
          as="pre"
          m={0}
          p={3}
          fontFamily="mono"
          fontSize="xs"
          lineHeight="1.6"
          color="fg"
          whiteSpace="pre"
        >
          {showLineNumbers ? (
            <HStack gap={3} align="flex-start">
              <Box
                as="code"
                color="fg.muted"
                opacity={0.5}
                userSelect="none"
                textAlign="right"
                minW="2em"
              >
                {lines.map((_, i) => (
                  <Box key={i}>{i + 1}</Box>
                ))}
              </Box>
              <Box as="code">{code}</Box>
            </HStack>
          ) : (
            <Box as="code">{code}</Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

/**
 * JSON-specific code block with pretty-printing.
 */
export function JsonBlock({
  data,
  title = "JSON",
  maxHeight = "400px",
}: {
  data: unknown;
  title?: string;
  maxHeight?: string;
}) {
  const json = JSON.stringify(data, null, 2);
  return <CodeBlock code={json} language="json" title={title} maxHeight={maxHeight} />;
}
