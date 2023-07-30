import { useEffect, useRef } from "react";
import "./ChatWindow.css";
import GPTLoadingIcon from "./GPTLoadingIcon";

export default function ChatWindow({ messages, onMessageClick, loadingAuthor, className }) {
    const scrollableDiv = useRef(null);

    useEffect(() => {
        scrollableDiv.current.scrollTop = scrollableDiv.current.scrollHeight;
    },[messages,loadingAuthor]);

    return (
        <div ref={scrollableDiv} className={`ChatWindow ${className}`}>
            { messages ? messages.map(message => (
                <div className="row">
                    <div className="col-3">{ message.author }</div>
                    <div className="col-9" onClick={() => onMessageClick(message.content)}>{ message.content }</div>
                </div>
            )) : null }
            { loadingAuthor ? (
                <div className="row">
                    <div className="col-3">{ loadingAuthor }</div>
                    <div className="col-9">
                        <GPTLoadingIcon size={20} center={false} />
                    </div>
                </div>
            ) : null }
        </div>
    );
}