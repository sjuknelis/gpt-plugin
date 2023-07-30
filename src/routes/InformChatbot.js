import { useEffect, useRef, useState } from "react";
import ChatWindow from "../components/ChatWindow";
import { gptRequest, messageHistory, setMessageHistory } from "../lib/gptRequest";
import "./InformChatbot.css";

export default function InformChatbot() {
    const [messageList,setMessageList] = useState(null);

    useEffect(() => {
        async function fetchDataMessages() {
            const response = await fetch("http://localhost:8000/inform_msgs");
            const dataMessages = await response.json();
            setMessageHistory([
                {role: "system", content: "You are an assistant helping a freelancer by providing information about how they can successfully run their small business."},
                ...dataMessages,
                {role: "assistant", content: "Hello! How can I help you?"}
            ]);
            setMessageList(messageHistory);
        }

        fetchDataMessages();
    },[]);

    const reformatMessages = messages => messages.filter(message => message.role != "system").map(message => {
        return {
            author: ({
                "assistant": "GPT-Coworker",
                "user": "User"
            }[message.role]),
            content: message.content
        }
    });

    const textBox = useRef(null);

    async function sendMessage() {
        const userMessage = textBox.current.value;
        textBox.current.value = "";
        await gptRequest(userMessage);
        setMessageList([...messageHistory]);
    }

    return (
        <>
            <ChatWindow messages={messageList ? reformatMessages(messageList) : null} onMessageClick={() => {}} className="InformChatWindow" />
            <br />
            <div className="row">
                <div className="col-9">
                    <input ref={textBox} type="text" className="MessageBox" onKeyDown={event => event.key == "Enter" ? sendMessage() : null} />
                </div>
                <div className="col-3">
                    <button className="btn btn-primary full-size" onClick={sendMessage}>Submit</button>
                </div>
            </div>
        </>
    );
}