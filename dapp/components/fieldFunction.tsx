import { forwardRef, ForwardedRef } from "react";
import { ExamContract } from "types";

type ContractCallProps = {
  label: string;
  type: string;
};

export default forwardRef(
  ({ label, type }: ContractCallProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <label className="input-group">
        <span>
          {label}
        </span>
        <input
          ref={ref}
          name={label}
          placeholder="0x0000"
          className="input input-bordered"
          {...{ type: "text",pattern:"0x[a-zA-F0-9]{40}" }}
          required
        />
      </label>
    );
  }
);
