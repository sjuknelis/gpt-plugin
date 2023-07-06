let message = {status: "wait"};

function objectForElement(el) {
    return {
        message: el.getElementsByClassName("story-message")[0].innerText,
        author: (el.getElementsByClassName("user-name")[0] || {innerText: null}).innerText
    }
}

window.addEventListener("load",() => {
    console.log("gpt plugin");
    setInterval(() => {
        let data = [];
        for ( const el of document.getElementsByClassName("up-d-story-item") ) {
            data.push(objectForElement(el));
        }
        message = {
            status: "ready",
            data
        };
    },250);
});

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(function(senderMessage,sender,sendResponse) {
    sendResponse(message);
});