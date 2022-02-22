import {context} from "@actions/github";
import fetch from "node-fetch";
import { getInput, setOutput } from "@actions/core";
import { stringify } from "yaml";
import { File, FormData } from "formdata-node";
import archiver from 'archiver';
import { readFileSync, createWriteStream, createReadStream } from 'fs';
import { getAllFilesSync } from "get-all-files";
import { basename } from "path";


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


function zipDirectories(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = createWriteStream(outPath);

    return new Promise<void>((resolve, reject) => {
        stream.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            resolve();
        });

        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                console.log(err, err.stack)
            } else {
                console.log(err, err.stack)
                reject();
                throw err;
            }
        });

        archive.on('error', function(err) {
            console.log(err, err.stack)
            reject();
            throw err;
        });

        archive.pipe(stream);

        for (let name of getAllFilesSync(sourceDir)) {
            archive.append(
                createReadStream(name), { name: basename(name) });
        }

        archive.finalize();
    })
}


export async function sendFilesMsg(path: string) {

    zipDirectories(path, "./artifacts.zip").then(
        res => {
            let form = new FormData();

            form.set(
                "file", new File(
                    readFileSync("./artifacts.zip"),
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
        }
    )


}
