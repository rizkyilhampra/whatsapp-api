import express from "express";
import bodyParser from "body-parser";
import whatsappRoutes from "./routes/whatsappRoutes";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig";

const app = express();

const logDirectory = path.join(process.cwd(), "var", "log");
fs.mkdirSync(logDirectory, { recursive: true });

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" },
);

app.use(bodyParser.json());
app.use("/api/whatsapp", whatsappRoutes);
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req, res) => {
  res.send("WhatsApp API is running!");
});

export default app;
