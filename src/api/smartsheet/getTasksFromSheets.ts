import { Sheet, Task } from "@/types/smartsheet"
import { validateCellValue } from "./validateCellValue";

/**
 * Extracts tasks from an array of Smartsheet sheets.
 *
 * @param {(Sheet | null)[]} detailedSheets - An array of detailed Sheet objects or null values.
 */
export function getTasksFromSheets(detailedSheets: (Sheet | null)[]): Task[] {
    if (!detailedSheets || detailedSheets.length === 0) return [];

    return detailedSheets.flatMap((sheet) => {
        if (!sheet) return [];

        return sheet.rows.map((row) => {
            return {
                // Find the primary column value to use as the task title
                title: row.cells?.find(cell => {
                    const column = sheet.columns.find(col => col.id === cell.columnId);
                    return column?.primary;
                })?.displayValue ?? "Untitled Task", // Ideally this should never happen
                id: row.id,

                // Sheet metadata
                sheet: {
                    id: sheet.id,
                    name: sheet.name,
                    liveLink: sheet.permalink,
                },

                // Extract cell data as task items
                items: row.cells?.map((cell) => {
                    const column = sheet.columns.find(col => col.id === cell.columnId)
                    return {
                        columnId: column?.id,
                        title: column?.title ?? "Unknown Column",
                        // Prioritise the display name, then the value (if present), convert the value to a string
                        value: validateCellValue(cell.displayValue ?? (cell.value !== null && cell.value !== undefined ? String(cell.value) : undefined), column),
                        type: column?.type,
                        isPrimary: column?.primary,
                        options: column?.options ,
                    };
                }) ?? [],
            };
        });
    });
}