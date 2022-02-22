import { getInput, setOutput, setFailed } from "@actions/core";
import { context } from "@actions/github";
import fetch from "node-fetch";

import { stringify } from 'yaml'


function assembleMsg(github) {

    let newMsgText = `<code><a href="${github.sender.html_url}">${github.sender.login}</a> did some changes in repository:\n\n`

    newMsgText += stringify(github.commits)

    newMsgText += '</code>'

    return newMsgText
}


export function run() {

    const apiUrl = getInput('api-url', {})
    const botToken = getInput('bot-token', {})
    const chatId = getInput('chat-id', {})
    const msgText = getInput('msg-text', {})
    const parseMode = getInput('parseMode', {})

    let url = new URL(`${apiUrl}/messages/sendText`)

    const params = {
        token: botToken,
        chatId: chatId,
        text: msgText || assembleMsg(context.payload),
        parseMode:parseMode
    }

    Object.keys(params).forEach(
        key => {
            console.log(`${key} => ${params[key]}`)
            url.searchParams.append(key, params[key])
        }
    )

    console.log(`URL: ${url}`)

    fetch(
        url.toString()
    ).then(res => res.text())
        .then(
            text => {
                console.log(text)
                setOutput("result", text)
            }
        )

}


try {
    run();
} catch (error) {
    setFailed(error.message);
}
