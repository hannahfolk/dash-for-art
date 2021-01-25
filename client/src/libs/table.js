import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import matchSorter from "match-sorter";

// This is a custom filter UI for selecting
// a unique option from a list
export const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) =>
        option ? (
          <option key={i} value={option}>
            {option}
          </option>
        ) : (
          ""
        )
      )}
    </select>
  );
};

// Define a default UI for filtering
export const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
};

// Selection
export const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <Checkbox ref={resolvedRef} {...rest} />
      </>
    );
  }
);

// Fuzzy find by a library
export const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
};

export const startWithFn = (rows, id, filterValue) => {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue !== undefined
      ? String(rowValue)
          .toLowerCase()
          .startsWith(String(filterValue).toLowerCase())
      : true;
  });
};
