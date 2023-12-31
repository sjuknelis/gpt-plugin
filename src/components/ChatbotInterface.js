import { useEffect, useState } from 'react';
import ChatWindow from './ChatWindow';
import GPTLoadingIcon from './GPTLoadingIcon';
import './ChatbotInterface.css';

function sendContentScriptMessage(data) {
    return new Promise((resolve,reject) => {
        // eslint-disable-next-line no-undef
        chrome.tabs.query({active: true,currentWindow: true},tabs => {
            const id = tabs[0].id;
            // eslint-disable-next-line no-undef
            chrome.tabs.sendMessage(id,data,response => resolve(response));
        });
    });
}

async function gptLoadingWrapper(func,setIsGPTLoading) {
    setIsGPTLoading(true);
    await func();
    setIsGPTLoading(false);
}

export default function ChatbotInterface({ questionPlaceholder, choiceFormula, choiceCommentFormula, answerFormula }) {
    const [chatQuestion,setChatQuestion] = useState("");
    const [submittedQuestion,setSubmittedQuestion] = useState("");
    const [choice,setChoice] = useState("");

    useEffect(() => {
        if ( submittedQuestion != "" ) setChoice("");
    },[submittedQuestion]);

    return (
        <div className="App">
            <ContentChatWindow submitQuestion={setChatQuestion} />
            <br />
            <QuestionArea questionPlaceholder={questionPlaceholder} initialQuestion={chatQuestion} submitQuestion={setSubmittedQuestion} />
            <br />
            <ChoicesArea question={submittedQuestion} submitChoice={setChoice} choiceFormula={choiceFormula} choiceCommentFormula={choiceCommentFormula} />
            <br />
            <AnswerArea choice={choice} answerFormula={answerFormula} />
        </div>
    );
}

function ContentChatWindow({ submitQuestion }) {
    const [chatData,setChatData] = useState({status: "noconn"});

    function forwardAssignAuthors(messages) {
        for ( let i = 1; i < messages.length; i++ ) {
            if ( messages[i].author == null ) messages[i].author = messages[i - 1].author;
        }
        return messages.filter(message => message.content != "You removed this message");
    }

    useEffect(() => {
        async function pingForData() {
            const response = await sendContentScriptMessage({type: "ping"});
            setChatData({
                status: response.status,
                messages: response.messages ? forwardAssignAuthors(response.messages) : null
            });
        }

        pingForData();
        setInterval(pingForData,250);
    },[]);

    return (
        <ChatWindow messages={chatData.messages} onMessageClick={submitQuestion} className="ContentChatWindow-InnerWindow" />
    );
}

function QuestionArea({ questionPlaceholder, initialQuestion, submitQuestion }) {
    const [question,setQuestion] = useState("");

    useEffect(() => {
        setQuestion(initialQuestion);
    },[initialQuestion]);

    return (
        <div className="row">
            <div className="col-9">
                <textarea className="form-control" rows="3" placeholder={questionPlaceholder + "..."} value={question} onChange={e => setQuestion(e.target.value)}></textarea>
            </div>
            <div className="col-3">
                <button className="btn btn-primary full-size" onClick={() => submitQuestion(question)}>Submit question</button>
            </div>
        </div>
    );
}

function ChoicesArea({ question, submitChoice, choiceFormula, choiceCommentFormula }) {
    const [choices,setChoices] = useState(null);
    const [choiceComment,setChoiceComment] = useState(null);
    const [isGPTLoading,setIsGPTLoading] = useState(false);

    useEffect(() => {
        if ( question != "" ) {
            gptLoadingWrapper(async () => {
                setChoices(await choiceFormula(question));
                if ( choiceCommentFormula ) setChoiceComment(await choiceCommentFormula(question));
            },setIsGPTLoading);
        }
    },[question,choiceFormula,choiceCommentFormula]);

    if ( isGPTLoading ) return (<GPTLoadingIcon size={48} center={true} />);

    if ( choices == null ) return null;

    return (
        <div className="row ChoicesArea">
            { choices.map(choice => (
                <button className="btn btn-outline-primary" onClick={() => submitChoice(choice)}>{ choice }</button>
            )) }

            { choiceComment != null ? (
                <p className="ChoicesArea-GPTRecommendation">GPT Recommendation: { choiceComment }</p>
            ) : null }
        </div>
    );
}

function AnswerArea({ choice, answerFormula }) {
    const [answer,setAnswer] = useState("");
    const [isGPTLoading,setIsGPTLoading] = useState(false);
        
    useEffect(() => {
        if ( choice != "" ) {
            gptLoadingWrapper(async () => setAnswer(await answerFormula(choice)),setIsGPTLoading);
        } else {
            setAnswer("");
        }
    },[choice,answerFormula]);

    async function submitAnswer() {
        await sendContentScriptMessage({type: "submit_text", data: answer});
    }

    if ( isGPTLoading ) return (<GPTLoadingIcon size={48} center={true} />);

    if ( answer == "" ) return null;
    
    return (
        <div className="row">
            <div className="col-9">
                <p className="AnswerArea-Answer">{ answer }</p>
            </div>
            <div className="col-3">
                <button className="btn btn-primary full-size" onClick={submitAnswer}>Submit answer</button>
            </div>
        </div>
    );
}