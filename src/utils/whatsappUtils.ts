import makeWASocketDefault, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  GroupMetadata,
  ConnectionState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import QRCode from "qrcode";

let sock: WASocket;

export async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  sock = makeWASocketDefault({
    auth: state,
  });

  sock.ev.on("connection.update", async (update: Partial<ConnectionState>) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log(await QRCode.toString(qr, { type: "terminal", small: true }));
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect && lastDisconnect.error instanceof Boom
          ? lastDisconnect.error.output?.statusCode !==
            DisconnectReason.loggedOut
          : false;

      console.log(
        "connection closed due to ",
        lastDisconnect?.error,
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

export async function sendMessage(number: string, message: string) {
  if (!sock) {
    await connectToWhatsApp();
  }

  const phoneNumber = `${number}@s.whatsapp.net`;
  await sock.sendMessage(phoneNumber, { text: message });
}

export async function sendMessageToGroup(groupId: string, message: string) {
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

  const normalizedSort = (
    validSorts.has(sort) ? sort : "creation"
  ) as keyof typeof sortConfig;
  const normalizedOrder = validOrders.has(order) ? order : "desc";

  if (!sock) {
    await connectToWhatsApp();
  }

  const groupMetadata = await sock.groupFetchAllParticipating();

  type ProcessedGroup = GroupMetadata & {
    creationDate: Date;
    subjectTimeDate: Date;
  };

  const groups: ProcessedGroup[] = Object.entries(groupMetadata).map(
    ([groupIdString, meta]: [string, GroupMetadata]) => ({
      ...meta,
      id: groupIdString,
      creationDate: new Date(meta.creation!),
      subjectTimeDate: new Date(meta.subjectTime!),
    }),
  );

  const sortConfig = {
    creation: (a: ProcessedGroup, b: ProcessedGroup) =>
      a.creationDate.getTime() - b.creationDate.getTime(),
    subject: (a: ProcessedGroup, b: ProcessedGroup) =>
      (a.subject || "").localeCompare(b.subject || ""),
    subjectOwner: (a: ProcessedGroup, b: ProcessedGroup) =>
      (a.subjectOwner || "").localeCompare(b.subjectOwner || ""),
    subjectTime: (a: ProcessedGroup, b: ProcessedGroup) =>
      a.subjectTimeDate.getTime() - b.subjectTimeDate.getTime(),
    size: (a: ProcessedGroup, b: ProcessedGroup) =>
      (a.size || 0) - (b.size || 0),
  };

  return groups
    .sort((a: ProcessedGroup, b: ProcessedGroup) => {
      const comparison = sortConfig[normalizedSort](a, b);
      return normalizedOrder === "asc" ? comparison : -comparison;
    })
    .map(({ creationDate, subjectTimeDate, ...group }) => group);
}

connectToWhatsApp();
