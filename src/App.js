import ChatbotInterface from './ChatbotInterface';
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