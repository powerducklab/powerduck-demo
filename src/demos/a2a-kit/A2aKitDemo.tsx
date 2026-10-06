import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  Badge,
  Box,
  Button,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { DemoLayout } from "../../components/DemoLayout";
import { PanelSection } from "../../components/PanelSection";
import { CodeBlock, JsonBlock } from "../../components/CodeBlock";
import type { DemoMeta } from "../../types";
import {
  A2A_METHODS,
  a2aExample,
  validateA2ARequest,
  buildA2AServerFiles,
  buildA2AServerProject,
  downloadA2AServer,
  canonicalizeA2ACard,
  verifyA2ACard,
  CARD_SCHEMA,
  type A2AVersion,
  type SchemaDescriptor,
} from "@powerduck/a2a-kit";

const META: DemoMeta = {
  id: "a2a-kit",
  name: "A2A Server Kit",
  packageName: "@powerduck/a2a-kit",
  description:
    "Design Agent2Agent requests and Agent Cards, verify JWKS signatures, and scaffold a runnable A2A server",
  longDescription:
    "Build A2A 1.0/0.3 request examples for JSON-RPC, REST and gRPC, design and canonicalize an Agent Card, verify its signature against a pinned public JWKS, and download a runnable A2A server project (JSON-RPC, REST/HTTP+JSON and native gRPC).",
  version: "0.1.0",
  docsUrl: "https://www.powerduck.com/docs/client-protocols/a2a/",
  tags: ["a2a", "agent2agent", "json-rpc", "grpc", "agent-card"],
  category: "Protocols",
};

const schema = CARD_SCHEMA as unknown as SchemaDescriptor;

const BINDINGS: Record<A2AVersion, string[]> = {
  "1.0": ["JSONRPC", "HTTP+JSON", "GRPC"],
  "0.3": ["JSONRPC"],
};

const PROJECT_FILES = [
  "server.mjs",
  "canonicalize.mjs",
  "package.json",
  "agent-card.json",
  "README.md",
];

const selectStyle: CSSProperties = {
  width: "100%",
  fontSize: "13px",
  padding: "6px 8px",
  borderRadius: "6px",
  border: "1px solid var(--chakra-colors-border, #d9d9d9)",
  background: "var(--chakra-colors-bg-panel, #fff)",
  color: "inherit",
};

function effectiveAgentCard(name: string, description: string) {
  const origin = "https://your-agent.example";
  return {
    name,
    description,
    version: "1.0.0",
    defaultInputModes: ["text/plain", "application/json"],
    defaultOutputModes: ["text/plain", "application/json"],
    skills: [
      {
        id: "handle-message",
        name: "Handle message",
        description: "Process a message using the configured business handler",
        tags: ["api"],
      },
    ],
    capabilities: { streaming: true, pushNotifications: false, extendedAgentCard: false },
    supportedInterfaces: [
      { url: `${origin}/rpc`, protocolBinding: "JSONRPC", protocolVersion: "1.0" },
      { url: `${origin}/rest`, protocolBinding: "HTTP+JSON", protocolVersion: "1.0" },
      { url: `${origin}:9998`, protocolBinding: "GRPC", protocolVersion: "1.0" },
    ],
    securitySchemes: { bearer: { httpAuthSecurityScheme: { scheme: "Bearer" } } },
    securityRequirements: [{ schemes: { bearer: { list: [] } } }],
  };
}

