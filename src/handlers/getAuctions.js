
const AWS = require('aws-sdk');
const middy = require('@middy/core');
const httpEventNormalizer = require('@middy/http-event-normalizer');
const httpErrorHandler = require('@middy/http-error-handler');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions

  try {
    
    const result = await dynamodb.scan({
      TableName : process.env.AUCTIONS_TABLE_NAME
    }).promise()

    auctions = result.items
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = middy(getAuctions).use(httpEventNormalizer()).use(httpErrorHandler()).use(httpJsonBodyParser());
