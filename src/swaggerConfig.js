// src/swaggerConfig.js
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WhatsApp API',
      version: '1.0.0',
      description: 'A REST API to interact with WhatsApp using Baileys.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/whatsapp', // Adjust if your base path is different
      },
    ],
    components: {
      schemas: {
        SendMessageRequest: {
          type: 'object',
          required: ['number', 'message'],
          properties: {
            number: {
              type: 'string',
              description: 'The recipient WhatsApp number (e.g., 6281234567890).',
            },
            message: {
              type: 'string',
              description: 'The message content.',
            },
          },
          example: {
            number: '6281234567890',
            message: 'Hello from the API!',
          },
        },
        SendMessageToGroupRequest: {
          type: 'object',
          required: ['groupId', 'message'],
          properties: {
            groupId: {
              type: 'string',
              description: 'The WhatsApp group ID (e.g., 1234567890@g.us or group-name-slug).',
            },
            message: {
              type: 'string',
              description: 'The message content.',
            },
          },
          example: {
            groupId: '1234567890@g.us',
            message: 'Hello group from the API!',
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
            },
          },
          example: {
            error: 'Failed to perform operation',
          },
        },
        GroupIdsResponse: {
          type: 'object',
          properties: {
            groupIds: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of WhatsApp group IDs.',
            },
          },
          example: {
            groupIds: ['1234567890@g.us', 'another-group@g.us'],
          },
        },
      },
    },
    paths: {
      '/send-message': {
        post: {
          summary: 'Send a WhatsApp message to a number',
          tags: ['Messages'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SendMessageRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Message sent successfully.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/SuccessResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request (e.g., missing parameters).',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
          },
        },
      },
      '/send-message-to-group': {
        post: {
          summary: 'Send a WhatsApp message to a group',
          tags: ['Groups'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SendMessageToGroupRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Message sent successfully to the group.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/SuccessResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request (e.g., missing parameters).',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
          },
        },
      },
      '/get-group-ids': {
        get: {
          summary: 'Get all connected WhatsApp group IDs',
          tags: ['Groups'],
          responses: {
            '200': {
              description: 'Successfully retrieved group IDs.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/GroupIdsResponse',
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API routes files
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
