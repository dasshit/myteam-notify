import { context } from "@actions/github";
import fetch from "node-fetch";
import { getInput, setOutput } from "@actions/core";
import { stringify } from "yaml";
import { FormData, File } from "formdata-node";
import { zipdir } from 'zip-dir';


function assembleMsg(github) {

    let newMsgText = `<code><a href="${github.sender.html_url}">${github.sender.login}</a> did some changes in repository:\n\n`

    newMsgText += stringify(github.commits)

    newMsgText += '</code>'

    return newMsgText
}


function createUrlWithParams(apiUrl: string, path: string, params: Object) : URL {

    let url = new URL(`${apiUrl}${path}`)

    Object.keys(params).forEach(
        key => {
            console.log(`${key} => ${params[key]}`)
            url.searchParams.append(key, params[key])
        }
    )

    return url

}


function sendMsg (method: string, url: URL, form?: FormData) {

    console.log(`URL: ${url}`)
    console.log(form)

    fetch(
        url.toString(), {
            method: method,
            // @ts-ignore
            body: form

        }
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
        'GET',
        createUrlWithParams(
            getInput('api-url', {}),
            "/messages/sendText",
            {
                token: getInput('bot-token', {}),
                chatId: getInput('chat-id', {}),
                text: getInput('msg-text', {}) || assembleMsg(context.payload),
                parseMode: getInput('parseMode', {})
            }
        )
    )

}

export async function sendFilesMsg(path: string) {

    zipdir(path, function (err, buffer) {
        let form = new FormData();

        form.set(
            "file", new File(
                buffer,
                "artifacts.zip"
            )
        )

        sendMsg(
            'POST',
            createUrlWithParams(
                getInput('api-url', {}),
                "/messages/sendFile",
                {
                    token: getInput('bot-token', {}),
                    chatId: getInput('chat-id', {}),
                }
            ),
            form
        )
    });

}
