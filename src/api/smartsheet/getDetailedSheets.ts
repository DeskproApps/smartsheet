import { DetailedSheet } from "@/types/smartsheet"
import { getSheetDetails } from "./getSheetDetails"
import { getSheets } from "./getSheets"
import { IDeskproClient } from "@deskpro/app-sdk"


/**
 * Fetches detailed information about all sheets (projects) associated with a user's account.
 * 
 * @param {IDeskproClient} client - The Deskpro client.
 */
export async function getDetailedSheets(client: IDeskproClient): Promise<DetailedSheet[]> {
    try {
        // Get the metadata for all the sheets associated to a user's account.
        const sheets = await getSheets(client)
        if (!sheets.data.length) {
            return []
        }

        // Get full info of the sheets in parallel and filter out failed attempts.
        const detailedSheets: DetailedSheet[] = (await Promise.all(
            sheets.data.map(async (sheet) => {
                try {
                    const fullSheetData = await getSheetDetails(client, sheet.id)
                    return { metadata: sheet, data: fullSheetData }
                } catch (e) {
                    // Skip failed sheets without crashing the app.
                    return null;
                }
            })
        )).filter((sheet): sheet is DetailedSheet => sheet !== null)

        return detailedSheets
    } catch (e) {
        return []
    }
}