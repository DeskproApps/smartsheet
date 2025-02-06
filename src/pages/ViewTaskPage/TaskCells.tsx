import { Container } from "@/components/Layout/Container"
import { FC } from "react"
import { H1, Stack } from "@deskpro/deskpro-ui"
import { ExternalIconLink, Property, } from "@deskpro/app-sdk"
import { Task } from "@/types/smartsheet"
import parseStringWithLinks from "@/utils/parseStringWithLinks"
import SmartsheetLogo from "@/components/SmartsheetLogo"

interface TaskCellsProps {
    task: Task
}

const TaskCells: FC<TaskCellsProps> = (props) => {
    const { task } = props

    const filteredRow = task.items.filter(item => !item.isPrimary)
    return (
        <Container>
            <Stack vertical>
                <Stack gap={12} style={{ justifyContent: "space-between", width: "100%" }}>
                    <H1>{task.title}</H1>
                    <ExternalIconLink href={task.sheet.liveLink} icon={<SmartsheetLogo />} />
                </Stack>

                <Property label={"Project"} text={task.sheet.name} />
                {filteredRow.map((cell) => {
                    return (<Property label={cell.title} text={parseStringWithLinks(cell.value)} />)
                })}
            </Stack>

        </Container>
    )
}

export default TaskCells