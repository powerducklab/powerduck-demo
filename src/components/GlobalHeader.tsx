import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Drawer,
  Flex,
  IconButton,
  Menu,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Logo } from "./Logo";

/**
 * Global top header for the demo playground.
 * Presents the same cross-product information architecture as the website,
 * docs and cloud surfaces so users can move between the client, cloud,
 * pricing and resources from any demo. The left sidebar keeps the
 * demo-specific navigation. On narrow screens the cross-product links move
 * into a left drawer.
 */

// The demo is served from the same origin as the website and Cloud app, so
// internal cross-product links use root-relative paths and share the session.
const ORIGIN = "";
const GITHUB_ORG = "https://github.com/powerducklab";

type NavEntry = {
  label: string;
  description?: string;
  to?: string;
  href?: string;
};

const CLIENT_ENTRIES: NavEntry[] = [
  { label: "Spec Editor", description: "Design OpenAPI in place", href: `${ORIGIN}/#spec-editor` },
  { label: "API Debug", description: "Send requests and inspect responses", href: `${ORIGIN}/#api-debug` },
  { label: "MCP Server", description: "Turn a spec into callable tools", href: `${ORIGIN}/#mcp-server` },
  { label: "API Docs", description: "Render documentation from the same spec", href: `${ORIGIN}/#api-docs` },
];

function buildCloudEntries(signedIn: boolean): NavEntry[] {
  const accountEntry: NavEntry = signedIn
    ? {
        label: "Console",
        description: "Open your Cloud console",
        href: `${ORIGIN}/console`,
      }
    : {
        label: "Sign in",
        description: "Open the Cloud console",
        href: `${ORIGIN}/signin`,
      };
  return [
    { label: "Hub", description: "Browse public docs and MCP servers", href: `${ORIGIN}/hub` },
    { label: "Cloud Docs", description: "Hosting, access control, and domains", href: `${ORIGIN}/docs/cloud/introduction` },
    accountEntry,
  ];
}

const RESOURCE_ENTRIES: NavEntry[] = [
  { label: "Documentation", description: "Guides and API references", href: `${ORIGIN}/docs/overview/introduction` },
  { label: "Live Demo", description: "Try every tool in the browser", to: "/" },
  { label: "Open Source", description: "Libraries on GitHub and npm", href: GITHUB_ORG },
];

const THEME_STORAGE_KEY = "pd_demo_theme";

function getInitialDark(): boolean {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored) return stored === "dark";
  return document.documentElement.classList.contains("dark");
}

function useThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(getInitialDark);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((value) => !value) };
}

// Shares the same-origin session with the website and Cloud app. Defaults to
// signed out so the header is correct even if the request fails.
function useSession(): boolean {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && data && data.user) {
          setSignedIn(true);
        }
      })
      .catch(() => {
        /* Signed out is the safe default. */
      });
    return () => {
      active = false;
    };
  }, []);

  return signedIn;
}

