const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
//const cheerio = require("cheerio");
//const request = require("request-promise");

const config = new Configuration({
    apiKey: fs.readFileSync("apikey.txt").toString()
});
const openai = new OpenAIApi(config);

/*let informData = [];
(async function() {
    const urlItems = JSON.parse(fs.readFileSync("inform_urls.json").toString());

    const contentItems = [];
    const promises = [];

    for ( const urlItem of urlItems ) {
        promises.push(new Promise(async (resolve,reject) => {
            const elSelector = await request({
                method: "GET",
                uri: urlItem.url,
                transform: body => cheerio.load(body)
            });
            elSelector("script").remove();
            contentItems.push({
                text: elSelector("body").text().replaceAll("\t","").replaceAll("\n",""),
                topic: urlItem.topic
            });
            resolve();
        }));
    }

    await Promise.all(promises);

    informData = contentItems.map(item => {
        return {
            role: "system",
            content: `Here is the scraped text of an article about ${item.topic}: ${item.text}`
        }
    });
})();*/

const informData = JSON.parse(fs.readFileSync("inform_data.json").toString()).map(item => {
    return {
        role: "system",
        content: `Here is the text of an article about ${item.topic}: ${item.text}`
    }
});

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

app.get("/inform_msgs",async (request,response) => {
    response.send(informData);
});

const port = process.argv[2] || 8000;
app.listen(port,() => {
    console.log(`Listening on port ${port}`);
});