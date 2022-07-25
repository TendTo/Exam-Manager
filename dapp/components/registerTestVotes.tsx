import { useForm } from "react-hook-form";
import ArrayField from "./form/arrayField";

type TestResults = { studentId: number; mark: number }[];

type RegisterTestVotesProps = {
  testName: string;
  minMark: number;
  callback: (results: TestResults) => void;
};

export default function RegisterTestVotes({ testName, callback }: RegisterTestVotesProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ students: TestResults }>();
  const onSubmit = handleSubmit((data) => {
    callback(data.students);
  });

  return (
    <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box flex-row">
      <input type="checkbox" className="peer" />
      <div className="collapse-title text-xl font-bold"> {testName}</div>
      <div className="collapse-content">
        <form onSubmit={onSubmit}>
          <div className="form-control flex flex-col gap-4 mb-4">
            <ArrayField
              control={control}
              subFields={[
                {
                  label: "Matricola",
                  name: "studentId",
                  type: "uint256",
                },
                {
                  label: "Voto",
                  name: "mark",
                  type: "uint8",
                },
              ]}
              register={register}
              name={"students"}
              errorMessage={errors.students as any}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Invia" />
        </form>
      </div>
    </div>
  );
}
