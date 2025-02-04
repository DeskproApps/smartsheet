import { FC } from "react";
import { Spinner, Stack } from "@deskpro/deskpro-ui";
import { TicketData } from "@/types";
import { useDeskproAppClient, useDeskproElements, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import getRegisteredTaskIds from "@/api/deskpro";

const RedirectPage: FC = () => {
    const { client } = useDeskproAppClient()
    const { context } = useDeskproLatestAppContext<TicketData, unknown>()
    const navigate = useNavigate()
    
    useDeskproElements(({ registerElement, clearElements }) => {
        clearElements();
        registerElement("refresh", { type: "refresh_button" });
      });


    if (!client || !context?.data?.ticket.id) return (
    <Stack padding={20} justify={"center"}>
        <Spinner/>
    </Stack>
      )


    getRegisteredTaskIds(client, context?.data?.ticket.id).then((linkedTaskIds)=>{
        linkedTaskIds.length<1? navigate("/link-task"):
        navigate("/home")
      }).catch(()=>{navigate("/link-task")})
  
    
  
    return (
        <Stack padding={20} justify={"center"}>
            <Spinner/>
        </Stack>
    );
  };
  
  export default RedirectPage