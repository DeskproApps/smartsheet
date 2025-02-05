import { getDetailedSheets, getSheetDetails, getSheets } from "@/api/smartsheet";
import { getTasksFromSheets } from "@/api/smartsheet/getTasksFromSheets";
import { QueryKey } from "@/query";
import { Maybe } from "@/types/general";
import { Sheet, SheetMetadata, Task,} from "@/types/smartsheet";
import { useQueryWithClient } from "@deskpro/app-sdk";

type UseTasksReturn =  {
    isLoading: boolean,
    sheets: SheetMetadata[],
    tasks: Task[],
  };

  export default function useTasks(sheetId?: Maybe<Sheet["id"]>): UseTasksReturn{

    
    const sheetsResponse = useQueryWithClient([QueryKey.SHEETS_META], getSheets)

    const detailedSheetsResponse = useQueryWithClient([QueryKey.DETAILED_SHEET, String(sheetId)], (client)=> 
        sheetId?  getSheetDetails(client,sheetId).then((data)=> [data]) : getDetailedSheets(client).then((data)=>{
            return data.map((sheet)=> sheet.data)
        }))

    return {
        isLoading: [sheetsResponse, detailedSheetsResponse].some(({isLoading})=> isLoading),
        sheets: sheetsResponse.data?.data ?? [],
        tasks: getTasksFromSheets(detailedSheetsResponse.data?? [])
    }
  }