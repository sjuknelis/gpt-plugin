import { useState } from 'react';
import ChatbotInterface from '../components/ChatbotInterface';
import useSettings from '../hooks/useSettings';

export default function InterviewChatbot() {
    const [settings,setSettings] = useSettings();

    const [messageHistory,setMessageHistory] = useState([
        {role: "system", content: `You are an assistant helping a freelancer during an interview with a potential client. Here is the freelancer's resume: ${settings.resume}`},
        {role: "system", content: `Here is the job description: ${settings.jobDescription}`}
    ]);

    async function gptRequest(messageContent) {
        const message = {role: "user", content: messageContent};
        const fetchResponse = await fetch("http://localhost:8000/gpt_request",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messageHistory.concat([message]))
        });
        const response = await fetchResponse.json();
        setMessageHistory(messageHistory.concat([message,response]));
        return response.content;
    }

    return (
        <ChatbotInterface
            choiceFormula={async question => {
                return (await gptRequest(`The client just asked this question: "${question}" Based on the freelancer's resume and the job description, describe three categories of response that the freelancer might give to this question, each in four words or less.`)).split("\n");
            }}
            answerFormula={async choice => {
                return await gptRequest(`Using the topic "${choice}" and in at least four sentences, write an answer from the freelancer to the question that the client posed.`);
            }}
        />
    );
}