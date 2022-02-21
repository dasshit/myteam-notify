import core from "@actions/core";
import github from "@actions/github";
import fetch from "node-fetch";

import { parse, stringify } from 'yaml'

try {
    const apiUrl = core.getInput('api-url')
    const botToken = core.getInput('bot-token')
    const chatId = core.getInput('chat-id')
    var msgText = core.getInput('msg-text')

    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);

    if (msgText === undefined) {

        const doc = new YAML.Document();
        doc.contents = payload;

        msgText = doc.toString()
    }

    var url = new URL(`${apiUrl}/messages/sendText`)

    const params = {
        token: botToken,
        chatId: chatId,
        text: msgText,
    }

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    console.log(`URL: ${url}`)

    fetch(
        url.toString()
    ).then(res => res.text())
        .then(
            text => {
                console.log(text)
                core.setOutput("result", text)
            }
        )


} catch (error) {
    core.setFailed(error.message);
}
