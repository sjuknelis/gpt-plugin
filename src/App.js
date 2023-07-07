import React, { useEffect, useState } from 'react';
import './App.css';

async function gptRequest(message) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve("1. a\n2. b\n3. c")
        },3000);
    });
}

export default function App() {
    return (
        <ChatbotInterface
            choiceFormula={async question => {
                return (await gptRequest("x")).split("\n");
            }}
            answerFormula={async choice => {
                return await gptRequest("y");
            }}
        />
    )
}

function getTabID(callback) {
    // eslint-disable-next-line no-undef
    chrome.tabs.query({active: true,currentWindow: true},tabs => {
        callback(tabs[0].id);
    });
}

async function gptLoadingWrapper(func,callback,setIsGPTLoading) {
    setIsGPTLoading(true);
    const data = await func();
    setIsGPTLoading(false);
    callback(data);
}

function ChatbotInterface({ choiceFormula,answerFormula }) {
    const [chatQuestion,setChatQuestion] = useState("");
    const [submittedQuestion,setSubmittedQuestion] = useState("");
    const [choice,setChoice] = useState("");

    return (
        <div className="App">
            <ChatWindow submitQuestion={setChatQuestion} />
            <br />
            <QuestionArea initialQuestion={chatQuestion} submitQuestion={setSubmittedQuestion} />
            <br />
            <ChoicesArea question={submittedQuestion} submitChoice={setChoice} choiceFormula={choiceFormula} />
            <br />
            <AnswerArea choice={choice} answerFormula={answerFormula} />
        </div>
    );
}

function ChatWindow({ submitQuestion }) {
    const [chatData,setChatData] = useState({status: "noconn"});

    function forwardAssignAuthors(messages) {
        for ( let i = 1; i < messages.length; i++ ) {
            if ( messages[i].author == null ) messages[i].author = messages[i - 1].author;
        }
        return messages.filter(message => message.content != "You removed this message");
    }

    useEffect(() => {
        getTabID(id => {
            function pingForData() {
                // eslint-disable-next-line no-undef
                chrome.tabs.sendMessage(id,{type: "ping"},receivedData => {
                    setChatData({
                        status: receivedData.status,
                        messages: receivedData.messages ? forwardAssignAuthors(receivedData.messages) : undefined
                    });
                });
            }

            pingForData();
            setInterval(pingForData,250);
        });
    },[]);

    return (
        <div class="ChatWindow">
            { chatData.messages ? chatData.messages.map(message => (
                <div class="row">
                    <td class="col-3">{ message.author }</td>
                    <td class="col-9" onClick={() => submitQuestion(message.content)}>{ message.content }</td>
                </div>
            )) : null }
        </div>
    );
}

function QuestionArea({ initialQuestion,submitQuestion }) {
    const [question,setQuestion] = useState("");

    useEffect(() => {
        setQuestion(initialQuestion);
    },[initialQuestion]);

    return (
        <div class="row">
            <div class="col-9">
                <textarea class="form-control" rows="3" placeholder="Interviewer question..." value={question} onChange={e => setQuestion(e.target.value)}></textarea>
            </div>
            <div class="col-3">
                <button class="btn btn-primary full-size" onClick={() => submitQuestion(question)}>Submit question</button>
            </div>
        </div>
    );
}

function ChoicesArea({ question,submitChoice,choiceFormula }) {
    const [choices,setChoices] = useState(null);
    const [isGPTLoading,setIsGPTLoading] = useState(false);

    useEffect(() => {
        if ( question != "" ) gptLoadingWrapper(async () => choiceFormula(question),setChoices,setIsGPTLoading);
    },[question]);

    if ( isGPTLoading ) return (<GPTLoadingIcon />);
    if ( choices == null ) return null;
    return (
        <div className="row ChoicesArea">
            { choices.map(choice => (
                <button class="btn btn-outline-primary" onClick={() => submitChoice(choice)}>{ choice }</button>
            )) }
        </div>
    );
}

function AnswerArea({ choice,answerFormula }) {
    const [answer,setAnswer] = useState("");
    const [isGPTLoading,setIsGPTLoading] = useState(false);
        
    useEffect(() => {
        if ( choice != "" ) gptLoadingWrapper(async () => answerFormula(choice),setAnswer,setIsGPTLoading);
    },[choice]);

    function submitAnswer() {
        getTabID(id => {
            // eslint-disable-next-line no-undef
            chrome.tabs.sendMessage(id,{type: "submit_text", data: answer},() => {});
        });
    }

    if ( isGPTLoading ) return (<GPTLoadingIcon />);
    if ( answer == "" ) return null;
    return (
        <div class="row">
            <div class="col-9">
                <p>{ answer }</p>
            </div>
            <div class="col-3">
                <button class="btn btn-primary full-size" onClick={submitAnswer}>Submit answer</button>
            </div>
        </div>
    );
}

function GPTLoadingIcon() {
    return (
        <div className="GPTLoadingIcon"></div>
    );
}