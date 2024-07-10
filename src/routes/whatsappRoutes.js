import express from "express";
import { sendWhatsAppMessage } from "../controllers/whatsappController.js";

const router = express.Router();

router.post("/send-message", sendWhatsAppMessage);

export default router;
