import React from "react";

interface TableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
}

const Table = <T,>({ headers, data, renderRow }: TableProps<T>) => {
  return (
    <table className="table-auto border-collapse border border-gray-300 w-full">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              className="border border-gray-300 px-4 py-2 text-left"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map(renderRow)}</tbody>
    </table>
  );
};

export default Table;
