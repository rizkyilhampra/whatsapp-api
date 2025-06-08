import express from "express";
import bodyParser from "body-parser";
import whatsappRoutes from "./routes/whatsappRoutes";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig";

const app = express();

const logDirectory = path.join(process.cwd(), "logs");
fs.mkdirSync(logDirectory, { recursive: true });

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" },
);

app.use(bodyParser.json());
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/whatsapp", whatsappRoutes);
app.use(morgan("combined", { stream: accessLogStream }));

export default app;
