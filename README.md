# whatsapp-api

## Description

A REST API built with Node.js, Express, and **TypeScript**, designed to facilitate sending WhatsApp messages via the [Baileys](https://github.com/WhiskeySockets/Baileys) library. This API allows you to programmatically send messages to individual numbers and groups, as well as retrieve your connected group IDs.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/rizkyilhampra/whatsapp-api.git
    cd whatsapp-api
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

    > If you don't have pnpm, you can install it via npm: `npm install -g pnpm`

3.  **Set up environment variables:**
    There are no required environment variables to get started, but you can create a `.env` file if needed for custom configurations like `PORT`.

## Running the Application

When you start the application for the first time, you'll need to authenticate by scanning a QR code with your WhatsApp mobile app (Link a device). The QR code will be displayed directly in your terminal.

### Development

For development, the server uses `nodemon` and `ts-node` to watch for changes in TypeScript files (`.ts`) and automatically restart the server.

```bash
pnpm run dev
```

### Production

For a production environment, you should build the TypeScript source and run the compiled JavaScript. The `start` script handles this process for you.

```bash
pnpm run start
```

This command will:

1.  Compile the TypeScript files from `src/` into JavaScript files in the `dist/` directory.
2.  Start the application by running the compiled `dist/index.js` file with Node.js.

The API will typically be available at `http://localhost:3000`.

## API Documentation (Swagger)

For interactive API documentation, where you can view detailed information about each endpoint and test them directly from your browser, please visit the root URL:

**`/`**

For example, if your application is running locally on port 3000, you can access the Swagger UI at `http://localhost:3000/`.
