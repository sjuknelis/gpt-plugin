import "./TaskList.css";

export default function TaskList({ tasks, setTasks, selectedKey, setSelectedKey }) {
    function onTaskClick(key) {
        if ( tasks[key] ) {
            updateTask(key,false);
        } else if ( key == selectedKey ) {
            updateTask(key,true);
            setSelectedKey(null);
        } else {
            setSelectedKey(key);
        }
    }

    function updateTask(key,value) {
        const tasksClone = Object.assign({},tasks);
        tasksClone[key] = value;
        setTasks(tasksClone);
    }

    return (
        <div className="TaskList">
            { Object.keys(tasks).map(key => (
                <div className="row TaskList-Row">
                    <div className="col-2">
                        <div
                            className={`TaskList-Box TaskList-Box${tasks[key] ? "Green" : (key == selectedKey ? "Yellow" : "White")}`}
                            onClick={() => onTaskClick(key)}
                        ></div>
                    </div>
                    <div className="col-10 TaskList-Name">
                        <span>{ key }</span>
                    </div>
                </div>
            )) }
        </div>
    );
}