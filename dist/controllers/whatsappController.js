"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsAppMessage = sendWhatsAppMessage;
exports.sendWhatsAppMessageToGroup = sendWhatsAppMessageToGroup;
exports.getWhatsAppGroupIds = getWhatsAppGroupIds;
const whatsappUtils_1 = require("../utils/whatsappUtils");
async function sendWhatsAppMessage(req, res) {
    try {
        const { number, message } = req.body;
        if (!number || !message) {
            res.status(400).json({ error: "Number and message are required" });
            return; // Ensure function exits
        }
        await (0, whatsappUtils_1.sendMessage)(number, message);
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send message" });
    }
}
async function sendWhatsAppMessageToGroup(req, res) {
    try {
        const { groupId, message } = req.body;
        if (!groupId || !message) {
            res
                .status(400)
                .json({ error: "Group ID and message are required" });
            return; // Ensure function exits
        }
        await (0, whatsappUtils_1.sendMessageToGroup)(groupId, message);
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send message to group" });
    }
}
;
async function getWhatsAppGroupIds(req, res) {
    try {
        const groupIds = await (0, whatsappUtils_1.getGroupIds)();
        res.status(200).json({ groupIds });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get group IDs" });
    }
}
