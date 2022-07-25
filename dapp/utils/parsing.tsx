import { HTMLInputTypeAttribute } from "react";

export type InputType =
  | "string"
  | "uint256"
  | "uint8"
  | "address"
  | "array"
  | "object"
  | "arrayString";

type FrontendParsing = {
  type: HTMLInputTypeAttribute;
  placeholder?: string;
  pattern?: { message: string; value: RegExp };
  min?: { message: string; value: number };
  max?: { message: string; value: number };
  valueAsNumber?: true;
  setValueAs?: (value?: string) => any;
  required?: { message: "Il campo è richiesto"; value: true };
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
  : T extends "arrayString"
  ? number[]
  : never;

export function getFrontendParsing(type: InputType): FrontendParsing {
  switch (type) {
    case "address":
      return {
        type: "text",
        placeholder: "0x0000000000000000000000000000000000000000",
        pattern: { message: "Deve essere un indirizzo ETH valido", value: /0x[0-9a-fA-F]{40}/ },
        required: { message: "Il campo è richiesto", value: true },
      };
    case "uint256":
      return {
        type: "number",
        placeholder: "0",
        min: { value: 0, message: "Deve essere maggiore o uguale 0" },
        max: {
          value: Number.MAX_SAFE_INTEGER,
          message: "Deve essere minore o uguale a 9007199254740991 2^(53-1).",
        },
        valueAsNumber: true,
        required: { message: "Il campo è richiesto", value: true },
      };
    case "uint8":
      return {
        type: "number",
        placeholder: "0",
        min: { value: 0, message: "Deve essere maggiore o uguale a 0" },
        max: {
          value: 255,
          message: "Deve essere minore o uguale a 255",
        },
        valueAsNumber: true,
        required: { message: "Il campo è richiesto", value: true },
      };
    case "string":
      return { placeholder: "ABC", type: "text" };
    case "arrayString":
      return {
        placeholder: "[0, 1, 2]",
        type: "text",
        pattern: {
          message: "Deve essere un array di interi valido",
          value: /^\[((\s*\d+\s*,\s*)*\s*\d+\s*)?\]$/,
        },
        setValueAs: (input?: string) =>
          typeof input === "string" && input?.match(/^\[((\s*\d+\s*,\s*)*\s*\d+\s*)?\]$/)
            ? JSON.parse(input || "[]")
            : [],
      };
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
    case "arrayString":
      return (input?: string) => JSON.parse(input || "[]");
    default:
      return (input?: string) => (input ? input : "");
  }
}
