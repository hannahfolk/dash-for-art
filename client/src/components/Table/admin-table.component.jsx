import React, { useMemo, useState } from "react";
import { CSVDownload } from "react-csv";
import { useTable, useFilters, usePagination, useRowSelect } from "react-table";

import axios from "axios";
import Swal from "sweetalert2";

import TableToolbar from "./table-tool-bar.component";
import { adminFetchCommForTable } from "../../utils/fetchCommForTable";
import getCsvHeaders from "../../utils/csvHeaders";

import {
  DefaultColumnFilter,
  IndeterminateCheckbox,
  fuzzyTextFilterFn,
  startWithFn,
} from "../../libs/table";

import { TableContainer } from "./table.styles";

// Remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

const AdminTable = (props) => {
  const {
    columns,
    setTableData,
    startDate,
    endDate,
    type,
    data,
    token,
    checkedExcludeTags,
    handleCheckboxChange,
  } = props;
  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: startWithFn,
    }),
    []
  );

  const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,

    // Paginate
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    // Selection
    selectedFlatRows,

    state: { pageIndex, pageSize, filters, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: {
        hiddenColumns: ["dbRowId"],
      },
    },
    // Filter
    useFilters,

    // Paginated
    usePagination,

    // Selection
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const updateCommissions = async (isPaid) => {
    const dbRowIds = selectedFlatRows.map((row) => {
      return row.values.dbRowId;
    });

    try {
      // eslint-disable-next-line
      const data = await axios.put(
        "/api/admin/commissions/update",
        {
          dbRowIds,
          isPaid,
        },
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );
      const convertDetailsForAdmin = await adminFetchCommForTable(
        {
          method: "POST",
          url: "/api/admin/commissions",
          data: {
            startDate,
            endDate,
          },
        },
        token,
        type,
        checkedExcludeTags,
      );
      setTableData(convertDetailsForAdmin);

      Swal.fire({
        icon: "success",
        title: `Commissions marked as ${isPaid ? "Paid" : "Unpaid"}`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Sorry, Something Went Wrong",
      });
    }
  };

  const markedAsPaid = () => {
    updateCommissions(true);
  };

  const markedAsUnpaid = () => {
    updateCommissions(false);
  };

  const [csvData, setCsvData] = useState({ csvBodyData: [], csvHeaders: [] });
  const { csvBodyData, csvHeaders } = csvData;

  const exportCSV = async () => {
    const csvHeaders = getCsvHeaders(type);
    const csvBodyData = rows.map((row) => row.original);

    // TODO: Watch MYSTERY CODE!!
    await setCsvData({ csvBodyData, csvHeaders });
    setCsvData({ csvBodyData: [], csvHeaders: [] });
  };

  return (
    <TableContainer>
      {/* Download CSV file */}
      {csvBodyData.length > 0 ? (
        <CSVDownload data={csvBodyData} headers={csvHeaders} />
      ) : null}
      {/* Toolbar */}
      <TableToolbar
        numSelected={Object.keys(selectedRowIds).length}
        markedAsPaid={markedAsPaid}
        markedAsUnpaid={markedAsUnpaid}
        exportCSV={exportCSV}
        totalRecords={rows.length}
        checkedExcludeTags={checkedExcludeTags}
        handleCheckboxChange={handleCheckboxChange}
      />
      {/* Table */}
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <th key={j} {...column.getHeaderProps()}>
                  {column.render("Header")}
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map((cell, j) => {
                  return (
                    <td key={j} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />

      {/* Pagination */}
      <div className="pagination">
        <span>Total: {rows.length} </span>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>
        <span>
          Page
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <span>
          | Go to page:
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      {process.env.NODE_ENV === "development" ? (
        <div>
          <pre>
            <code>
              {JSON.stringify(
                {
                  filters,
                  pageIndex,
                  pageSize,
                  pageCount,
                  canNextPage,
                  canPreviousPage,
                  selectedRowIds: selectedRowIds,
                  "selectedFlatRows[].original": selectedFlatRows.map(
                    (d) => d.original
                  ),
                },
                null,
                2
              )}
            </code>
          </pre>
        </div>
      ) : null}
    </TableContainer>
  );
};

export default AdminTable;
