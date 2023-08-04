import { useEffect, useState } from "react";
import "./TaskList.css";

export default function TaskList({ selectedTask, setSelectedTask }) {
    const [tasks,setTasks] = useState(
        localStorage.getItem("tasks") ?
        JSON.parse(localStorage.getItem("tasks")) :
        {
            "Negotiating rates": false,
            "Setting terms of payment": false,
            "Writing/sending invoices": false
        }
    );

    useEffect(() => {
        localStorage.setItem("tasks",JSON.stringify(tasks));
    },[tasks]);

    function onTaskClick(task) {
        if ( tasks[task] ) {
            updateTask(task,false);
        } else if ( task == selectedTask ) {
            updateTask(task,true);
            setSelectedTask(null);
        } else {
            setSelectedTask(task);
        }
    }

    function updateTask(task,value) {
        const tasksClone = Object.assign({},tasks);
        tasksClone[task] = value;
        setTasks(tasksClone);
    }

    return (
        <div className="TaskList">
            { Object.keys(tasks).map(task => (
                <div className="row TaskList-Row">
                    <div className="col-2">
                        <div
                            className={`TaskList-Box TaskList-Box${tasks[task] ? "Green" : (task == selectedTask ? "Yellow" : "White")}`}
                            onClick={() => onTaskClick(task)}
                        ></div>
                    </div>
                    <div className="col-10 TaskList-Name">
                        <span>{ task }</span>
                    </div>
                </div>
            )) }
        </div>
    );
}