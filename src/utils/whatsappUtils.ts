import makeWASocketDefault, { // Renamed import
  DisconnectReason,
  useMultiFileAuthState,
  WASocket, // Import WASocket type
  GroupMetadata, // Import GroupMetadata
  ConnectionState, // Import ConnectionState
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";

let sock: WASocket; // Typed sock

export async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  sock = makeWASocketDefault({ // Use the renamed import
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on("connection.update", (update: Partial<ConnectionState>) => { // Typed update
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      // Ensure lastDisconnect and lastDisconnect.error are defined before accessing them
      const shouldReconnect =
        lastDisconnect && lastDisconnect.error instanceof Boom
          ? lastDisconnect.error.output?.statusCode !==
            DisconnectReason.loggedOut
          : false;

      console.log(
        "connection closed due to ",
        lastDisconnect?.error, // Access safely
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

export async function sendMessage(number: string, message: string) { // Typed parameters
  if (!sock) {
    await connectToWhatsApp();
  }

  const phoneNumber = `${number}@s.whatsapp.net`;
  await sock.sendMessage(phoneNumber, { text: message });
}

export async function sendMessageToGroup(groupId: string, message: string) { // Typed parameters
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

  const normalizedSort = (validSorts.has(sort) ? sort : "creation") as keyof typeof sortConfig; // Typed normalizedSort
  const normalizedOrder = (validOrders.has(order) ? order : "desc");

  if (!sock) {
    await connectToWhatsApp();
  }

  const groupMetadata = await sock.groupFetchAllParticipating();
  // Define a type for the group objects after processing
  type ProcessedGroup = GroupMetadata & { creationDate: Date; subjectTimeDate: Date }; // id is already in GroupMetadata

  const groups: ProcessedGroup[] = Object.entries(groupMetadata).map(([groupIdString, meta]: [string, GroupMetadata]) => ({ // Typed meta, renamed id
    ...meta,
    id: groupIdString, // Explicitly use the id from Object.entries, which is the group JID
    creationDate: new Date(meta.creation!), // Added non-null assertion
    subjectTimeDate: new Date(meta.subjectTime!), // Added non-null assertion
  }));

  const sortConfig = {
    creation: (a: ProcessedGroup, b: ProcessedGroup) => a.creationDate.getTime() - b.creationDate.getTime(), // Typed a, b and use getTime()
    subject: (a: ProcessedGroup, b: ProcessedGroup) => (a.subject || "").localeCompare(b.subject || ""), // Typed a, b
    subjectOwner: (a: ProcessedGroup, b: ProcessedGroup) => // Typed a, b
      (a.subjectOwner || "").localeCompare(b.subjectOwner || ""),
    subjectTime: (a: ProcessedGroup, b: ProcessedGroup) => a.subjectTimeDate.getTime() - b.subjectTimeDate.getTime(), // Typed a, b and use getTime()
    size: (a: ProcessedGroup, b: ProcessedGroup) => (a.size || 0) - (b.size || 0), // Typed a, b, handle potential undefined size
  };

  return groups
    .sort((a: ProcessedGroup, b: ProcessedGroup) => { // Typed a, b
      const comparison = sortConfig[normalizedSort](a, b);
      return normalizedOrder === "asc" ? comparison : -comparison;
    })
    .map(({ creationDate, subjectTimeDate, ...group }) => group);
}

connectToWhatsApp();
