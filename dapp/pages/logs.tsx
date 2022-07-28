import { useLogs } from "hooks";

export default function Logs() {
  const { value } = useLogs();

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
                  <th colSpan={4}>
                    <div>Args</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {value &&
                  value.map(({ event, args }, idx) => {
                    const properties = Object.keys(args).filter((key) => isNaN(parseInt(key)));
                    return (
                      <tr key={`${event}-${idx}`} className="hover">
                        <td>{event}</td>
                        {properties.map((key) => (
                          <td key={`${event}-${idx}-${key}-empty`}>
                            <b>{`${key}:`}</b> {`${args[key]}`}
                          </td>
                        ))}
                        {Array.from(Array(4 - properties.length)).map((_, i) => (
                          <td key={`${event}-${idx}-${i}-empty`} />
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
