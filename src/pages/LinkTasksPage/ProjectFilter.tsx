import { Select } from "@deskpro/deskpro-ui";
import { Sheet, SheetMetadata } from "@/types/smartsheet";
import Label from "@/components/Label";
import type { FC, Dispatch } from "react";

interface ProjectFilterProps {
    sheets: SheetMetadata[]
    selectedSheetId: Sheet["id"] | undefined
    onChangeProject: Dispatch<Sheet["id"] | undefined>
}


/**
 * A dropdown filter component for selecting a project sheet.
 *
 */
const ProjectFilter: FC<ProjectFilterProps> = (props) => {

    const { sheets, selectedSheetId, onChangeProject } = props

    const sheetOptions = sheets.map((sheet) => { return { label: sheet.name, value: String(sheet.id) } })

    return (
        <Label label="Projects">
            <Select
                fillWidth
                value={String(selectedSheetId)}
                options={[{ label: "All projects", value: undefined }, ...sheetOptions]}
                onChange={(option) => {
                    const optionValue = option.target.value
                    // Convert selected value to number or null before updating state
                    if (typeof optionValue === "string" && optionValue !== "All projects") {
                        onChangeProject(Number(optionValue))
                    } else {
                        onChangeProject(undefined)
                    }
                }}
                id="projects" />
        </Label>)
}

export default ProjectFilter