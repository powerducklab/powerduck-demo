import type { ComponentType } from "react";

/** Metadata for a registered library demo. */
export interface DemoMeta {
  /** Unique identifier, used as route slug. */
  id: string;
  /** Display name shown in sidebar and page header. */
  name: string;
  /** npm package name. */
  packageName: string;
  /** Short one-line description. */
  description: string;
  /** Longer description shown on the demo page. */
  longDescription: string;
  /** Version of the package being demonstrated. */
  version: string;
  /** GitHub or documentation URL. */
  docsUrl?: string;
  /** Tags for filtering / search. */
  tags: string[];
}

/** A fully registered demo: metadata + React component. */
export interface DemoEntry extends DemoMeta {
  component: ComponentType;
}

/** A generic key-value parameter definition for the parameter panel. */
export interface ParamDef {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "switch" | "slider" | "textarea";
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  helperText?: string;
  defaultValue?: unknown;
}
