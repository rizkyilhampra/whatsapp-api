# whatsapp-api

## Description

A REST API built with Node.js and Express, designed to facilitate sending WhatsApp messages via the [Baileys](https://github.com/WhiskeySockets/Baileys) library. This API allows you to programmatically send messages to individual numbers and groups, as well as retrieve your connected group IDs.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd whatsapp-api
    ```

2.  **Install dependencies:**
    This project uses pnpm as indicated by `pnpm-lock.yaml`.

    ```bash
    pnpm install
    ```

    If you don't have pnpm, you can install it via npm: `npm install -g pnpm`

3.  **Set up environment variables:**
    Copy the `.env.example` file to `.env` and update the necessary configurations (if any).

    ```bash
    cp .env.example .env
    ```

4.  **Start the application:**
    ```bash
    pnpm run start
    ```
    The API will typically be available at `http://localhost:3000`.

## API Documentation (Swagger)

For interactive API documentation, where you can view detailed information about each endpoint and test them directly from your browser, please visit:

**`/api-docs`**

For example, if your application is running locally on port 3000, you can access the Swagger UI at `http://localhost:3000/api-docs`.
