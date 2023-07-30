let messageHistory = [];

async function gptRequest(messageContent) {
    messageHistory.push({role: "user", content: messageContent});
    const fetchResponse = await fetch("http://localhost:8000/gpt_request",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(messageHistory)
    });
    const response = await fetchResponse.json();
    messageHistory.push(response);
    return response.content;
}

function setMessageHistory(newMessageHistory) {
    messageHistory = newMessageHistory;
}

export { messageHistory, gptRequest, setMessageHistory };