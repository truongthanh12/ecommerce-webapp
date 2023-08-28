"use client"
import { styled, TableCell, TableHead, TableRow } from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";
import UpDown from "@/components/icons/UpDown";
import React from "react";

// styled components
interface StyleProps {
  sortDirection: number | boolean | "desc" | "asc"
  theme?: any
  align: "left" | "center"
}
const StyledTableCell = styled(TableCell)<StyleProps>(({ theme }) => ({
  fontWeight: 600,
  padding: "12px 16px",
  color: theme.palette.grey[900],
  ":first-of-type": {
    paddingLeft: 24,
  },
}));

// ----------------------------------------------------------------------

interface TableHeader {
  heading: any;
  orderBy: number;
  order: "desc" | "asc";
  onRequestSort: (id: number) => void;
}
const TableHeader = ({ heading, orderBy, order, onRequestSort }: TableHeader) => {
  return (
    <TableHead
      sx={{
        backgroundColor: "grey.200",
      }}
    >
      <TableRow>
        {heading.map((headCell: any) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.alignCenter ? "center" : "left"}
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
