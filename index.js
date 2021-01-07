const ping = require("minecraft-pinger").pingPromise;
const mc = require("minecraft-protocol");

const version = "1.12.2";
const host = "blah.aternos.me";
const port = 25565;
const join_interval = 5000;
const messages = [
    "message1",
    "message2"
]

let online = [];
let clients = {};

function rng(min, max) {
    return Math.floor(Math.random() * max + min);
}

function remove(username) {
    let n = {};
    Object.keys(clients).forEach(p => {
        if (p !== username) {
            n[p] = clients[p];
        }
    })
    clients = n;
}

function getDiff() {
    const diff = [];
    const _clients = Object.keys(clients);
    _clients.forEach(p => {
        if (!online.includes(p)) {
            diff.push(p);
        }
    })
    return diff;
}

async function getOnline() {
    const p = await ping(host, port);
    online = p.players.sample;
}

function add(username) {
    let bot = mc.createClient({
        host,
        port,
        username,
        version
    });

    bot.on("end", ()=>{
        bot = null;
        remove(username);
    });

    clients[username] = bot;
}

setInterval(getOnline, 15 * 1000);
getOnline();

setInterval(() => {
    let diff = getDiff();
    if (diff.length > 1) {
        add(diff[0]);
    }
}, join_interval);

setInterval(() => {
    clients.forEach(client => {
        client.write("chat", { message: messages[rng(0, messages.length)] })
    });
}, 3500);