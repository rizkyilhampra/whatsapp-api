"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const whatsappController_1 = require("../controllers/whatsappController");
const router = express_1.default.Router();
router.post("/send-message", whatsappController_1.sendWhatsAppMessage);
router.post("/send-message-to-group", whatsappController_1.sendWhatsAppMessageToGroup);
router.get("/get-group-ids", whatsappController_1.getWhatsAppGroupIds);
exports.default = router;
