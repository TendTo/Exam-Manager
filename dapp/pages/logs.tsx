import { useLogs } from "hooks";

function difference(obj1: object) {
  const keys: string[] = [];
  Object.keys(obj1).forEach((key) => {
    if (isNaN(parseInt(key))) {
      keys.push(key);
    }
  });
  return keys;
}

export default function Logs() {
  const { value } = useLogs();
  console.log(value);
  return (
    <div className="hero min-h-full bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-6xl">
          <h1 className="text-5xl font-bold mb-2">Logs</h1>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>
                    <div>Evento</div>
                  </th>
                  <th>
                    <div>Arg 0</div>
                  </th>
                  <th>
                    <div>Arg 1</div>
                  </th>
                  <th>
                    <div>Arg 2</div>
                  </th>
                  <th>
                    <div>Arg 3</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {value &&
                  value.map(({ event, args }) => {
                    const properties = difference(args);
                    return (
                      <tr>
                        <td>{event}</td>
                        {properties.map((key) => (
                          <td>
                            <b>{`${key}:`}</b> {`${args[key]}`}
                          </td>
                        ))}
                        {Array.from(Array(4 - properties.length)).map(() => (
                          <td />
                        ))}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
