import { Request, Response } from "express";
import {
  getGroupIds,
  sendMessage,
  sendMessageToGroup,
} from "../utils/whatsappUtils";

export async function sendWhatsAppMessage(req: Request, res: Response) {
  try {
    const { number, message } = req.body;
    if (!number || !message) {
      res.status(400).json({ error: "Number and message are required" });
      return;
    }

    await sendMessage(number, message);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
}

export async function sendWhatsAppMessageToGroup(req: Request, res: Response) {
  try {
    const { groupId, message } = req.body;
    if (!groupId || !message) {
      res
        .status(400)
        .json({ error: "Group ID and message are required" });
      return;
    }

    await sendMessageToGroup(groupId, message);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message to group" });
  }
};

export async function getWhatsAppGroupIds(_req: Request, res: Response) {
  try {
    const groupIds = await getGroupIds();
    res.status(200).json({ groupIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get group IDs" });
  }
}
