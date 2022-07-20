import { UseFormRegister } from "react-hook-form";
import { getFrontendParsing, InputType } from "utils/parsing";

export type FieldProps = {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  type: InputType;
  errorMessage?: string;
};

export default function SimpleField({ label, name, register, type, errorMessage }: FieldProps) {
  const { type: inputType, ...params } = getFrontendParsing(type);
  return (
    <div className="form-control">
      <label className="input-group input-group-vertical">
        <span>{label}</span>
        <input
          type={inputType}
          className="input input-bordered"
          {...register(name, {
            required: { message: "Il campo è richiesto", value: true },
            ...params,
          })}
        />
      </label>
      {errorMessage && <p className="text-sm text-red-500 ">{errorMessage}</p>}
    </div>
  );
}
