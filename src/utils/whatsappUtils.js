import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";

let sock;

export async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  sock = makeWASocket.makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error instanceof Boom
          ? lastDisconnect?.error?.output?.statusCode !==
            DisconnectReason.loggedOut
          : false;

      console.log(
        "connection closed due to ",
        lastDisconnect.error,
        ", reconnecting ",
        shouldReconnect,
      );

      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

export async function sendMessage(number, message) {
  if (!sock) {
    await connectToWhatsApp();
  }

  const phoneNumber = `${number}@s.whatsapp.net`;
  await sock.sendMessage(phoneNumber, { text: message });
}

export async function sendMessageToGroup(groupId, message) {
  if (!sock) {
    await connectToWhatsApp();
  }

  const domain = "g.us";
  if (!groupId.includes(`@${domain}`)) {
    groupId = `${groupId}@${domain}`;
  }

  await sock.sendMessage(groupId, { text: message });
}

export async function getGroupIds(sort = "creation", order = "desc") {
  const validSorts = new Set([
    "creation",
    "subject",
    "subjectOwner",
    "subjectTime",
    "size",
  ]);
  const validOrders = new Set(["asc", "desc"]);

  const normalizedSort = validSorts.has(sort) ? sort : "creation";
  const normalizedOrder = validOrders.has(order) ? order : "desc";

  if (!sock) {
    await connectToWhatsApp();
  }

  const groupMetadata = await sock.groupFetchAllParticipating();
  const groups = Object.entries(groupMetadata).map(([id, meta]) => ({
    id,
    ...meta,
    creationDate: new Date(meta.creation),
    subjectTimeDate: new Date(meta.subjectTime),
  }));

  const sortConfig = {
    creation: (a, b) => a.creationDate - b.creationDate,
    subject: (a, b) => (a.subject || "").localeCompare(b.subject || ""),
    subjectOwner: (a, b) =>
      (a.subjectOwner || "").localeCompare(b.subjectOwner || ""),
    subjectTime: (a, b) => a.subjectTimeDate - b.subjectTimeDate,
    size: (a, b) => a.size - b.size,
  };

  return groups
    .sort((a, b) => {
      const comparison = sortConfig[normalizedSort](a, b);
      return normalizedOrder === "asc" ? comparison : -comparison;
    })
    .map(({ creationDate, subjectTimeDate, ...group }) => group);
}

connectToWhatsApp();
