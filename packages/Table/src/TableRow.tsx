import React, { useContext, forwardRef } from "react";

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  active?: boolean;
  activeClassName?: string;
  className?: string;
  itemData?: any;
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    { children, active, activeClassName, className, itemData, ...attributes },
    externalRef
  ) => {
    return (
      <>
        <tr
          {...attributes}
          ref={externalRef}
          data-row-data={`${
            itemData && typeof itemData === "object"
              ? JSON.stringify(itemData)
              : itemData
          }`}
          className={`${active ? activeClassName || "table-tr-active" : ""} ${
            className || ""
          }`}
        >
          {children}
        </tr>
      </>
    );
  }
);

export default TableRow;
