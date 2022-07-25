import { useEthers } from "@usedapp/core";
import { useSubjectIdContext } from "context";
import { useSetSubjectTests } from "hooks";
import { useForm } from "react-hook-form";
import { IExamContract } from "types";
import ArrayField from "./form/arrayField";
import { useEffect, useRef } from "react";

export default function SetSubjectTestsModal() {
  const { library } = useEthers();
  const { state: subjectId } = useSubjectIdContext();
  const { send } = useSetSubjectTests(library);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ tests: IExamContract.TestStruct[] }>();
  const checkbox = useRef<HTMLInputElement>(null);

  const onSubmit = handleSubmit((tests) => {
    console.log(tests.tests);
    reset({ tests: [] });
    checkbox.current?.click();
    // if (!subjectId) return;
    // send(subjectId, tests);
  });

  useEffect(() => {
    reset({ tests: [] });
  }, [reset, subjectId]);

  return (
    <>
      <input ref={checkbox} type="checkbox" id="set-subject-modal" className="modal-toggle" />
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
            <hr className="my-5" />
            <div className="form-control flex flex-col gap-4 mb-4">
              <ArrayField
                name="tests"
                register={register}
                control={control}
                errorMessage={errors.tests as any}
                subFields={[
                  { label: "Nome test", name: "name", type: "string" },
                  { label: "Durata valutazione", name: "expiresIn", type: "uint256" },
                  { label: "Voto minimo per superare il test", name: "minMark", type: "uint8" },
                ]}
                labelCallback={(_, idx) => `Test [${idx}]`}
              />
            </div>
            <input type="submit" className="btn btn-primary" value="Applica" />
          </form>
        </div>
      </div>
    </>
  );
}
