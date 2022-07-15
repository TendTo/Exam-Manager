import { useCallback, useEffect, useState } from "react";

export type AsyncState = "idle" | "pending" | "success" | "error";
type AsyncResponse<T, A, E = string> = {
  execute: (args: A) => Promise<void>;
  status: AsyncState;
  value: T | null;
  error: E | null;
};

export function useAsync<T, A, E = Error>(
  asyncFunction: (args: A) => Promise<T>,
  immediate?: false,
): AsyncResponse<T, A, E>;
export function useAsync<T, A, E = Error>(
  asyncFunction: (args: A) => Promise<T>,
  immediate: true,
  immediateExecArgs: A,
): AsyncResponse<T, A, E>;
export function useAsync<T, A, E = Error>(
  asyncFunction: (args: A) => Promise<T>,
  immediate?: boolean,
  immediateExecArgs?: A,
): AsyncResponse<T, A, E> {
  const [status, setStatus] = useState<AsyncState>("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(
    async (args: A) => {
      setStatus("pending");
      setValue(null);
      setError(null);
      try {
        const response = await asyncFunction(args);
        setValue(response);
        setStatus("success");
      } catch (error) {
        setError(error as E);
        setStatus("error");
      }
    },
    [asyncFunction],
  );

  useEffect(() => {
    if (immediate) {
      execute(immediateExecArgs!);
    }
  }, [execute, immediate, immediateExecArgs]);
  return { execute, status, value, error };
}
