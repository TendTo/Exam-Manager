import { forwardRef, ForwardedRef } from "react";
import { getFrontendParsing, getBackendParsing, InputType } from "utils/parsing";

type ContractCallProps = {
  label: string;
  type: InputType;
};

export default forwardRef(
  ({ label, type }: ContractCallProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <label className="input-group">
        <span>{label}</span>
        <input
          ref={ref}
          name={label}
          placeholder="0x0000"
          className="input input-bordered"
          {...getFrontendParsing(type)}
          required
        />
      </label>
    );
  }
);
