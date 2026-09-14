import { ChakraProvider, defaultSystem, Box, Heading, Text } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <Box p={8}>
        <Heading size="2xl" mb={4}>PowerDuck Demo</Heading>
        <Text>If you see this, Chakra UI is working.</Text>
      </Box>
    </ChakraProvider>
  );
}

export default App;
