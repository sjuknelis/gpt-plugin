import "./ChatWindow.css";

export default function ChatWindow({ messages, onMessageClick, className }) {
    return (
        <div className={`ChatWindow ${className}`}>
            { messages ? messages.map(message => (
                <div className="row">
                    <div className="col-3">{ message.author }</div>
                    <div className="col-9" onClick={() => onMessageClick(message.content)}>{ message.content }</div>
                </div>
            )) : null }
        </div>
    );
}