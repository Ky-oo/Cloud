const { app, output } = require('@azure/functions');
const { randomUUID } = require('node:crypto');

const messageQueue = output.storageQueue({
  queueName: 'messages',
  connection: 'AzureWebJobsStorage',
});

app.http('submitMessage', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'messages',
  extraOutputs: [messageQueue],
  handler: async (request, context) => {
    let data;

    try {
      data = await request.json();
    } catch {
      return {
        status: 400,
        jsonBody: { error: 'Le corps de la requête doit être un JSON valide.' },
      };
    }

    if (!data || Array.isArray(data) || typeof data !== 'object' || Object.keys(data).length === 0) {
      return {
        status: 400,
        jsonBody: { error: 'Envoyez un objet JSON non vide.' },
      };
    }

    const message = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      data,
    };

    context.extraOutputs.set(messageQueue, JSON.stringify(message));
    context.log(`Message ${message.id} publié dans la queue.`);

    return {
      status: 202,
      jsonBody: {
        accepted: true,
        id: message.id,
      },
    };
  },
});
