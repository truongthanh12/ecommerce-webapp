"use client";
import {
  Checkbox,
  styled,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import UpDown from "@/components/icons/UpDown";
import React from "react";

// styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  padding: "16px 20px",
  color: theme.palette.grey[900],
}));

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const TableHeader = ({
  order,
  heading,
  orderBy,
  rowCount,
  numSelected,
  onRequestSort,
  onSelectAllClick = () => {},
  hideSelectBtn = false,
}: any) => {
  return (
    <TableHead
      sx={{
        backgroundColor: "grey.200",
      }}
    >
      <TableRow>
        {!hideSelectBtn && (
          <StyledTableCell align="left">
            <Checkbox
              color="info"
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event) =>
                onSelectAllClick(event.target.checked, "product")
              }
            />
          </StyledTableCell>
        )}

        {heading.map((headCell: any) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.align}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              onClick={() => onRequestSort(headCell.id)}
              direction={orderBy === headCell.id ? order : "asc"}
              sx={{
                "& .MuiTableSortLabel-icon": {
                  opacity: 1,
                },
              }}
              IconComponent={() => (
                <UpDown
                  sx={{
                    fontSize: 14,
                    ml: 1,
                    color: "grey.600",
                  }}
                />
              )}
            >
              {headCell.label}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
export default React.memo(TableHeader);
