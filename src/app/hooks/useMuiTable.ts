"use client";
import { useState } from "react";

// ================================================================

export function descendingComparator(a: any, b: any, orderBy: any) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
export function getComparator<T>(order: "desc" | "asc", orderBy: number) {
  return order === "desc"
    ? (a: T, b: T) => descendingComparator(a, b, orderBy)
    : (a: T, b: T) => -descendingComparator(a, b, orderBy);
}
export function stableSort(array: any, comparator: any) {
  const stabilizedThis = array.map((el: any, index: number) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el: any) => el[0]);
}

// ================================================================

// ================================================================

const useMuiTable = (props: any) => {
  const { listData = [], defaultSort = "name", defaultOrder = "asc" } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(20);
  const [orderBy, setOrderBy] = useState(defaultSort);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState(defaultOrder);

  // Handle list sorting
  const handleRequestSort = (property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Handle select whole list
  const handleSelectAllClick = (checked: boolean, defaultSelect: any) => {
    if (checked) {
      const newSelecteds = listData.map((n: any) => n[defaultSelect]);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // Handle individual row click
  const handleRowClick = (name: any) => {
    const selectedIndex = selected.findIndex(
      (item: { name: string }) => item.name === name
    );
    let newSelected: any = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  const handleChangePage = (_: string, newPage: number) => setPage(newPage - 1);
  const filteredList = stableSort(
    listData,
    getComparator(order, orderBy)
  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return {
    page,
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleRowClick,
    handleChangePage,
    handleRequestSort,
    handleSelectAllClick,
  };
};
export default useMuiTable;
