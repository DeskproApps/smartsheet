import { ExternalIconLink, Link, TwoProperties, } from "@deskpro/app-sdk";
import { FC } from "react";
import { H0, P5, Stack } from "@deskpro/deskpro-ui";
import { Task } from "@/types/smartsheet";
import DeskproTickets from "@/components/DeskproTickets";
import parseStringWithLinks from "@/utils/parseStringWithLinks";
import SmartsheetLogo from "@/components/SmartsheetLogo";

interface TaskDetailProps {
  task: Task
  onClickTitle?: () => void
}

const TaskDetail: FC<TaskDetailProps> = (props) => {
  const { task, onClickTitle } = props

  // Filter out the primary cell (The task title)
  const filteredItems = task.items.filter(item => !item.isPrimary)

  // Group filtered cells/items into pairs for easier display
  const filteredAndGroupedTasks: { title: string; value?: string }[][] =
    filteredItems.reduce<{ title: string; value?: string }[][]>((acc, _, i, arr) =>
      i % 2 === 0 ? [...acc, arr.slice(i, i + 2)] : acc
      , []);

  return (<Stack vertical gap={5}>
    <Stack gap={12} style={{ justifyContent: "space-between", width: "100%" }}>
      <H0>{!onClickTitle ? task.title : <Link style={{ cursor: "pointer" }} onClick={(e) => {
        e.preventDefault()
        onClickTitle && onClickTitle()
      }}>{task.title}</Link>}</H0>
      <ExternalIconLink href={task.sheet.liveLink} icon={<SmartsheetLogo />} />
    </Stack>

    <TwoProperties
      leftLabel="Project"
      leftText={<P5>{task.sheet.name}</P5>}
      rightLabel={"Deskpro Tickets"}
      rightText={<DeskproTickets entityId={task.id.toString()} />}
    />

    {filteredAndGroupedTasks.map((pair, index) => (
      <TwoProperties
        key={index}
        leftLabel={pair[0]?.title}
        leftText={parseStringWithLinks(pair[0]?.value)}
        rightLabel={pair[1]?.title}
        rightText={parseStringWithLinks(pair[1]?.value)}
      />
    ))}
  </Stack>)

}

export default TaskDetail