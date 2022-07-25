import { useEthers } from "@usedapp/core";
import { useSubjectIdContext } from "context";
import { useSetSubjectTests } from "hooks";
import { useForm } from "react-hook-form";
import { IExamContract } from "types";
import ArrayField from "./form/arrayField";
import { useEffect, useRef } from "react";

type FormData = {
  name: string;
  expiresIn: number;
  minMark: number;
  testIdxRequired: { value: number }[][];
  testIdxReset: number[];
  testIdxResetOnTake: number[];
};

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
  } = useForm<{ tests: IExamContract.TestStruct[] }>({
    defaultValues: {
      tests: [],
    },
  });
  const checkbox = useRef<HTMLInputElement>(null);

  const onSubmit = handleSubmit((data) => {
    console.log(data.tests);
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
      <div className="modal min-w-full">
        <div className="modal-box relative min-w-[70%]">
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
                  {
                    label: "Test necessari per effettuare il test",
                    name: "testIdxRequired",
                    type: "array",
                    subFields: [
                      {
                        name: "value",
                        type: "arrayString",
                        label: "Test necessari per effettuare il test",
                      },
                    ],
                  },
                  {
                    label: "Test da resettare quando il test viene fallito/rifiutato",
                    name: "testIdxReset",
                    type: "arrayString",
                  },
                  {
                    label: "Test da resettare se l'alunno si presenta a fare il test",
                    name: "testIdxResetOnTake",
                    type: "arrayString",
                  },
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
