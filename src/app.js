import express from "express";
import bodyParser from "body-parser";
import whatsappRoutes from "./routes/whatsappRoutes.js";
import morgan from "morgan";
import fs from "fs";
import path from "path";

const app = express();

const logDirectory = path.join(process.cwd(), "var", "log");
fs.mkdirSync(logDirectory, { recursive: true });

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);

app.use(bodyParser.json());
app.use("/api/whatsapp", whatsappRoutes);
app.use(morgan("combined", { stream: accessLogStream }));

export default app;
