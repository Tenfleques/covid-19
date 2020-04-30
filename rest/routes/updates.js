const API_HELPER = require("../helpers/api");
const {encode, decode} = require("lossless-text-compression");
const {diff_match_patch} = require("../helpers/diffpatch");

let clients = [];

const FreqUpdateDelay = 1000 * 3600 // check for updates every hour
let DATA = {
    dateUpdate: " ",
    sexUpdate: " ",
    transmissionUpdate: " ",
    CasesProvince: " ",
    UpdateSummary: " ",
    apicase: " ",
    apiday: " "
}
const keys = Object.keys(DATA);

// Middleware for GET /events endpoint
function updatesHandler(req, res, next) {
    // Mandatory headers and http status to keep connection open
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
    
    // Generate an id based on timestamp and save res
    // object of client connection on clients list
    // Later we'll iterate it and send updates to each client
    const clientId = Date.now();
    const newClient = {
      id: clientId,
      res
    };
    for (let i = 0; i < keys.length; ++i){
      sendToClient(newClient, DATA[keys[i]], keys[i]);
    }
    clients.push(newClient);
    // When client closes connection we update the clients list
    // avoiding the disconnected one
    req.on('close', () => {
      console.log(`${clientId} Connection closed`);
      clients = clients.filter(c => c.id !== clientId);
    });
}

function processUpdates(new_txt, key){
    const dmp = new diff_match_patch();
    const old_txt = DATA[key];
    const diff = dmp.diff_main(old_txt, new_txt);
    
    const same_text = diff.map(a => Math.abs(a[0])).reduce((a,b) => a + b) === 0
    if (same_text){
      return;
    }
    
    const patches = dmp.patch_make(diff);
    const patch_apply = dmp.patch_apply(patches, old_txt);
    
    if (patch_apply[1][0]){
        DATA[key] = patch_apply[0];
        const txt_patch = dmp.patch_toText(patches);
        sendUpdatesToAll(txt_patch, key);
    }
}

function sendToClient(c, newData, type){
  c.res.write(`event: ${type}\n`)
  c.res.write("data:" + newData + "\n\n")
}

function sendUpdatesToAll(newData, type) {
    clients.forEach(c => {
      sendToClient(c, newData, type);
    });
}

function requestFunc(key){
    API_HELPER.requestCovidAPI("/"+key, (data) => {
        data = JSON.stringify(data)
        processUpdates(data, key)
    });
}

for (let i = 0; i < keys.length; ++i){
    requestFunc(keys[i]);
    setInterval(()=>{
        requestFunc(keys[i]);
    }, FreqUpdateDelay);
}


module.exports  = {
  updatesHandler
}

