"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToWhatsApp = connectToWhatsApp;
exports.sendMessage = sendMessage;
exports.sendMessageToGroup = sendMessageToGroup;
exports.getGroupIds = getGroupIds;
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const boom_1 = require("@hapi/boom");
let sock; // Typed sock
async function connectToWhatsApp() {
    const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)("auth_info_baileys");
    sock = (0, baileys_1.default)({
        auth: state,
        printQRInTerminal: true,
    });
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            // Ensure lastDisconnect and lastDisconnect.error are defined before accessing them
            const shouldReconnect = lastDisconnect && lastDisconnect.error instanceof boom_1.Boom
                ? lastDisconnect.error.output?.statusCode !==
                    baileys_1.DisconnectReason.loggedOut
                : false;
            console.log("connection closed due to ", lastDisconnect?.error, // Access safely
            ", reconnecting ", shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        }
        else if (connection === "open") {
            console.log("opened connection");
        }
    });
    sock.ev.on("creds.update", saveCreds);
}
async function sendMessage(number, message) {
    if (!sock) {
        await connectToWhatsApp();
    }
    const phoneNumber = `${number}@s.whatsapp.net`;
    await sock.sendMessage(phoneNumber, { text: message });
}
async function sendMessageToGroup(groupId, message) {
    if (!sock) {
        await connectToWhatsApp();
    }
    const domain = "g.us";
    if (!groupId.includes(`@${domain}`)) {
        groupId = `${groupId}@${domain}`;
    }
    await sock.sendMessage(groupId, { text: message });
}
async function getGroupIds(sort = "creation", order = "desc") {
    const validSorts = new Set([
        "creation",
        "subject",
        "subjectOwner",
        "subjectTime",
        "size",
    ]);
    const validOrders = new Set(["asc", "desc"]);
    const normalizedSort = (validSorts.has(sort) ? sort : "creation"); // Typed normalizedSort
    const normalizedOrder = (validOrders.has(order) ? order : "desc");
    if (!sock) {
        await connectToWhatsApp();
    }
    const groupMetadata = await sock.groupFetchAllParticipating();
    const groups = Object.entries(groupMetadata).map(([groupIdString, meta]) => ({
        ...meta,
        id: groupIdString, // Explicitly use the id from Object.entries, which is the group JID
        creationDate: new Date(meta.creation), // Added non-null assertion
        subjectTimeDate: new Date(meta.subjectTime), // Added non-null assertion
    }));
    const sortConfig = {
        creation: (a, b) => a.creationDate.getTime() - b.creationDate.getTime(), // Typed a, b and use getTime()
        subject: (a, b) => (a.subject || "").localeCompare(b.subject || ""), // Typed a, b
        subjectOwner: (a, b) => // Typed a, b
         (a.subjectOwner || "").localeCompare(b.subjectOwner || ""),
        subjectTime: (a, b) => a.subjectTimeDate.getTime() - b.subjectTimeDate.getTime(), // Typed a, b and use getTime()
        size: (a, b) => (a.size || 0) - (b.size || 0), // Typed a, b, handle potential undefined size
    };
    return groups
        .sort((a, b) => {
        const comparison = sortConfig[normalizedSort](a, b);
        return normalizedOrder === "asc" ? comparison : -comparison;
    })
        .map(({ creationDate, subjectTimeDate, ...group }) => group);
}
connectToWhatsApp();
