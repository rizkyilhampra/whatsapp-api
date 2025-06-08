"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const whatsappRoutes_1 = __importDefault(require("./routes/whatsappRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerConfig_1 = __importDefault(require("./swaggerConfig"));
const app = (0, express_1.default)();
const logDirectory = path_1.default.join(process.cwd(), "var", "log");
fs_1.default.mkdirSync(logDirectory, { recursive: true });
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(logDirectory, "access.log"), { flags: "a" });
app.use(body_parser_1.default.json());
app.use("/api/whatsapp", whatsappRoutes_1.default);
app.use((0, morgan_1.default)("combined", { stream: accessLogStream }));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerConfig_1.default));
app.get("/", (_req, res) => {
    res.send("WhatsApp API is running!");
});
exports.default = app;