function MenuIcon(): React.ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function ChevronDown(): React.ReactNode {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function EntryBody({ label, description }: { label: string; description?: string }) {
  return (
    <Box display="flex" flexDirection="column" textAlign="left" lineHeight="1.3">
      <Text fontSize="sm" fontWeight={600} color="fg">
        {label}
      </Text>
      {description ? (
        <Text fontSize="xs" color="fg.muted" mt={0.5}>
          {description}
        </Text>
      ) : null}
    </Box>
  );
}

function NavDropdown({ label, entries }: { label: string; entries: NavEntry[] }) {
  const navigate = useNavigate();

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          px={2}
          gap={1}
          fontSize="sm"
          fontWeight={500}
          color="fg.muted"
          _hover={{ color: "fg" }}
        >
          {label}
          <ChevronDown />
        </Button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content minW="280px" boxShadow="lg">
          {entries.map((entry) => {
            const body = <EntryBody label={entry.label} description={entry.description} />;

            if (entry.to) {
              return (
                <Menu.Item
                  key={entry.label}
                  value={entry.label}
                  px={2.5}
                  py={2}
                  onClick={() => navigate(entry.to as string)}
                >
                  {body}
                </Menu.Item>
              );
            }

            return (
              <Menu.Item key={entry.label} value={entry.label} px={2.5} py={2} asChild>
                <a href={entry.href} target="_blank" rel="noopener noreferrer">
                  {body}
                </a>
              </Menu.Item>
            );
          })}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}

function MobileSection({
  title,
  entries,
  onNavigate,
}: {
  title: string;
  entries: NavEntry[];
  onNavigate: (entry: NavEntry) => void;
}) {
  return (
    <Stack gap={1}>
      <Text
        fontSize="xs"
        fontWeight={700}
        color="fg.subtle"
        textTransform="uppercase"
        letterSpacing="0.06em"
        px={1}
      >
        {title}
      </Text>
      {entries.map((entry) => (
        <Button
          key={entry.label}
          variant="ghost"
          size="sm"
          justifyContent="flex-start"
          textAlign="left"
          onClick={() => onNavigate(entry)}
        >
          <Stack gap={0} alignItems="flex-start">
            <Text fontSize="sm">{entry.label}</Text>
            {entry.description ? (
              <Text fontSize="xs" color="fg.muted">
                {entry.description}
              </Text>
            ) : null}
          </Stack>
        </Button>
      ))}
    </Stack>
  );
}

function GitHubIcon(): React.ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function GlobalHeader(): React.ReactNode {
  const navigate = useNavigate();
  const { isDark, toggle } = useThemeToggle();
  const signedIn = useSession();
  const cloudEntries = buildCloudEntries(signedIn);
  const [menuOpen, setMenuOpen] = useState(false);
  const themeLabel = isDark ? "Switch to light theme" : "Switch to dark theme";

  function handleMobileEntry(entry: NavEntry): void {
    setMenuOpen(false);
    if (entry.to) {
      navigate(entry.to);
    } else if (entry.href) {
      window.open(entry.href, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        h="52px"
        px={{ base: 2, md: 4 }}
        flexShrink={0}
        bg="bg"
        borderBottom="1px solid"
        borderColor="border"
      >
        <Flex align="center" gap={1} minW={0}>
          <Button
            variant="ghost"
            size="sm"
            px={2}
            display={{ base: "inline-flex", md: "none" }}
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            gap={2}
            px={2}
            fontWeight={700}
            fontSize="md"
            _hover={{ bg: "bg.subtle" }}
          >
            <RouterLink to="/">
              <Logo size={22} />
              <Text color="fg">Powerduck</Text>
              <Text color="fg.muted" fontWeight={600}>
                Demo
              </Text>
            </RouterLink>
          </Button>
          <Box display={{ base: "none", md: "flex" }} ml={2}>
            <NavDropdown label="Client" entries={CLIENT_ENTRIES} />
            <NavDropdown label="Cloud" entries={cloudEntries} />
            <Button
              asChild
              variant="ghost"
              size="sm"
              px={2}
              fontSize="sm"
              fontWeight={500}
              color="fg.muted"
              _hover={{ color: "fg" }}
            >
              <a href={`${ORIGIN}/#licensing`} target="_blank" rel="noopener noreferrer">
                Pricing
              </a>
            </Button>
            <NavDropdown label="Resources" entries={RESOURCE_ENTRIES} />
          </Box>
        </Flex>

        <Flex align="center" gap={1} flexShrink={0}>
          <IconButton
            asChild
            variant="ghost"
            size="sm"
            aria-label="GitHub organization"
          >
            <a href={GITHUB_ORG} target="_blank" rel="noopener noreferrer">
              <GitHubIcon />
            </a>
          </IconButton>
          <IconButton variant="ghost" size="sm" aria-label={themeLabel} title={themeLabel} onClick={toggle}>
            {isDark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </IconButton>
          <Button
            asChild
            variant="ghost"
            size="sm"
            px={2}
            display={{ base: "none", sm: "inline-flex" }}
            fontSize="sm"
            fontWeight={500}
            color="fg.muted"
            _hover={{ color: "fg" }}
          >
            <a
              href={signedIn ? `${ORIGIN}/console` : `${ORIGIN}/signin`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {signedIn ? "Console" : "Sign in"}
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            variant="solid"
            bg="fg"
            color="bg"
            px={3}
            ml={1}
            _hover={{ opacity: 0.85 }}
          >
            <a href={GITHUB_ORG} target="_blank" rel="noopener noreferrer">
              Download
            </a>
          </Button>
        </Flex>
      </Flex>

      {/* Mobile navigation drawer, kept outside the header so its portal is not
          clipped by the header height. */}
      <Drawer.Root
        open={menuOpen}
        onOpenChange={(details) => setMenuOpen(details.open)}
        placement="start"
        size="xs"
      >
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>
                <Flex align="center" gap={2}>
                  <Logo size={22} />
                  <Text color="fg" fontWeight={700}>
                    Powerduck
                  </Text>
                  <Text color="fg.muted" fontWeight={600}>
                    Demo
                  </Text>
                </Flex>
              </Drawer.Title>
              <Drawer.CloseTrigger />
            </Drawer.Header>
            <Drawer.Body>
              <Stack gap={5}>
                <MobileSection title="Client" entries={CLIENT_ENTRIES} onNavigate={handleMobileEntry} />
                <Separator />
                <MobileSection title="Cloud" entries={cloudEntries} onNavigate={handleMobileEntry} />
                <Separator />
                <Button
                  variant="ghost"
                  size="sm"
                  justifyContent="flex-start"
                  onClick={() =>
                    handleMobileEntry({
                      label: "Pricing",
                      href: `${ORIGIN}/#licensing`,
                    })
                  }
                >
                  <Text fontSize="sm">Pricing</Text>
                </Button>
                <Separator />
                <MobileSection title="Resources" entries={RESOURCE_ENTRIES} onNavigate={handleMobileEntry} />
              </Stack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
}
