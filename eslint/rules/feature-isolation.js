module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce feature isolation rules',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignorePatterns: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    return {}
  },
}
