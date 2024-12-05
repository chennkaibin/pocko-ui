import React, { forwardRef, useContext } from "react";

export interface TableCellProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  active?: boolean;
  activeClassName?: string;
  className?: string;
  colSpan?: number;
  scope?: `col` | `row` | `colgroup` | `rowgroup`;
  onClick?: (e: any) => void;
  onKeyDown?: (e: any) => void;
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  (
    {
      children,
      active,
      activeClassName,
      className: myClassName,
      colSpan,
      scope,
      onClick,
      onKeyDown,
      ...attributes
    },
    externalRef
  ) => {
    const CellComponent = scope ? "th" : "td";

    return (
      <>
        <CellComponent
          {...attributes}
          colSpan={colSpan}
          tabIndex={-1}
          onClick={(e: React.MouseEvent) => {
            const _el: any = e.currentTarget;

            // callback
            onClick?.(e);
          }}
          className={`${active ? activeClassName || "table-cell-active" : ""} ${
            myClassName || ""
          }`}
        >
          {children}
        </CellComponent>
      </>
    );
  }
);

export default TableCell;
