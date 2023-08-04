import { useEffect, useRef, useState } from "react";
import ChatWindow from "../components/ChatWindow";
import TaskList from "../components/TaskList";
import { gptRequest, messageHistory, setMessageHistory } from "../lib/gptRequest";
import "./InformChatbot.css";

export default function InformChatbot() {
    const [dataMessages,setDataMessages] = useState(null);

    useEffect(() => {
        async function fetchDataMessages() {
            const response = await fetch("http://localhost:8000/inform_data");
            setDataMessages(await response.json());
        }

        fetchDataMessages();
    },[]);

    const [chatTask,setChatTask] = useState(null);
    const [messageList,setMessageList] = useState(null);
    const [isChatOpen,setIsChatOpen] = useState(false);

    useEffect(() => {
        if ( ! dataMessages || ! chatTask ) return;

        setIsChatOpen(true);

        setMessageHistory([
            {role: "system", content: `You are an assistant helping a freelancer by providing information about how they can successfully run their small business with regards to the following topic: ${chatTask}. You should use the following articles about this topic to guide your responses.`},
            ...(
                dataMessages
                    .filter(item => item.topic == chatTask)
                    .map(item => {
                        return {
                            role: "system",
                            content: `Here is an article about the topic of ${chatTask}: ${item.text}`
                        }
                    })
            ),
            {role: "assistant", content: "Hello! How can I help you?"}
        ]);
        setMessageList(messageHistory);
    },[chatTask]);

    const [selectedTask,setSelectedTask] = useState(null);

    useEffect(() => {
        if ( selectedTask ) setChatTask(selectedTask);
    },[selectedTask]);

    const reformatMessages = messages => messages.filter(message => message.role != "system").map(message => {
        return {
            author: ({
                "assistant": "GPT-Coworker",
                "user": "User"
            }[message.role]),
            content: message.content
        }
    });

    const messageInput = useRef(null);

    const [isGPTLoading,setIsGPTLoading] = useState(false);

    async function sendMessage() {
        const userMessage = messageInput.current.value;
        messageInput.current.value = "";
        setMessageList([
            ...messageList,
            {role: "user", content: userMessage}
        ]);

        setIsGPTLoading(true);
        await gptRequest(userMessage);
        setIsGPTLoading(false);

        setMessageList([...messageHistory]);
    }

    return (
        <>
            <TaskList selectedTask={selectedTask} setSelectedTask={setSelectedTask} />
            <br />
            {
                isChatOpen ? (
                    <>
                        <ChatWindow
                            messages={messageList ? reformatMessages(messageList) : null}
                            onMessageClick={() => {}}
                            loadingAuthor={isGPTLoading ? "GPT-Coworker" : null}
                            className="InformChatWindow"
                        />
                        <div className="row">
                            <div className="col-9">
                                <input ref={messageInput} type="text" className="MessageBox" onKeyDown={event => event.key == "Enter" ? sendMessage() : null} />
                            </div>
                            <div className="col-3">
                                <button className="btn btn-primary full-size" onClick={sendMessage}>Submit</button>
                            </div>
                        </div>
                    </>
                ) : null
            }
        </>
    );
}