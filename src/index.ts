import { getInput, setFailed } from "@actions/core";
import { sendTextMsg, sendFilesMsg } from "./api";


export function run() {

    sendTextMsg()

    let filesPath = getInput('bot-token', {})

    if (filesPath) {
        sendFilesMsg(filesPath)
    }

}


try {
    run();
} catch (error) {
    console.log(getInput('files-path', {}))
    setFailed(error.message);
}
