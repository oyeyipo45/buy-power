const schema = {
  type: 'object',
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
      required: ['id'],
    },
    body: {
      type: 'object',
      properties: {
        amount: {
          type: 'string',
        },
      },
      required: ['amount'],
    },
  },
  required: ['queryStringParameters', 'body'],
};

export default schema;
