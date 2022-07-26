import { useForm } from "react-hook-form";
import ArrayField from "./form/arrayField";

type SubjectResults = { studentId: number; mark: number }[];

type RegisterSubjectVotesProps = {
  callback: (results: SubjectResults) => void;
};

export default function RegisterSubjectVotes({ callback }: RegisterSubjectVotesProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ students: SubjectResults }>();
  const onSubmit = handleSubmit((data) => {
    callback(data.students);
  });

  return (
    <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box flex-row">
      <input type="checkbox" className="peer" />
      <div className="collapse-title text-xl font-bold">Verbalizza materia</div>
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
