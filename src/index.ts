import { app, BrowserWindow } from "electron";


const url = "https://192.168.1.215/"

import untypedJson from "../indevconfig.json" with {type: "json"}

const { pass, user} = untypedJson as {pass:string; user:string}


process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const res = await fetch(url+"/data/login", {
    method: "POST",
    body: `user=${user}&password=${pass}`,
})

const XmlResponse = await res.text();

console.log(XmlResponse)


app.once("ready", ()=>{
    const window = new BrowserWindow();
    void window.loadURL(url+/(?<=<forwardUrl>)(.*)(?=<\/forwardUrl>)/.exec(XmlResponse)![0])
})

app.on('certificate-error',(event, __webContents, __url, __error, certificate, callback)=>{
    event.preventDefault();
    if(certificate.issuer.organizations.at(0)==="Dell Inc."){
        // Easily spoofed, but if you are using this you should know what you are doing...
        // FIXME - ADD METHOD TO OVERRIDE
        callback(true);
        return;
    }
    callback(false);
})