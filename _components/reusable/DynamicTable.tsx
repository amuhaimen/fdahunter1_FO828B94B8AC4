"use client";

import Image from "next/image";
import React from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface ColumnConfig {
  label: React.ReactNode;
  width: any;
  accessor: string;
  sortable?: boolean;
  formatter?: (value: any, row: any) => React.ReactNode;
}

interface SortConfig {
  key: string;
  direction: "ascending" | "descending";
}

interface DynamicTableProps {
  columns: ColumnConfig[];
  data: any[];
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onView?: (row: any) => void;
  onDelete?: (id: any) => void;
  noDataMessage?: string;
  sortConfig?: SortConfig | null;
  onSort?: (key: string) => void;
  minWidth?: number;

  headerStyles?: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    padding?: string;
    fontWeight?: string;
  };
  borderColor?: string;
  cellBorderColor?: string;
  hasWrapperBorder?: boolean;
  wrapperBorderColor?: string;
  roundedClass?: string;
}

export default function DynamicTable({
  columns,
  data,
  currentPage,
  itemsPerPage,
  onPageChange,
  onView,
  onDelete,
  noDataMessage = "No data found.",
  sortConfig,
  onSort,
  minWidth,

  headerStyles = {
    backgroundColor: "#F3F4F6",
    textColor: "#4a4c56",
    fontSize: "14px",
    fontWeight: "500",
    
  },

  cellBorderColor = "#EDEDED",
  hasWrapperBorder = true,
  wrapperBorderColor = "#EDEDED",
  roundedClass = "rounded-b-2xl",
}: DynamicTableProps) {
  const totalPages = itemsPerPage ? Math.ceil(data.length / itemsPerPage) : 0;
  const paginatedData = itemsPerPage
    ? data.slice(
        ((currentPage ?? 1) - 1) * itemsPerPage,
        (currentPage ?? 1) * itemsPerPage
      )
    : data;

  const renderSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-5 h-5 text-headerColor" />;
    }
    if (sortConfig.direction === "ascending") {
      return <ChevronUp className="w-4 h-4" />;
    }
    return <ChevronDown className="w-4 h-4" />;
  };

  // Check if there's an actions column in the columns array
  const hasActionsColumn = columns.some(
    (col) => col.accessor === "action" || col.accessor === "actions"
  );

  return (
    <div>
      {/* Table Wrapper with Border & Radius */}
      <div
        className={`overflow-hidden rounded-b-2xl bg-transparent ${roundedClass}`}
        style={{
          border: hasWrapperBorder ? `1px solid ${wrapperBorderColor}` : "none",
        }}
      >
        <div className="overflow-x-auto">
          <table
            className={` w-full text-left`}
            style={{minWidth: `${minWidth || 1000}px`}}
          >
            <thead>
              <tr className="rounded-t-2xl overflow-hidden">
                {columns.map((col, index) => (
                  <th
                    key={index}
                    style={{
                      width: col.width || "auto",
                      backgroundColor: headerStyles.backgroundColor,
                      color: headerStyles.textColor,
                      fontSize: headerStyles.fontSize,
                      padding: headerStyles.padding,
                      fontWeight: headerStyles.fontWeight,
                   
                    }}
                    className={`text-[#A5A5AB] px-4 py-3 whitespace-nowrap text-base font-light capitalize text-descriptionColor border-none
                      ${index === 0 ? "rounded-l-2xl" : ""}
                      ${
                        index === columns.length - 1 &&
                        !(onView || onDelete || hasActionsColumn)
                          ? "rounded-r-2xl"
                          : ""
                      }`}
                  >
                    <div
                      className={`flex items-center gap-1 ${
                        col.sortable ? "cursor-pointer" : ""
                      }`}
                    >
                      {col.label}
                    </div>
                  </th>
                ))}
                {/* Only show Action header if there are action buttons but no actions column */}
                {(onView || onDelete) && !hasActionsColumn && (
                  <th className="px-4 py-3 text-base font-medium text-[#4a4c56] border-none">
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {paginatedData?.length > 0 ? (
                paginatedData.map((row, i) => {
                  const isLastRow = i === paginatedData.length - 1;

                  return (
                    <tr key={i} className="border-none">
                      {columns.map((col, idx) => (
                        <td
                          key={idx}
                          style={{
                            minWidth: col.width || "auto",
                            borderBottom: isLastRow
                              ? "none"
                              : `1px solid ${cellBorderColor}`,
                          }}
                          className="px-4 py-3 text-[#4a4c56]"
                          onClick={(e) => {
                            // If this is the actions column and onView is provided, call onView
                            if (col.accessor === "action" && onView) {
                              e.stopPropagation();
                              onView(row);
                            }
                          }}
                        >
                          {col.formatter
                            ? col.formatter(row[col.accessor], row)
                            : row[col.accessor]}
                        </td>
                      ))}

                      {/* Show action buttons if onView/onDelete provided but no actions column exists */}
                      {(onView || onDelete) && !hasActionsColumn && (
                        <td
                          className="px-4 py-3 flex gap-4 items-center"
                          style={{
                            borderBottom: isLastRow
                              ? "none"
                              : `1px solid ${cellBorderColor}`,
                          }}
                        >
                          {onView && (
                            <span
                              className="text-sm underline text-[#4a4c56] cursor-pointer"
                              onClick={() => onView(row)}
                            >
                              View details
                            </span>
                          )}
                          {onDelete && (
                            <Image
                              onClick={() => onDelete(row.id)}
                              src="/dashboard/icon/delete.svg"
                              alt="delete"
                              width={16}
                              height={16}
                              className="cursor-pointer"
                            />
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      ((onView || onDelete) && !hasActionsColumn ? 1 : 0)
                    }
                    className="px-4 py-10 text-center text-[#4a4c56] text-sm"
                  >
                    {noDataMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => onPageChange && onPageChange((currentPage ?? 1) - 1)}
            disabled={(currentPage ?? 1) === 1}
            className="px-4 py-2 text-sm cursor-pointer rounded-sm text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Previous
            
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange && onPageChange((currentPage ?? 1) + 1)}
            disabled={(currentPage ?? 1) === totalPages}
            className="px-4 py-2 text-sm cursor-pointer rounded-sm text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
