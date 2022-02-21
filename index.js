const core = require('@actions/core');
const github = require('@actions/github');
import fetch from "node-fetch";

try {
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);

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

} catch (error) {
    core.setFailed(error.message);
}
