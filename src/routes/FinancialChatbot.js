import { useState } from "react";
import TaskList from "../components/TaskList";

export default function FinancialChatbot() {
    const [tasks,setTasks] = useState({
        "Rates": false,
        "Terms": false,
        "Invoices": false
    });
    const [selectedKey,setSelectedKey] = useState(null);

    return (
        <>
            <TaskList tasks={tasks} setTasks={setTasks} />
        </>
    );
}