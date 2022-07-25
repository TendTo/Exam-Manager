import SimpleField, { FieldProperties } from "./form/simpleField";
import { useForm } from "react-hook-form";
import ArrayField from "./form/arrayField";

type ContractCallProps = {
  title: string;
  description: string;
  fields: FieldProperties[];
  callback: (...args: any[]) => void;
};
export type ContractFormData<T extends FieldProperties[]> = {
  [K in T[number]["name"]]: string | number;
};

export default function ContractFunction({
  title,
  description,
  fields,
  callback,
}: ContractCallProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContractFormData<typeof fields>>();
  const onSubmit = handleSubmit((data) => {
    callback(...Object.values(data));
  });

  return (
    <div
      tabIndex={0}
      className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
    >
      <input type="checkbox" className="peer" />
      <div className="collapse-title text-xl font-bold">{title}</div>
      <div className="collapse-content">
        <p>{description}</p>
        <div className="divider"></div>
        <form onSubmit={onSubmit}>
          <div className="form-control flex flex-col gap-4 mb-4">
            {fields.map((field) => {
              switch (field.type) {
                case "array":
                  return (
                    <div key={`${title}-${field.name}`}>
                      {field.label}
                      <ArrayField
                        control={control}
                        subFields={field.subFields}
                        key={`${title}-${field.name}`}
                        register={register}
                        name={field.name}
                        errorMessage={errors[field.name] as any}
                      />
                    </div>
                  );
                case "object":
                  return (
                    <div key={`${title}-${field.name}`}>
                      {field.label}
                      {field.subFields.map((subField) => (
                        <SimpleField
                          key={`${title}-${field.name}-${subField.name}`}
                          label={subField.label}
                          type={subField.type}
                          register={register}
                          name={`${field.name}.${subField.name}`}
                          errorMessage={errors[`${field.name}.${subField.name}`]?.message}
                        />
                      ))}
                    </div>
                  );
                default:
                  return (
                    <SimpleField
                      key={`${title}-${field.name}`}
                      label={field.label}
                      type={field.type}
                      register={register}
                      name={field.name}
                      errorMessage={errors[field.name]?.message}
                    />
                  );
              }
            })}
          </div>
          <input type="submit" className="btn btn-primary" value="Invia" />
        </form>
      </div>
    </div>
  );
}
