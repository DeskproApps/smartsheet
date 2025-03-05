import { SheetColumn } from "@/types/smartsheet";

/**
 * Formats a cell's display value based on the column type.
 * 
 * @param {string} [value] - The cell value to validate
 * @param {SheetColumn} [column] - The column metadata, used to determine formatting
 */
export function validateCellValue(value?: string, column?: SheetColumn): string | undefined {

    if (!value || !column) {
        return undefined
    }

    switch (column.type) {
        case "DATETIME": {
            if (value.includes("T")) {
                const date = new Date(value);
                const isoString = date.toISOString() // e.g., 2025-02-03T09:49:56.000Z
                const [ymd, time] = isoString.split("T")
                const [hh, mm] = time.split(":")
                return `${ymd} (${hh}:${mm})`
            }
            return value
        }

        default:
            return value
    }




}