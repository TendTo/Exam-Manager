import { Control, FieldError, useFieldArray, UseFormRegister } from "react-hook-form";
import SimpleField, { ArrayFieldProperties } from "./simpleField";
import { ContractFormData } from "../contractFunction";
import LogoPlus from "components/logos/logoPlus";
import LogoTrash from "components/logos/logoTrash";

export type ArrayFieldProps<T> = Omit<ArrayFieldProperties, "type" | "label"> & {
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
    name: name as any,
  });

  return (
    <div className="form-control">
      {fields.map((field, idx) => {
        return (
          <div className="flex flex-row gap-2 mb-6" key={`${name}-${field.id}`}>
            {labelCallback && labelCallback(name, idx)}
            <div className="flex flex-col gap-2 grow" key={`${name}-${field.id}`}>
              {subFields.length === 1 && subFields[0].type !== "array" ? (
                <SimpleField
                  key={`${name}-${field.id}-${subFields[0]}`}
                  label={subFields[0].label}
                  type={subFields[0].type}
                  register={register}
                  name={`${name}.${idx}`}
                />
              ) : (
                subFields.map((subField) =>
                  subField.type === "array" ? (
                    <ArrayField
                      key={`${name}-${field.id}-${subField.name}`}
                      register={register}
                      control={control}
                      subFields={subField.subFields}
                      name={`${name}.${idx}.${subField.name}`}
                      errorMessage={
                        errorMessage &&
                        errorMessage[idx] &&
                        (errorMessage[idx][subField.name] as any)
                      }
                    />
                  ) : (
                    <SimpleField
                      key={`${name}-${field.id}-${subField.name}`}
                      label={subField.label}
                      type={subField.type}
                      register={register}
                      name={`${name}.${idx}.${subField.name}`}
                      errorMessage={
                        errorMessage &&
                        errorMessage[idx] &&
                        errorMessage[idx][subField.name]?.message
                      }
                    />
                  )
                )
              )}
            </div>
            <button type="button" className="btn btn-error" onClick={() => remove(idx)}>
              <LogoTrash />
            </button>
          </div>
        );
      })}
      <button
        type="button"
        className="btn btn-success"
        onClick={() => append(subFields.length === 1 ? "" : ({} as any))}
      >
        <LogoPlus />
      </button>
    </div>
  );
}
