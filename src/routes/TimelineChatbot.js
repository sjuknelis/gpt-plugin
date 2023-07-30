import { useEffect } from "react";
import ChatbotInterface from "../components/ChatbotInterface";
import useSettings from "../hooks/useSettings";
import { messageHistory, gptRequest, setMessageHistory } from "../lib/gptRequest";

export default function TimelineChatbot() {
    const [settings,setSettings] = useSettings();
    
    useEffect(() => {
        setMessageHistory([
            {role: "system", content: `You are an assistant helping a freelancer manage client expectations. Here is the job description: ${settings.jobDescription}`}
        ]);
    });
    
    return (
        <ChatbotInterface
            questionPlaceholder="Task description"
            choiceFormula={async question => {
                return ["Accept","Reject"];
            }}
            choiceCommentFormula={async question => {
                return (
                    await gptRequest(`Should the freelancer take on this request from the client: "${question}" Answer in one word which is either accept or reject.`) +
                    "\nTime estimate: " +
                    await gptRequest("How long would this task be estimated to take if accepted? Answer briefly.")
                );
            }}
            answerFormula={async choice => {
                return await gptRequest(
                    `The freelancer decided to ${choice.toLowerCase()} the task. In exactly four sentences, write` +
                    (choice == "Accept" ? "a justification for the length of time the task will take" : "a justification for rejecting the task") +
                    "from the point of view of the freelancer sending a semi-formal instant message to the client. Do not address the client or sign the message."
                );
            }}
        />
    );
}