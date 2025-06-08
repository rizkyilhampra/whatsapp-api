import express from "express";
import bodyParser from "body-parser";
import whatsappRoutes from "./routes/whatsappRoutes.js";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig.js';

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

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('WhatsApp API is running!');
});

export default app;
