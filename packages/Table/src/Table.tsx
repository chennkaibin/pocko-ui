import React, { useEffect, useState, forwardRef, useRef } from "react";
import { TableProvider } from "./TableContext";
import { clsWrite, clsCombine } from "../../../utils/cls";

import "./index.scss";

interface TableProps {
  // basic
  tableWrapperClassName?: string;
  tableClassName?: string;
  cellAutoWidth?: boolean;
  hover?: boolean;
  bordered?: boolean;
  children: React.ReactNode;
}

const Table = forwardRef<HTMLDivElement, TableProps>(
  ({
    tableWrapperClassName,
    tableClassName,
    cellAutoWidth,
    hover = true,
    bordered = true,
    children,
  }) => {
    return (
      <TableProvider>
        <div
          className={clsCombine("table-wrapper", tableWrapperClassName || "")}
        >
          <table
            className={clsCombine(clsWrite(tableClassName, "table"), {
              "table-hover": hover,
              "table-bordered": bordered,
              "table-auto-width": cellAutoWidth,
            })}
          >
            {children}
          </table>
        </div>
      </TableProvider>
    );
  }
);

export default Table;
