import { useRef, createRef, RefObject, FormEventHandler, FormEvent } from "react";
import { ExamContract } from "types";
import FieldFunction from "./fieldFunction";

type ContractCallProps = {
  title: string;
  description: string;
  fields: {
    label: string;
    type: string;
  }[];
  callback: (...args: any[]) => void;
};

export default function ContractFunction({
  title,
  description,
  fields,
  callback,
}: ContractCallProps) {
  const refs = useRef<RefObject<HTMLInputElement>[]>(fields.map(() => createRef()));

  const submitFunction = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = refs.current.map((ref) => ref.current?.value ?? "");
    callback(...values);
  };

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
        <form onSubmit={submitFunction}>
          <div className="form-control flex flex-col gap-4 mb-4">
            {fields.map((field, i) => (
              <FieldFunction key={i} label={field.label} type={field.type} ref={refs.current[i]} />
            ))}
          </div>
          <button type="submit" className="btn btn-primary">
            Ok
          </button>
        </form>
      </div>
    </div>
  );
}
