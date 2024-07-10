import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";

let sock;

export async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  sock = makeWASocket.makeWASocket({
    version: [2, 2413, 1],
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

connectToWhatsApp();
