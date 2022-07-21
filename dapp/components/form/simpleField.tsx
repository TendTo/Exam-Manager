import { UseFormRegister } from "react-hook-form";
import { getFrontendParsing, InputType } from "utils/parsing";

type SingleFieldProperties = {
  name: string;
  label: string;
  type: Exclude<InputType, "array" | "object">;
};
export type ComposedFieldProperties = {
  name: string;
  label: string;
  type: "array" | "object";
  subFields: SingleFieldProperties[];
};
export type FieldProperties = SingleFieldProperties | ComposedFieldProperties;
export type FieldProps = FieldProperties & {
  register: UseFormRegister<any>;
  errorMessage?: string;
};

export default function SimpleField({ label, name, register, type, errorMessage }: FieldProps) {
  const { type: inputType,placeholder, ...params } = getFrontendParsing(type);
  return (
    <div className="form-control">
      <label className="input-group input-group-vertical">
        <span>{label}</span>
        <input
          type={inputType}
          placeholder={placeholder}
          className="input input-bordered outline-none appearance-none placeholder-gray-500"
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
