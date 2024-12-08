import React from "react";

interface TableProps<T> {
  headers: { label: string; key: keyof T }[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
  onSort?: (key: keyof T) => void;
  sortOrder?: "asc" | "desc";
  sortKey?: keyof T | null;
}

const Table = <T,>({ headers, data, renderRow, onSort, sortOrder, sortKey }: TableProps<T>) => {
  return (
    <table className="table-auto border-collapse border border-gray-300 w-full">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              className="border border-gray-300 px-4 py-2 text-left"
              onClick={() => onSort && onSort(header.key)}
              aria-sort={sortOrder === "asc" ? "ascending" : "descending"}
            >
              <div className="flex items-center">
                <span>{header.label}</span>
                {sortKey === header.key && (
                  <span className="ml-2">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map(renderRow)}</tbody>
    </table>
  );
};

export default Table;
