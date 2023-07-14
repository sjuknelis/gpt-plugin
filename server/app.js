const express = require("express");
const app = express();
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
    apiKey: "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"
});
const openai = new OpenAIApi(config);

app.use(cors());

app.use(express.json());

app.post("/gpt_request",async (request,response) => {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: request.body
    });
    const responseContent = completion.data.choices[0].message;
    response.send(responseContent);
});

const port = process.argv[2] || 8000;
app.listen(port,() => {
    console.log(`Listening on port ${port}`);
});