import React from "react";
import { SelectColumnFilter } from "../../libs/table";

export const TABLE_COLUMNS = [
  {
    Header: "Database Row Id",
    accessor: "dbRowId",
    disableFilters: true,
  },
  {
    Header: "Date",
    accessor: "order_created_at",
    disableFilters: true,
  },
  {
    Header: "Order #",
    accessor: "order",
    filter: "text",
  },
  {
    Header: "Title",
    accessor: "product_title",
    filter: "fuzzyText",
  },
  {
    Header: "Artist",
    accessor: "artist",
    filter: "fuzzyText",
    Cell: (event) => (
      <a href={`/admin/artists-profiles?artist=${event.value}`}>
        {event.value}
      </a>
    ),
  },
  {
    Header: "Product Type",
    accessor: "product_type",
    Filter: SelectColumnFilter,
    filter: "equals",
  },
  {
    Header: "Commissions Amount",
    accessor: "commissions_amount",
    disableFilters: true,
  },
  {
    Header: "Group",
    accessor: "group",
    Filter: SelectColumnFilter,
    filter: "equals",
  },
  {
    Header: "Paid or Unpaid",
    accessor: "is_commissions_paid",
    Filter: SelectColumnFilter,
    filter: "equals",
  },
  {
    Header: "Tags",
    accessor: "tags",
    filter: "fuzzyText",
  },
];

// export const TABLE_COLUMNS_ARTIST = [
//   {
//     Header: "Artist",
//     accessor: "artist",
//     filter: "fuzzyText",
//     Cell: (event) => (
//       <a href={`/admin/artists-profiles?artist=${event.value}`}>
//         {event.value}
//       </a>
//     ),
//   },
//   {
//     Header: "Product",
//     accessor: "product",
//     filter: "text",
//   },
//   {
//     Header: "Product Type",
//     accessor: "productType",
//     Filter: SelectColumnFilter,
//     filter: "equals",
//   },
//   {
//     Header: "Quantity",
//     accessor: "quantity",
//     disableFilters: true,
//   },
//   {
//     Header: "Paid Amount",
//     accessor: "paidAmount",
//     disableFilters: true,
//   },
//   {
//     Header: "Unpaid Amount",
//     accessor: "unpaidAmount",
//     disableFilters: true,
//   },
// ];

// export const TABLE_COLUMNS_PRODUCT = [
//   {
//     Header: "Artist",
//     accessor: "artist",
//     filter: "fuzzyText",
//     Cell: (event) => (
//       <a href={`/admin/artists-profiles?artist=${event.value}`}>
//         {event.value}
//       </a>
//     ),
//   },
//   {
//     Header: "Product",
//     accessor: "product",
//     filter: "text",
//   },
//   {
//     Header: "Quantity",
//     accessor: "quantity",
//     disableFilters: true,
//   },
//   {
//     Header: "Paid Amount",
//     accessor: "paidAmount",
//     disableFilters: true,
//   },
//   {
//     Header: "Unpaid Amount",
//     accessor: "unpaidAmount",
//     disableFilters: true,
//   },
// ];

// export const TABLE_COLUMNS_PRODUCT_TYPE = [
//   {
//     Header: "Artist",
//     accessor: "artist",
//     filter: "fuzzyText",
//     Cell: (event) => (
//       <a href={`/admin/artists-profiles?artist=${event.value}`}>
//         {event.value}
//       </a>
//     ),
//   },
//   {
//     Header: "Product Type",
//     accessor: "productType",
//     filter: "text",
//   },
//   {
//     Header: "Quantity",
//     accessor: "quantity",
//     disableFilters: true,
//   },
//   {
//     Header: "Paid Amount",
//     accessor: "paidAmount",
//     disableFilters: true,
//   },
//   {
//     Header: "Unpaid Amount",
//     accessor: "unpaidAmount",
//     disableFilters: true,
//   },
// ];
