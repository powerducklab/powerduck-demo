import { useCallback, useState } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";

interface MonacoCodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  height?: string;
}

/**
 * Read-only Monaco editor wrapper for displaying generated code.
 * Full syntax highlighting, no artificial height cap, copy-to-clipboard.
 * Fills its container; parent controls the layout height.
 */
export function MonacoCodeBlock({
  code,
  language = "plaintext",
  title,
  height = "100%",
}: MonacoCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }, [code]);

  return (
    <Box
      h="full"
      display="flex"
      flexDirection="column"
      borderWidth="1px"
      borderColor="border"
      borderRadius="md"
      overflow="hidden"
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
    >
      <HStack
        justify="space-between"
        px={3}
        py={1.5}
        borderBottomWidth="1px"
        borderColor="border"
        bg="bg.panel"
        flexShrink={0}
      >
        <HStack gap={2}>
          {title && (
            <Text fontSize="xs" fontWeight="500" color="fg.muted">
              {title}
            </Text>
          )}
          <Text fontSize="xs" color="fg.muted" fontFamily="mono" opacity={0.55}>
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
          px={2}
          py={0.5}
          borderRadius="sm"
          transition="color 0.15s ease"
        >
          {copied ? "Copied" : "Copy"}
        </Box>
      </HStack>

      <Box flex="1" minH={0}>
        <Editor
          height={height}
          language={mapLanguage(language)}
          value={code}
          theme="light"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 12.5,
            lineHeight: 1.6,
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            fontLigatures: false,
            scrollBeyondLastLine: false,
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              useShadows: false,
            },
            padding: { top: 10, bottom: 10 },
            renderLineHighlight: "none",
            renderWhitespace: "none",
            smoothScrolling: true,
            cursorBlinking: "solid",
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            automaticLayout: true,
            wordWrap: "off",
          }}
        />
      </Box>
    </Box>
  );
}

/**
 * Map common language identifiers to Monaco language IDs.
 */
function mapLanguage(lang: string): string {
  const lower = lang.toLowerCase().trim();
  const aliases: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    rb: "ruby",
    cs: "csharp",
    fs: "fsharp",
    sh: "shell",
    bash: "shell",
    zsh: "shell",
    yml: "yaml",
    md: "markdown",
    golang: "go",
    cplusplus: "cpp",
    "c++": "cpp",
    "c#": "csharp",
    "objective-c": "objective-c",
    pl: "perl",
    php: "php",
    r: "r",
    rs: "rust",
    scala: "scala",
    swift: "swift",
    kt: "kotlin",
    dart: "dart",
    lua: "lua",
    sql: "sql",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    less: "less",
    json: "json",
    xml: "xml",
    toml: "ini",
    ini: "ini",
    dockerfile: "dockerfile",
    graphql: "graphql",
    proto: "proto",
    diff: "diff",
    plain: "plaintext",
    text: "plaintext",
    "": "plaintext",
  };
  return aliases[lower] ?? lower;
}
