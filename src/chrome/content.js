let outgoingMessage = {status: "wait"};

function objectForElement(el) {
    return {
        content: el.getElementsByClassName("story-message")[0].innerText,
        author: (el.getElementsByClassName("user-name")[0] || {innerText: null}).innerText
    }
}

window.addEventListener("load",() => {
    console.log("gpt plugin");
    setInterval(() => {
        let messages = [];
        for ( const el of document.getElementsByClassName("up-d-story-item") ) {
            messages.push(objectForElement(el));
        }
        outgoingMessage = {
            status: "ready",
            messages
        };
    },250);
});

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener((incomingMessage,sender,sendResponse) => {
    if ( incomingMessage.type == "submit_text" ) {
        document.getElementsByClassName("ProseMirror")[0].children[0].innerText = incomingMessage.data;
    }
    sendResponse(outgoingMessage);
});