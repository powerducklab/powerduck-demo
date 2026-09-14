import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { getDemoById } from "./registry/demoRegistry";
import "./registry/registerAll";

/**
 * Root application component.
 * Sets up Chakra UI provider, React Router, and demo routes.
 */
function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/demo/:demoId" element={<DemoRoute />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ChakraProvider>
  );
}

/** Resolves the demo component from the registry by route param. */
function DemoRoute() {
  const { demoId } = useParams();
  const demo = demoId ? getDemoById(demoId) : undefined;

  if (!demo) {
    return <Navigate to="/" replace />;
  }

  const DemoComponent = demo.component;
  return <DemoComponent />;
}

export default App;
