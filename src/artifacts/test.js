import {context} from "@actions/github";
import fetch from "node-fetch";
import {getInput, setOutput} from "@actions/core";
import {stringify} from "yaml";
import {File, FormData} from "formdata-node";
import archiver from 'archiver';
import {readFileSync, createWriteStream} from 'fs';

import pkgg from 'https-proxy-agent';
const { HttpsProxyAgent } = pkgg;


function createUrlWithParams(apiUrl, path, params)  {

    let url = new URL(`${apiUrl}${path}`)

    Object.keys(params).forEach(
        key => {
            console.log(`${key} => ${params[key]}`)
            url.searchParams.append(key, params[key])
        }
    )

    return url

}


function sendMsg (url, form) {



    console.log(`URL: ${url}`)
    console.log(form)

    const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:8888');

    fetch(
        url.toString(), {
            method: form ? 'POST' : 'GET',
            // @ts-ignore
            body: form,
            agent: proxyAgent
        }
    ).then(res => res.text())
        .then(
            text => {
                console.log(text)
                setOutput("result", text)
            }
        )
}


function zipDirectories(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = createWriteStream(outPath);

    return new Promise((resolve, reject) => {
        let result = archive;
        result = result.directory(sourceDir, false);
        result
            .on('error', err => reject(err))
            .pipe(stream)
        ;

        stream.on('close', () => resolve());
        archive.finalize();
    });
}


export async function sendFilesMsg() {

    // let buff = sync.zip("./api.ts").memory();

    await zipDirectories('.', "./artifacts.zip")

    let form = new FormData();

    form.set(
        "file", new File(
            readFileSync("./artifacts.zip"),
            "artifacts.zip"
        )
    )

    sendMsg(
        createUrlWithParams(
            `https://api.internal.myteam.mail.ru/bot/v1`,
            "messages/sendFile",
            {
                token: "001.0949853554.2254885839:1000001305",
                chatId: "v.korobov@corp.mail.ru",
            }
        ),
        form
    )

    console.log(
        'test'
    )


}


async function upload () {
    const formData = new FormData()
    formData.append('file', new File(readFileSync("./api.ts", ), "api.ts"))

    const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:8888');

    const result = await fetch(
        createUrlWithParams(
            `https://api.internal.myteam.mail.ru/bot/v1`,
            "/messages/sendFile",
            {
                token: "001.0949853554.2254885839:1000001305",
                chatId: "v.korobov@corp.mail.ru",
            }
        ),
        { method: 'post', body: formData, agent: proxyAgent }
    ).then(res => res.json())

    return result
}


sendFilesMsg().then()
