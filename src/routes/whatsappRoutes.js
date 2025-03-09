import express from "express";
import {
  getWhatsAppGroupIds,
  sendWhatsAppMessage,
  sendWhatsAppMessageToGroup,
} from "../controllers/whatsappController.js";

const router = express.Router();

router.post("/send-message", sendWhatsAppMessage);
router.post("/send-message-to-group", sendWhatsAppMessageToGroup);
router.get("/get-group-ids", getWhatsAppGroupIds);

export default router;
