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

## API Endpoints

The base path for all API endpoints is `/api/whatsapp`.

### 1. Send Message

*   **Endpoint:** `POST /send-message`
*   **Description:** Sends a WhatsApp message to a specified number.
*   **Request Body:** `application/json`
    | Parameter | Type   | Required | Description                                          |
    | :-------- | :----- | :------- | :--------------------------------------------------- |
    | `number`  | string | Yes      | The recipient WhatsApp number (e.g., `6281234567890`). |
    | `message` | string | Yes      | The message content.                                 |
*   **Example Request:**
    ```bash
    curl -X POST \
      http://localhost:3000/api/whatsapp/send-message \
      -H 'Content-Type: application/json' \
      -d '{
        "number": "6281234567890",
        "message": "Hello from the API!"
      }'
    ```
*   **Responses:**
    *   `200 OK`: Message sent successfully.
        ```json
        {
          "success": true
        }
        ```
    *   `400 Bad Request`: Missing `number` or `message`.
        ```json
        {
          "error": "Number and message are required"
        }
        ```
    *   `500 Internal Server Error`: Failed to send message.
        ```json
        {
          "error": "Failed to send message"
        }
        ```

### 2. Send Message to Group

*   **Endpoint:** `POST /send-message-to-group`
*   **Description:** Sends a WhatsApp message to a specified group ID.
*   **Request Body:** `application/json`
    | Parameter | Type   | Required | Description                                                              |
    | :-------- | :----- | :------- | :----------------------------------------------------------------------- |
    | `groupId` | string | Yes      | The WhatsApp group ID (e.g., `1234567890@g.us` or `group-name-slug`). |
    | `message` | string | Yes      | The message content.                                                     |
*   **Example Request:**
    ```bash
    curl -X POST \
      http://localhost:3000/api/whatsapp/send-message-to-group \
      -H 'Content-Type: application/json' \
      -d '{
        "groupId": "1234567890@g.us",
        "message": "Hello group from the API!"
      }'
    ```
*   **Responses:**
    *   `200 OK`: Message sent successfully to the group.
        ```json
        {
          "success": true
        }
        ```
    *   `400 Bad Request`: Missing `groupId` or `message`.
        ```json
        {
          "error": "Group ID and message are required"
        }
        ```
    *   `500 Internal Server Error`: Failed to send message to group.
        ```json
        {
          "error": "Failed to send message to group"
        }
        ```

### 3. Get Group IDs

*   **Endpoint:** `GET /get-group-ids`
*   **Description:** Retrieves a list of all connected WhatsApp group IDs.
*   **Example Request:**
    ```bash
    curl -X GET http://localhost:3000/api/whatsapp/get-group-ids
    ```
*   **Responses:**
    *   `200 OK`: Successfully retrieved group IDs.
        ```json
        {
          "groupIds": ["1234567890@g.us", "another-group@g.us"]
        }
        ```
    *   `500 Internal Server Error`: Failed to get group IDs.
        ```json
        {
          "error": "Failed to get group IDs"
        }
        ```
