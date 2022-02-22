import { getInput, setFailed } from "@actions/core";
import { sendTextMsg, sendFilesMsg } from "./api";


export function run() {

    sendTextMsg()

    let filesPath = getInput('bot-token', {})

    if (filesPath) {

        console.log(`filesPath: ${filesPath}`)
        sendFilesMsg(filesPath)
    }

}


try {
    run();
} catch (error) {
    console.log(getInput('files-path', {}))
    console.log(error, error.message, error.stack)
    console.error(error, error.message, error.stack)
    setFailed(error.message);
}
