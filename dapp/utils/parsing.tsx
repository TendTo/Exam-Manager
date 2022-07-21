import { HTMLInputTypeAttribute } from "react";

export type InputType = "string" | "uint256" | "uint8" | "address" | "array" | "object";
type FrontendParsing = {
  type: HTMLInputTypeAttribute;
  pattern?: { message: string; value: RegExp };
  min?: { message: string; value: number };
  max?: { message: string; value: number };
  valueAsNumber?: true;
};
type BackendParsing<T extends InputType> = (
  input?: string
) => T extends "string"
  ? string
  : T extends "uint256"
  ? number
  : T extends "uint8"
  ? number
  : T extends "address"
  ? string
  : never;

export function getFrontendParsing(type: InputType): FrontendParsing {
  switch (type) {
    case "address":
      return {
        type: "text",
        pattern: { message: "Deve essere un indirizzo ETH valido", value: /0x[0-9a-fA-F]{40}/ },
      };
    case "uint256":
      return {
        type: "number",
        min: { value: 0, message: "Deve essere maggiore o uguale 0" },
        max: {
          value: Number.MAX_SAFE_INTEGER,
          message: "Deve essere minore o uguale a 9007199254740991 2^(53-1).",
        },
        valueAsNumber: true,
      };
    case "uint8":
      return {
        type: "number",
        min: { value: 0, message: "Deve essere maggiore o uguale a 0" },
        max: {
          value: 255,
          message: "Deve essere minore o uguale a 255",
        },
        valueAsNumber: true,
      };
    case "string":
      return { type: "text" };
    default:
      return { type: "text" };
  }
}

export function getBackendParsing(type: InputType): BackendParsing<typeof type> {
  switch (type) {
    case "address":
      return (input?: string) => (input ? input : "");
    case "uint256":
      return (input?: string) => (input ? parseInt(input) : 0);
    case "uint8":
      return (input?: string) => (input ? parseInt(input) : 0);
    case "string":
      return (input?: string) => (input ? input : "");
    default:
      return (input?: string) => (input ? input : "");
  }
}
