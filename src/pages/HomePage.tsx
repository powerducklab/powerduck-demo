import { useEffect } from "react";
import { Badge, Box, Card, Grid, Heading, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { getAllDemos } from "../registry/demoRegistry";

/**
 * Home / landing page. Shows a clean grid of available library demos.
 * SEO-optimized with semantic HTML, meta tags, and structured data.
 */
export function HomePage() {
  const demos = getAllDemos();

  // Update document title and meta for SEO
  useEffect(() => {
    document.title = "PowerDuck Interactive Playground - OpenAPI Tools & Markdown Editor";

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Explore PowerDuck open-source libraries with live interactive demos. OpenAPI codegen, cURL to OpenAPI converter, config patcher, and high-performance Markdown editor with @mentions and doc-link insertion.",
    );

    // Structured data (JSON-LD) for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PowerDuck Interactive Playground",
      description:
        "Interactive demos for PowerDuck open-source libraries: OpenAPI codegen, cURL to OpenAPI converter, config patcher, and Markdown editor.",
      url: "https://www.powerduck.com/demo/",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      softwareHelp: demos.map((demo) => ({
        "@type": "SoftwareApplication",
        name: demo.name,
        description: demo.description,
        version: demo.version,
        url: demo.docsUrl,
      })),
    };

    let script = document.getElementById("ld-json-home") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script") as HTMLScriptElement;
      script.id = "ld-json-home";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    return () => {
      // Clean up on unmount
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [demos]);

  return (
    <Box as="main" maxW="1100px" mx="auto" px={8} py={10}>
      {/* Hero Section */}
      <section aria-labelledby="page-title">
        <VStack gap={3} align="start" mb={10}>
          <Badge size="sm" colorPalette="blue" variant="subtle" px={2} py={0.5}>
            Open Source
          </Badge>
          <Heading as="h1" id="page-title" size="xl" fontWeight="700" letterSpacing="tight">
            Interactive Playground
          </Heading>
          <Text as="p" fontSize="md" color="fg.muted" maxW="2xl" lineHeight="1.7">
            Explore PowerDuck open-source libraries with live demos. Adjust parameters,
            see results instantly, and export configuration JSON. No signup required.
          </Text>
        </VStack>
      </section>

      {/* Demo Grid */}
      <section aria-labelledby="demos-heading">
        <Heading as="h2" id="demos-heading" size="md" fontWeight="600" mb={4} className="sr-only">
          Available Library Demos
        </Heading>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          {demos.map((demo) => (
            <article key={demo.id} aria-labelledby={`demo-${demo.id}-title`}>
              <Card.Root
                h="full"
                variant="outline"
                bg="bg.panel"
                transition="all 0.15s ease"
                _hover={{ borderColor: "blue.400", shadow: "md", transform: "translateY(-2px)" }}
              >
                <Card.Body p={5}>
                  <VStack gap={3} align="start">
                    <HStack justify="space-between" w="full">
                      <RouterLink
                        to={`/${demo.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                        aria-label={`Open ${demo.name} demo`}
                      >
                        <Heading
                          as="h3"
                          id={`demo-${demo.id}-title`}
                          size="sm"
                          fontWeight="600"
                          _hover={{ color: "blue.500" }}
                          transition="color 0.15s ease"
                        >
                          {demo.name}
                        </Heading>
                      </RouterLink>
                      <Badge size="xs" variant="subtle" colorPalette="gray">
                        v{demo.version}
                      </Badge>
                    </HStack>

                    <Text as="p" fontSize="sm" color="fg.muted" lineHeight="1.6">
                      {demo.description}
                    </Text>

                    <HStack gap={1.5} flexWrap="wrap">
                      {demo.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} size="xs" variant="outline" colorPalette="gray">
                          {tag}
                        </Badge>
                      ))}
                    </HStack>

                    <HStack gap={3} pt={1} w="full">
                      <RouterLink
                        to={`/${demo.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="500"
                          color="blue.500"
                          _hover={{ color: "blue.600", textDecoration: "underline" }}
                        >
                          Open Demo →
                        </Text>
                      </RouterLink>
                      {demo.docsUrl && (
                        <Link
                          href={demo.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          fontSize="sm"
                          color="fg.muted"
                          _hover={{ color: "fg", textDecoration: "underline" }}
                          aria-label={`Read ${demo.name} documentation`}
                        >
                          Docs ↗
                        </Link>
                      )}
                    </HStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </article>
          ))}
        </Grid>
      </section>

      {/* Footer CTA */}
      <section aria-labelledby="cta-heading" className="mt-12">
        <Box
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border"
          borderRadius="lg"
          p={6}
          textAlign="center"
        >
          <Heading as="h2" id="cta-heading" size="md" fontWeight="600" mb={2}>
            Ready to integrate?
          </Heading>
          <Text fontSize="sm" color="fg.muted" mb={4} maxW="xl" mx="auto">
            All libraries are available on npm and GitHub. Install with a single command
            and start building today.
          </Text>
          <HStack gap={4} justify="center">
            <Link
              href="https://www.powerduck.com/docs/getting-started/introduction"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text
                fontSize="sm"
                fontWeight="500"
                color="blue.500"
                _hover={{ color: "blue.600", textDecoration: "underline" }}
              >
                View Documentation →
              </Text>
            </Link>
            <Link
              href="https://github.com/powerducklab"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text
                fontSize="sm"
                fontWeight="500"
                color="fg.muted"
                _hover={{ color: "fg", textDecoration: "underline" }}
              >
                GitHub ↗
              </Text>
            </Link>
          </HStack>
        </Box>
      </section>
    </Box>
  );
}
