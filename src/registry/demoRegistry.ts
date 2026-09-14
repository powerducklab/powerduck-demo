import type { DemoEntry } from "../types";

/**
 * Global demo registry. Add new library demos here to extend the app.
 * Each entry provides metadata and a lazy-loaded React component.
 */
const registry: DemoEntry[] = [];

/** Register a new demo entry. */
export function registerDemo(entry: DemoEntry): void {
  const existing = registry.findIndex((d) => d.id === entry.id);
  if (existing >= 0) {
    registry[existing] = entry;
  } else {
    registry.push(entry);
  }
}

/** Get all registered demos, sorted by name. */
export function getAllDemos(): DemoEntry[] {
  return [...registry].sort((a, b) => a.name.localeCompare(b.name));
}

/** Get a single demo by id. */
export function getDemoById(id: string): DemoEntry | undefined {
  return registry.find((d) => d.id === id);
}
