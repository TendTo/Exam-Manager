import { Control, FieldError, useFieldArray, UseFormRegister } from "react-hook-form";
import SimpleField, { ArrayFieldProperties } from "./simpleField";
import LogoPlus from "components/logos/logoPlus";
import LogoTrash from "components/logos/logoTrash";

export type ArrayFieldProps<T> = Omit<ArrayFieldProperties, "type" | "label"> & {
  control: Control<T, object>;
  register: UseFormRegister<any>;
  errorMessage?: Record<string, FieldError>[];
  label?: string;
  labelCallback?: (subfieldName: string, idx: number) => string;
};

export default function ArrayField<T>({
  name,
  register,
  errorMessage,
  control,
  subFields,
  label,
  labelCallback,
}: ArrayFieldProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });

  return (
    <div className="form-control">
      <h4>{label}</h4>
      {fields.map((field, idx) => {
        return (
          <>
            <div className="divider mt-0"></div>
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
                        label={subField.label ? subField.label : undefined}
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
              <button type="button" className="btn btn-secondary" onClick={() => remove(idx)}>
                <LogoTrash />
              </button>
            </div>
          </>
        );
      })}
      <button
        type="button"
        className="btn btn-accent"
        onClick={() => append(subFields.length === 1 ? "" : ({} as any))}
      >
        <LogoPlus />
      </button>
    </div>
  );
}
