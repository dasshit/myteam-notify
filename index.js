const core = require('@actions/core');
const github = require('@actions/github');
import fetch from "node-fetch";

try {
    const apiUrl = core.getInput('api-url')
    const botToken = core.getInput('bot-token')
    const chatId = core.getInput('chat-id')
    const msgText = core.getInput('msg-text') || 'Test msg'

    var url = new URL(`${apiUrl}/messages/sendText`)

    const params = {
        token: botToken,
        chatId: chatId,
        text: msgText
    }

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    fetch(
        url.toString()
    ).then(res => res.text())
        .then(
            text => {
                console.log(text)
                core.setOutput("result", text)
            }
        )

    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);


} catch (error) {
    core.setFailed(error.message);
}
