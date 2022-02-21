import core from "@actions/core";
import github from "@actions/github";
import fetch from "node-fetch";

import YAML from 'yaml'


function assembleMsg(github_context) {

    const payload = JSON.stringify(github_context, undefined, 2)

    console.log(payload)

    let newMsgText = `<code><a href="${payload.sender.html_url}">${payload.sender.login} did some changes in repository\n\n\n`

    newMsgText += YAML.stringify(
        JSON.stringify(payload.commits)
    )

    newMsgText += '<code>'

    return newMsgText
}


try {
    const apiUrl = core.getInput('api-url')
    const botToken = core.getInput('bot-token')
    const chatId = core.getInput('chat-id')
    const msgText = core.getInput('msg-text')
    const parseMode = core.getInput('parseMode')

    let url = new URL(`${apiUrl}/messages/sendText`)

    const params = {
        token: botToken,
        chatId: chatId,
        text: msgText || assembleMsg(github.context.payload),
        parseMode:parseMode
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
