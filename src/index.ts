import { app, BrowserWindow, session } from "electron";

import untypedJson from "../indevconfig.json" with {type: "json"}

const { pass, user, url } = untypedJson as {pass:string; user:string; url:string;}

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const res = await fetch(url+"/data/login", {
    method: "POST",
    body: `user=${user}&password=${pass}`,
})

const loginCookie = res.headers.getSetCookie();
const XmlResponse = await res.text();
const authLink = /(?<=<forwardUrl>)(.*)(?=<\/forwardUrl>)/.exec(XmlResponse)



console.log(authLink)

if(!authLink){
    console.error("FATAL: Could not get authentication tokens. You may have entered the login incorrectly or have max sessions opened.");
    process.exit();
}

const token1 = /(?<=ST1=)(.*)(?=,ST2)/.exec(authLink[0])
const token2 = /(?<=ST2=)(.*)/.exec(authLink[0])

if(!loginCookie[0]){
    console.error("FATAL: Could not extract login cookie!");
    process.exit();
}

if(!token1 || !token2){
    console.error("FATAL: Could not extract tokens!");
    process.exit();
}

/*
app.once("ready", ()=>{
    
    // https://stackoverflow.com/a/64954227/15324411
    session.defaultSession.webRequest.onBeforeSendHeaders({urls: [`${url}*`]}, (details, callback)=>{
    details.requestHeaders["Cookie"] = loginCookie[0]!
    callback({requestHeaders: details.requestHeaders})
    })

    const window = new BrowserWindow();
    window.webContents.openDevTools()
    void window.loadURL(`${url}/${authLink[0]}`)
    //void window.webContents.executeJavaScript(`document.location="login.html${authLink[0]}"`)

    window.on("close", ()=>{
        // try to logout, so the session isn't left hanging
        async ()=>{
            await window.webContents.executeJavaScript("f_logout();")
        }
    })
})
*/

app.once("ready", ()=>{
    
    // https://stackoverflow.com/a/64954227/15324411
    session.defaultSession.webRequest.onBeforeSendHeaders({urls: [`${url}*`]}, (details, callback)=>{
    details.requestHeaders["Cookie"] = loginCookie[0]!
    callback({requestHeaders: details.requestHeaders})
    })

    const window = new BrowserWindow();
    window.webContents.openDevTools()
    void window.loadURL(`${url}/${authLink[0]}`)
    void window.loadURL(`${url}/virtualconsolehtml5.html?ipAddr=192.168.1.215&kvmPort=5900&vmPriv=true&lang=en&aimSession=99&ST2=${token2[0]}&TokenName=ST1&TokenKey=${token1[0]}`)
    //void window.webContents.executeJavaScript(`document.location="login.html${authLink[0]}"`)


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