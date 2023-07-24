const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
    apiKey: fs.readFileSync("apikey.txt").toString()
});
const openai = new OpenAIApi(config);

const app = express();

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