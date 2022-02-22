import { context } from "@actions/github";
import fetch from "node-fetch";
import { getInput, setOutput } from "@actions/core";
import { stringify } from "yaml"
import { FormData, File } from "formdata-node";
// import { sync } from "zipper";
import { sync } from "zip-local";


function assembleMsg(github) {

    let newMsgText = `<code><a href="${github.sender.html_url}">${github.sender.login}</a> did some changes in repository:\n\n`

    newMsgText += stringify(github.commits)

    newMsgText += '</code>'

    return newMsgText
}


function createUrlWithParams(apiUrl: string, params: Object) : URL {

    let url = new URL(`${getInput('api-url', {})}/messages/sendText`)

    Object.keys(params).forEach(
        key => {
            console.log(`${key} => ${params[key]}`)
            url.searchParams.append(key, params[key])
        }
    )

    return url

}


function sendMsg (url: URL, form?: FormData) {



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


export function sendTextMsg() {


    sendMsg(
        createUrlWithParams(
            `${getInput('api-url', {})}/messages/sendText`,
            {
                token: getInput('bot-token', {}),
                chatId: getInput('chat-id', {}),
                text: getInput('msg-text', {}) || assembleMsg(context.payload),
                parseMode: getInput('parseMode', {})
            }
        )
    )

}

export function sendFilesMsg(path: string) {

    let buff = sync.zip(path).memory();

    let form = new FormData();

    form.append(
        "file", new File(
            buff, "artifacts.zip"
        )
    )

    sendMsg(
        createUrlWithParams(
            `${getInput('api-url', {})}/messages/sendFile`,
            {
                token: getInput('bot-token', {}),
                chatId: getInput('chat-id', {}),
            }
        ),
        form
    )

}
