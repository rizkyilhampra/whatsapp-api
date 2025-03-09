import express from "express";
import { sendWhatsAppMessage, sendWhatsAppMessageToGroup } from "../controllers/whatsappController.js";

const router = express.Router();

router.post("/send-message", sendWhatsAppMessage);
router.post("/send-message-to-group", sendWhatsAppMessageToGroup);

export default router;
