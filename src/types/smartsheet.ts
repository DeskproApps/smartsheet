export interface SmartSheetPageResponse<T = unknown>{
    pageNumber: number
    pageSize: number
    totalPages: number
    totalCount: number
    data: T[]
}

export type ResourceAccessLevel = "ADMIN" | "COMMENTER" | "EDITOR" | "EDITOR_SHARE" | "OWNER" | "VIEWER"
export type ResourceManagementType = "NONE" | "AUTO" | "MANUAL"

export interface SheetMetadata {
    id: number
    name: string
    accessLevel: ResourceAccessLevel
    createdAt: string
    modifiedAt: string
}

export type SmartsheetColumnType ="TEXT_NUMBER" | "DATE" | "PICKLIST" | "CONTACT_LIST" | "CHECKBOX" | "CELL_LINK" | "TIMESTAMP"

export interface SheetColumn {
    id: number; 
    version: number
    index: number;
    title: string; 
    type: SmartsheetColumnType
    width: number; 
    primary?: boolean
    description?: string
    validation: boolean 
    symbol?: string; 
    locked?: boolean; 
    hidden?: boolean; 
    options?: string[]; 
    resourceManagementType?: ResourceManagementType
  }

export interface SheetRowCell{
    columnId: number
    value?: string | number | boolean | null
    displayValue?: string
    locked?: boolean
    formula?: string
}

export interface SheetRow {
    id: number
    rowNumber: number
    parentId?: number
    siblingId?: number
    expanded: boolean
    createdAt: string
    modifiedAt: string
    cells?: SheetRowCell[]
}

export interface Sheet {
    id: number
    name: string
    version: number
    totalRowCount: number
    accessLevel: ResourceAccessLevel
    effectiveAttachmentOptions?: string[]
    ganttEnabled: boolean
    dependenciesEnabled: boolean
    resourceManagementEnabled: boolean
    resourceManagementType: ResourceManagementType
    cellImageUploadEnabled: boolean
    readOnly?: boolean
    userSettings: {
        criticalPathEnabled: boolean
        displaySummaryTasks: boolean
    }
    cardSettings:{
        viewByColumnId: number
        level: number
    }
    workspace:{
        id: number
        name: string
    }
    permalink: string
    createdAt: string
    modifiedAt: string
    isMultiPicklistEnabled: boolean
    columns: SheetColumn[]
    rows: SheetRow[]

}


export interface DetailedSheet {
    metadata: SheetMetadata
    data: Sheet
}