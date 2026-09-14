import { Component, type ErrorInfo, type ReactNode } from "react";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional name shown in the error UI. */
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches rendering errors in child components and shows a fallback UI.
 * Prevents a single broken component from crashing the entire app.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console for debugging
    console.error(`[ErrorBoundary:${this.props.name ?? "unknown"}]`, error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          p={6}
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border.error"
          borderRadius="md"
        >
          <VStack gap={3} align="start">
            <Heading size="md" color="fg.error">
              Something went wrong
            </Heading>
            <Text fontSize="sm" color="fg.muted">
              {this.props.name
                ? `The ${this.props.name} component failed to render.`
                : "This component failed to render."}
            </Text>
            {this.state.error && (
              <Box
                as="pre"
                bg="bg.muted"
                p={3}
                borderRadius="sm"
                fontSize="xs"
                fontFamily="mono"
                maxH="200px"
                overflow="auto"
                w="full"
              >
                {this.state.error.message}
              </Box>
            )}
            <Button size="sm" colorPalette="blue" onClick={this.handleReset}>
              Try Again
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}
