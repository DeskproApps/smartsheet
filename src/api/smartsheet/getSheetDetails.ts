import { baseRequest } from "../baseRequest"
import { IDeskproClient } from "@deskpro/app-sdk"
import { Sheet } from "@/types/smartsheet"


/**
 * Retrieves the details of a specific sheet (project) using the provided sheet id.
 * 
 * @param {IDeskproClient} client - The Deskpro client.
 * @param {number} sheetId - The id of the sheet to fetch details for.
 * 
 */
export async function getSheetDetails(client: IDeskproClient, sheetId: number): Promise<Sheet | null> {
    try {
        return baseRequest<Sheet>(client, {url: `/sheets/${sheetId}`})
    } catch (e){
        return null
    }
}