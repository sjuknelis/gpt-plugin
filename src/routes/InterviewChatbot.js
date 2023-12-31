import { useEffect } from "react";
import ChatbotInterface from "../components/ChatbotInterface";
import useSettings from "../hooks/useSettings";
import { messageHistory, gptRequest, setMessageHistory } from "../lib/gptRequest";

export default function InterviewChatbot() {
    const [settings,setSettings] = useSettings();

    useEffect(() => {
        setMessageHistory([
            {role: "system", content: `You are an assistant helping a freelancer during an interview with a potential client. Here is the freelancer's resume: ${settings.resume}`},
            {role: "system", content: `Here is the job description: ${settings.jobDescription}`}
        ]);
    },[]);

    return (
        <ChatbotInterface
            questionPlaceholder="Interviewer question"
            choiceFormula={async question => {
                return (await gptRequest(`The client just asked this question: "${question}" Based on the freelancer's resume and the job description, describe three categories of response that the freelancer might give to this question, each in four words or less.`)).split("\n");
            }}
            answerFormula={async choice => {
                return await gptRequest(`Using the topic "${choice}" and in at least four sentences, write an answer from the freelancer to the question that the client posed.`);
            }}
        />
    );
}