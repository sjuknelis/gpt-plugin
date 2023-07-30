import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import ChatbotInterface from "../components/ChatbotInterface";
import { gptRequest, messageHistory } from "../gpt";
import useSettings from "../hooks/useSettings";

export default function FinancialChatbot() {
    const [settings,setSettings] = useSettings();

    useEffect(() => {
        messageHistory = [
            {role: "system", content: `You are an assistant helping a freelancer to manage their financial arrangements with a client. Here is the freelancer's resume: ${settings.resume}`},
            {role: "system", content: `Here is the job description: ${settings.jobDescription}`}
        ];
    },[]);

    const [tasks,setTasks] = useState({
        "Negotiating rates": false,
        "Setting terms of payment": false,
        "Writing/sending invoices": false
    });
    const [selectedKey,setSelectedKey] = useState(null);

    return (
        <>
            <TaskList tasks={tasks} setTasks={setTasks} selectedKey={selectedKey} setSelectedKey={setSelectedKey} />
            <ChatbotInterface
                questionPlaceholder="Finance question from client (leave blank to create prompt)..."
                choiceFormula={async question => {
                    return await gptRequest(``);
                }}
                answerFormula={async choice => {

                }}
            />
        </>
    );
}