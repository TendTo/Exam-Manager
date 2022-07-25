import { Control, FieldError, useFieldArray, UseFormRegister } from "react-hook-form";
import SimpleField, { ComposedFieldProperties, FieldProperties } from "./simpleField";
import { ContractFormData } from "../contractFunction";
import LogoPlus from "components/logos/logoPlus";
import LogoTrash from "components/logos/logoTrash";

export type ArrayFieldProps<T> = Omit<ComposedFieldProperties, "type" | "label"> & {
  control: Control<T, object>;
  register: UseFormRegister<any>;
  errorMessage?: Record<string, FieldError>[];
  labelCallback?: (subfieldName: string, idx: number) => string;
};

export default function ArrayField<T>({
  name,
  register,
  errorMessage,
  control,
  subFields,
  labelCallback,
}: ArrayFieldProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  });

  return (
    <div className="form-control">
      {fields.map((field, idx) => {
        return (
          <div className="flex flex-row gap-2 mb-6" key={`${name}-${field.id}`}>
            {labelCallback && labelCallback(name, idx)}
            <div className="flex flex-col gap-2 grow" key={`${name}-${field.id}`}>
              {subFields.map((subField) => (
                <SimpleField
                  key={`${name}-${field.id}-${subField.name}`}
                  label={subField.label}
                  type={subField.type}
                  register={register}
                  name={`${name}.${idx}.${subField.name}`}
                  errorMessage={
                    errorMessage && errorMessage[idx] && errorMessage[idx][subField.name]?.message
                  }
                />
              ))}
            </div>
            <button type="button" className="btn btn-error" onClick={() => remove(idx)}>
              <LogoTrash />
            </button>
          </div>
        );
      })}
      <button type="button" className="btn btn-success" onClick={() => append({})}>
        <LogoPlus />
      </button>
    </div>
  );
}
