# whatsapp-api
## Description
An REST API using Node & Express. This API is only used to send message to Whatsapp using [Baileys](https://github.com/WhiskeySockets/Baileys) socket.

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
