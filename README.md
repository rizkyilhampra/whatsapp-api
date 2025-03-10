# whatsapp-api
## Description
An REST API using Node & Express. This API is only used to send message to Whatsapp using [Baileys](https://github.com/WhiskeySockets/Baileys) socket.

## Installation
```bash
npm install
```

```bash
npm run start
```

## Usage
1. Send message
    ```bash
    curl -X POST \
      http://localhost:3000/api/whatsapp/send-message \
      -H 'Content-Type: application/json' \
      -d '{
        "number": "628<number>",
        "message": "Hello from API!"
      }'
    ```

2. Send message to group
    ```bash
    curl -X POST \
      http://localhost:3000/api/whatsapp/send-message-to-group \
      -H 'Content-Type: application/json' \
      -d '{
        "groupId": "<<<number>@g.us> or <number>>",
        "message": "Hello from API!",
      }'
    ```

3. Get group IDs
    ```bash
    curl -X GET \
      http://localhost:3000/api/whatsapp/get-group-ids
    ```
