import SimpleField, { FieldProps } from "./form/simpleField";
import { useForm } from "react-hook-form";

type ContractCallProps = {
  title: string;
  description: string;
  fields: Omit<FieldProps, "register">[];
  callback: (...args: any[]) => void;
};
type ContractFormData<T extends Omit<FieldProps, "register">[]> = {
  [K in T[number]["name"]]: string;
};

export default function ContractFunction({
  title,
  description,
  fields,
  callback,
}: ContractCallProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContractFormData<typeof fields>>();
  const onSubmit = handleSubmit((data) => {
    // callback(...data)
    console.log(Object.values(data));
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
            {fields.map((field) => (
              <SimpleField
                key={`${field.label}-${field.name}`}
                label={field.label}
                type={field.type}
                register={register}
                name={field.name}
                errorMessage={errors[field.name]?.message}
              />
            ))}
          </div>
          <input type="submit" className="btn btn-primary" value="Invia" />
        </form>
      </div>
    </div>
  );
}
