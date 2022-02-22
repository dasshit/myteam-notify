import { getInput, setFailed } from "@actions/core";
import { sendTextMsg, sendFilesMsg } from "./api";


export async function run() {

    sendTextMsg()

    let filesPath = getInput('files-path', {})

    if (filesPath) {

        console.log(`filesPath: ${filesPath}`)
        await sendFilesMsg(filesPath)
    } else {
        sendTextMsg()
    }

}


try {
    run().then(r => console.log(r));
} catch (error) {
    console.log(getInput('files-path', {}))
    console.log(error, error.message, error.stack)
    console.error(error, error.message, error.stack)
    setFailed(error.message);
}