export function A2aKitDemo() {
  const [version, setVersion] = useState<A2AVersion>("1.0");
  const [binding, setBinding] = useState("JSONRPC");
  const [method, setMethod] = useState<string>(A2A_METHODS["1.0"][0]);
  const [agentName, setAgentName] = useState("Powerduck Agent");
  const [agentDescription, setAgentDescription] = useState(
    "A2A adapter for an HTTP business handler",
  );
  const [tab, setTab] = useState<"request" | "card" | "server">("request");
  const [serverFile, setServerFile] = useState("server.mjs");
  const [jwksText, setJwksText] = useState("");
  const [verifyResult, setVerifyResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [downloadError, setDownloadError] = useState("");

  const config = useMemo(
    () => ({ version, binding, method }),
    [version, binding, method],
  );

  const example = useMemo(() => {
    try {
      return { value: a2aExample(config), error: "" };
    } catch (cause) {
      return { value: null, error: cause instanceof Error ? cause.message : String(cause) };
    }
  }, [config]);

  const validation = useMemo(() => {
    if (!example.value) return { ok: false, text: example.error };
    try {
      const result = validateA2ARequest(example.value, config);
      return {
        ok: true,
        text: `Valid A2A ${result.version} · ${binding} · ${result.streaming ? "streaming" : "unary"}`,
      };
    } catch (cause) {
      return { ok: false, text: cause instanceof Error ? cause.message : String(cause) };
    }
  }, [example, config, binding]);

  const files = useMemo(
    () => buildA2AServerFiles(agentName || "Powerduck Agent"),
    [agentName],
  );
  const archiveSize = useMemo(
    () => buildA2AServerProject(agentName || "Powerduck Agent").archive.byteLength,
    [agentName],
  );

  const card = useMemo(
    () => effectiveAgentCard(agentName || "Powerduck Agent", agentDescription),
    [agentName, agentDescription],
  );
  const canonical = useMemo(() => {
    try {
      return { value: canonicalizeA2ACard(card, schema), error: "" };
    } catch (cause) {
      return { value: "", error: cause instanceof Error ? cause.message : String(cause) };
    }
  }, [card]);

  const changeVersion = (next: A2AVersion) => {
    setVersion(next);
    setBinding("JSONRPC");
    setMethod(A2A_METHODS[next][0]);
  };

  const changeBinding = (next: string) => {
    setBinding(next);
  };

  const runVerify = async () => {
    try {
      const result = await verifyA2ACard(card, jwksText);
      setVerifyResult({
        ok: true,
        text: `Verified · ${result.algorithm} · key ${result.kid}`,
      });
    } catch (cause) {
      setVerifyResult({
        ok: false,
        text: cause instanceof Error ? cause.message : String(cause),
      });
    }
  };

  const download = () => {
    setDownloadError("");
    try {
      downloadA2AServer(agentName || "Powerduck Agent");
    } catch (cause) {
      setDownloadError(cause instanceof Error ? cause.message : String(cause));
    }
  };

  const controls = (
    <VStack gap={4} align="stretch">
      <PanelSection title="Protocol" subtitle="A2A 1.0 and 0.3 are not wire compatible.">
        <VStack gap={3} align="stretch" mt={1}>
          <Box w="full">
            <Text fontSize="xs" fontWeight="600" mb={1}>
              Version
            </Text>
            <select
              aria-label="A2A version"
              style={selectStyle}
              value={version}
              onChange={(event) => changeVersion(event.target.value as A2AVersion)}
            >
              <option value="1.0">A2A 1.0</option>
              <option value="0.3">A2A 0.3</option>
            </select>
          </Box>
          <Box w="full">
            <Text fontSize="xs" fontWeight="600" mb={1}>
              Binding
            </Text>
            <select
              aria-label="A2A binding"
              style={selectStyle}
              value={binding}
              onChange={(event) => changeBinding(event.target.value)}
            >
              {BINDINGS[version].map((item) => (
                <option key={item} value={item}>
                  {item === "HTTP+JSON" ? "REST · HTTP + JSON" : item}
                </option>
              ))}
            </select>
          </Box>
          <Box w="full">
            <Text fontSize="xs" fontWeight="600" mb={1}>
              Method
            </Text>
            <select
              aria-label="A2A method"
              style={selectStyle}
              value={method}
              onChange={(event) => setMethod(event.target.value)}
            >
              {A2A_METHODS[version].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Box>
          <Box>
            <Badge colorPalette={validation.ok ? "green" : "red"} variant="subtle">
              {validation.text}
            </Badge>
          </Box>
        </VStack>
      </PanelSection>

      <PanelSection title="Agent Card" subtitle="Public discovery metadata.">
        <VStack gap={3} align="stretch" mt={1}>
          <Box w="full">
            <Text fontSize="xs" fontWeight="600" mb={1}>
              Agent name
            </Text>
            <Input size="sm" value={agentName} onChange={(e) => setAgentName(e.target.value)} />
          </Box>
          <Box w="full">
            <Text fontSize="xs" fontWeight="600" mb={1}>
              Description
            </Text>
            <Input
              size="sm"
              value={agentDescription}
              onChange={(e) => setAgentDescription(e.target.value)}
            />
          </Box>
        </VStack>
      </PanelSection>

      <PanelSection title="Runnable server" subtitle="JSON-RPC, REST and native gRPC.">
        <VStack gap={2} align="stretch" mt={1}>
          <Button size="sm" colorPalette="blue" onClick={download}>
            Download powerduck-a2a-server.tar
          </Button>
          <Text fontSize="2xs" color="fg.muted" lineHeight="1.5">
            Archive {(archiveSize / 1024).toFixed(1)} KB. Node 22+, then set{" "}
            <code>A2A_TOKEN</code> (32+ chars) and <code>HANDLER_URL</code>, run{" "}
            <code>npm install &amp;&amp; npm start</code>.
          </Text>
          {downloadError && (
            <Text fontSize="xs" color="red.500">
              {downloadError}
            </Text>
          )}
        </VStack>
      </PanelSection>

      <PanelSection title="Verify signature" subtitle="Pin the agent public JWKS out of band.">
        <VStack gap={2} align="stretch" mt={1}>
          <Textarea
            size="sm"
            aria-label="Trusted public JWKS"
            placeholder={'{"keys":[{"kid":"...","kty":"EC",...}]}'}
            value={jwksText}
            onChange={(e) => setJwksText(e.target.value)}
            rows={5}
            fontFamily="mono"
            fontSize="xs"
          />
          <Button size="sm" variant="outline" onClick={() => void runVerify()} disabled={!jwksText.trim()}>
            Verify Agent Card
          </Button>
          {verifyResult && (
            <Badge colorPalette={verifyResult.ok ? "green" : "red"} variant="subtle">
              {verifyResult.text}
            </Badge>
          )}
        </VStack>
      </PanelSection>
    </VStack>
  );

  const fileLanguage =
    serverFile.endsWith(".json")
      ? "json"
      : serverFile.endsWith(".md")
        ? "markdown"
        : "javascript";

  const preview = (
    <VStack gap={3} h="full" align="stretch">
      <HStack gap={2}>
        {([
          ["request", "Request"],
          ["card", "Agent Card"],
          ["server", "Server project"],
        ] as const).map(([key, label]) => (
          <Button
            key={key}
            size="xs"
            variant={tab === key ? "solid" : "outline"}
            colorPalette={tab === key ? "blue" : "gray"}
            onClick={() => setTab(key)}
          >
            {label}
          </Button>
        ))}
      </HStack>

      {tab === "request" && (
        <VStack gap={3} align="stretch" flex="1" minH={0}>
          {example.error ? (
            <Box p={3} borderRadius="md" bg="red.50" color="red.700" fontSize="sm">
              {example.error}
            </Box>
          ) : (
            <JsonBlock
              data={example.value}
              title={`${method} · ${binding}${binding === "JSONRPC" ? " (JSON-RPC 2.0 envelope)" : " (bare params)"}`}
              maxHeight="calc(100vh - 220px)"
            />
          )}
          <Text fontSize="xs" color="fg.muted">
            {version === "0.3"
              ? "Legacy 0.3 uses lowercase methods, the user role and { kind: 'text' } parts."
              : "A2A 1.0 uses ROLE_USER roles and { text } parts. REST and gRPC drop the JSON-RPC envelope."}
          </Text>
        </VStack>
      )}

      {tab === "card" && (
        <VStack gap={3} align="stretch" flex="1" minH={0} overflowY="auto">
          <JsonBlock data={card} title="Effective Agent Card (signed shape)" maxHeight="300px" />
          {canonical.error ? (
            <Box p={3} borderRadius="md" bg="red.50" color="red.700" fontSize="sm">
              {canonical.error}
            </Box>
          ) : (
            <CodeBlock
              code={canonical.value}
              language="text"
              title="RFC 8785 canonical form (JCS, what gets signed)"
              maxHeight="300px"
            />
          )}
        </VStack>
      )}

      {tab === "server" && (
        <VStack gap={3} align="stretch" flex="1" minH={0}>
          <HStack gap={1.5} flexWrap="wrap">
            {PROJECT_FILES.map((name) => (
              <Button
                key={name}
                size="xs"
                variant={serverFile === name ? "solid" : "outline"}
                colorPalette={serverFile === name ? "blue" : "gray"}
                fontFamily="mono"
                onClick={() => setServerFile(name)}
              >
                {name}
              </Button>
            ))}
          </HStack>
          <CodeBlock
            code={files[serverFile]}
            language={fileLanguage}
            title={serverFile}
            maxHeight="calc(100vh - 230px)"
          />
        </VStack>
      )}
    </VStack>
  );

  return <DemoLayout meta={META} controls={controls} preview={preview} />;
}
