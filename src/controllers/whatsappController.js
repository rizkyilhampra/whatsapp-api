import {
  getGroupIds,
  sendMessage,
  sendMessageToGroup,
} from "../utils/whatsappUtils.js";

export const sendWhatsAppMessage = async (req, res) => {
  try {
    const { number, message } = req.body;
    if (!number || !message) {
      return res.status(400).json({ error: "Number and message are required" });
    }

    await sendMessage(number, message);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const sendWhatsAppMessageToGroup = async (req, res) => {
  try {
    const { groupId, message } = req.body;
    if (!groupId || !message) {
      return res
        .status(400)
        .json({ error: "Group ID and message are required" });
    }

    await sendMessageToGroup(groupId, message);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message to group" });
  }
};

export async function getWhatsAppGroupIds(req, res) {
  try {
    const groupIds = await getGroupIds();
    res.status(200).json({ groupIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get group IDs" });
  }
}
