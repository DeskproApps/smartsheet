import { Button, Checkbox, P1, Spinner, Stack } from "@deskpro/deskpro-ui"
import { Container } from "@/components/Layout/Container"
import { Dispatch, FC, Fragment } from "react"
import { HorizontalDivider } from "@deskpro/app-sdk"
import { Maybe } from "@/types/general"
import { Sheet, SheetMetadata, Task } from "@/types/smartsheet"
import Card from "@/components/Card"
import ProjectFilter from "./ProjectFilter"
import SearchInput from "@/components/SearchInput"
import TaskDetail from "@/components/TaskDetail"
import TwoColumnNavigation from "@/components/TwoColumnNavigation"

interface LinkTasksProps{
    onCreateTaskClick: () => void
    onChangeSearch: (search: string) => void
    selectedTaskIds: Task["id"][]
    selectedSheetId: Maybe<Sheet["id"]>
    sheets: SheetMetadata[]
    tasks: Task[]
    onChangeProject: Dispatch<Maybe<Sheet["id"]>>
    isLoading: boolean
    isSubmitting: boolean
    onLinkTasks: () => void
    onTaskSelectionChange: (task: Task) => void
}

const LinkTasks: FC<LinkTasksProps> = (props)=>{

    const {
        onCreateTaskClick, 
        onChangeSearch,
        onTaskSelectionChange,
        onLinkTasks,
        selectedTaskIds,
        selectedSheetId,
        sheets,
        onChangeProject,
        tasks,
        isLoading,
        isSubmitting
    } = props

    return(
        <>
        <Container >
             <TwoColumnNavigation selected="one" onTwoNavigate={onCreateTaskClick}/>
            <SearchInput onChange={onChangeSearch}/>
            <ProjectFilter selectedSheetId={selectedSheetId} onChangeProject={onChangeProject} sheets={sheets}/>
            <Stack>
                <Button type={"button"} onClick={onLinkTasks} loading={isSubmitting} disabled={selectedTaskIds.length<1} text={selectedTaskIds.length === 1 ? "Link Task" : "Link Tasks"} intent="primary"/>
            </Stack>

        </Container>
        
        <HorizontalDivider/>

        <Container>
            
            {isLoading? (
                <Stack style={{justifyContent: "center", padding: "10px"}}>
                    <Spinner/>
                </Stack>) : 
            
            (<>
            {!tasks.length? <P1>No tasks found.</P1>: (<>
            
            {tasks.map((task)=>(
                <Fragment key={task.id}>
                    <Card>
                        <Card.Media>
                            <Checkbox
                            size={12}
                            checked={selectedTaskIds.some((taskId) => task.id === taskId)}
                            containerStyle={{ marginTop: 4 }}
                            onClick={()=>onTaskSelectionChange(task)}
                            />
                        </Card.Media>
                        <Card.Body>
                            <TaskDetail task={task} onClickTitle={()=>onTaskSelectionChange(task)}/>
                        </Card.Body>
                    </Card>
                    <HorizontalDivider style={{ marginBottom: 6 }} />
                </Fragment>
            ))}
            </>)}
            
            </>)}
        </Container>
        </>
    )
}

export default LinkTasks