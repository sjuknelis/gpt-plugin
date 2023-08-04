import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import ChatbotInterface from "../components/ChatbotInterface";
import { gptRequest, messageHistory, setMessageHistory } from "../lib/gptRequest";
import useSettings from "../hooks/useSettings";

export default function FinancialChatbot() {
    const [settings,setSettings] = useSettings();

    useEffect(() => {
        setMessageHistory([
            {role: "system", content: `You are an assistant helping a freelancer to manage their financial arrangements with a client. Here is the freelancer's resume: ${settings.resume}`},
            {role: "system", content: `Here is the job description: ${settings.jobDescription}`}
        ]);
    },[]);

    const [selectedTask,setSelectedTask] = useState(null);

    return (
        <>
            <TaskList selectedTask={selectedTask} setSelectedTask={setSelectedTask} />
            <br />
            <ChatbotInterface
                questionPlaceholder="Finance question from client (leave blank to create a topic prompt for the client)..."
                choiceFormula={async question => {
                    return await gptRequest(``);
                }}
                answerFormula={async choice => {

                }}
            />
        </>
    );
}