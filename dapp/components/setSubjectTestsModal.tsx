import { useEthers } from "@usedapp/core";
import { useSubjectIdContext } from "context";
import { useSetSubjectTests } from "hooks";

export default function SetSubjectTestsModal() {
  const { library } = useEthers();
  const { state: subjectId } = useSubjectIdContext();
  const { send } = useSetSubjectTests(library);

  return (
    <>
      <input type="checkbox" id="set-subject-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="set-subject-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Hai selezionato la materia con id {subjectId}</h3>
          <form onSubmit={onSubmit}>
            <div className="form-control flex flex-col gap-4 mb-4">
              {fields.map((field) => {
                return (
                  <div key={`${title}-${field.name}`}>
                    {field.label}
                    <ArrayField
                      control={control}
                      subFields={field.subFields}
                      key={`${title}-${field.name}`}
                      label={field.label}
                      register={register}
                      name={field.name}
                      errorMessage={errors[field.name] as any}
                    />
                  </div>
                );
              })}
            </div>
          </form>
          <button className="btn" onClick={() => subjectId && send(subjectId, [])}></button>
        </div>
      </div>
    </>
  );
}
