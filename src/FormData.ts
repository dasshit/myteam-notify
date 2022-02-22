export class FormData {
    private data = [];
    private files = [];
    private readonly razdel;
    constructor() {
        this.razdel = "----WebKitFormBoundary" + (Math.random() * Math.pow(10, 18)).toString(16);
    }
    getBoundary() {
        return this.razdel;
    }
    public append(name, value) {
        this.data.push({ name: name, value: value });
    }
    public appendFile(name: string, file: string, content: string) {
        this.files.push({ name: name, filename: file, content: content });
    }
    public toString() {
        let data = "";
        for (let i of this.files) {
            data += "--" + this.razdel + "\r\n";
            let fileName = i.filename.split(/(\/|\\)/g);
            let parts = i.filename.split(".");
            let ext = parts[parts.length - 1];
            data += "Content-Disposition: form-data; name=\"" + i.name + "\"; filename=\"" + fileName[fileName.length - 1] + "\"\r\n";
            data += "Content-Type: \"application/octet-stream\"\r\n\r\n";
            data += i.content;

        }
        for (let i of this.data) {
            if (data)
                data += "\r\n";
            data += "--" + this.razdel + "\r\n";
            data += "Content-Disposition: form-data; name=\"" + i.name + "\"\r\n\r\n";
            data += Buffer.from(i.value.toString(), "utf8").toString("latin1");
        }
        data += `\r\n--${this.razdel}--`;
        return data;
    }
}
