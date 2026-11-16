const { app, output } = require('@azure/functions');
const { randomUUID } = require('node:crypto');

const messageTable = output.table({
  tableName: 'Messages',
  connection: 'AzureWebJobsStorage',
});

app.storageQueue('storeMessage', {
  queueName: 'messages',
  connection: 'AzureWebJobsStorage',
  extraOutputs: [messageTable],
  handler: async (queueItem, context) => {
    const message = typeof queueItem === 'string' ? JSON.parse(queueItem) : queueItem;
    const id = message.id || randomUUID();

    const entity = {
      PartitionKey: 'messages',
      RowKey: id,
      CreatedAt: message.createdAt || new Date().toISOString(),
      StoredAt: new Date().toISOString(),
      Payload: JSON.stringify(message.data ?? message),
    };

    context.extraOutputs.set(messageTable, entity);
    context.log(`Message ${id} écrit dans la table Messages.`);
  },
});
