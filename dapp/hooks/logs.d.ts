import type {
  TypedContract,
  ContractEventNames,
  DetailedEventRecord,
} from "@usedapp/core/dist/esm/src/model/types";
import type { TypedEventFilter } from "types/common";
import type { Contract } from "@ethersproject/contracts";
import type { LogsResult, useLogs } from "@usedapp/core";

type EventReturn<T extends TypedContract, EN extends ContractEventNames<T>> = ReturnType<
  T["filters"][EN]
> extends TypedEventFilter<infer X> // This is the issue: you need TypedEventFilter
  ? Omit<
      { [K in keyof X["args"] as K extends `${number}` ? never : K]: X["args"][K] },
      keyof Array<any>
    >
  : never;

type ValueType<T extends TypedContract, EN extends ContractEventNames<T>> = DetailedEventRecord<
  T,
  EN
> & {
  data: EventReturn<T, EN>;
};

export type UseLogsReturn<T extends TypedContract, EN extends ContractEventNames<T>> = LogsResult<
  T,
  EN
> & {
  error?: Error;
  value?: Awaited<ValueType<T, EN>>[];
};
