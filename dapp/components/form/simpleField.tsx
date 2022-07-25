import { UseFormRegister } from "react-hook-form";
import { getFrontendParsing, InputType } from "utils/parsing";

type BaseFieldProperties = {
  name: string;
  label: string;
};
type SingleFieldProperties = BaseFieldProperties & {
  type: Exclude<InputType, "array" | "object">;
};
export type ComposedFieldProperties = BaseFieldProperties & {
  type: "object";
  subFields: SingleFieldProperties[];
};
export type ArrayFieldProperties = BaseFieldProperties & {
  type: "array";
  subFields: (ArrayFieldProperties | SingleFieldProperties)[];
};

export type FieldProperties =
  | SingleFieldProperties
  | ComposedFieldProperties
  | ArrayFieldProperties;
export type FieldProps = FieldProperties & {
  register: UseFormRegister<any>;
  errorMessage?: string;
};

export default function SimpleField({ label, name, register, type, errorMessage }: FieldProps) {
  const { type: inputType, placeholder, ...params } = getFrontendParsing(type);
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
