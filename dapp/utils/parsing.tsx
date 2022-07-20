export type InputType = "string" | "uint256" | "uint8" | "address";
type FrontendParsing = {
  type: string;
  pattern?: string;
  min?: number;
  max?: number;
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
      return { type: "text", pattern: "0x[0-9a-fA-F]{40}" };
    case "uint256":
      return { type: "number", min: 0, max: Number.MAX_SAFE_INTEGER };
    case "uint8":
      return { type: "number", min: 0, max: 255 };
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
