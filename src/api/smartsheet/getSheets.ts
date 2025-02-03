import { baseRequest } from "../baseRequest";
import { IDeskproClient } from "@deskpro/app-sdk";
import { SheetMetadata, SmartSheetPageResponse } from "@/types/smartsheet";


/**
 * Retrievies the metadata of the sheets (projects) associated with a user's account.
 * 
 * @param {IDeskproClient} client - The Deskpro client.
 * 
 */
export async function getSheets(client: IDeskproClient): Promise<SmartSheetPageResponse<SheetMetadata>>{
    try{
        return baseRequest<SmartSheetPageResponse<SheetMetadata>>(client, {url: "/sheets"})
    } catch(e){
        const failData: SmartSheetPageResponse<SheetMetadata>= {
            pageNumber: 0,
            pageSize: 0,
            totalPages: 0,
            totalCount: 0,
            data: []
        }
        return failData
    }
}