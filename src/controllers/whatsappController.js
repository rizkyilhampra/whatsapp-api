import { sendMessage } from "../utils/whatsappUtils.js";

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
