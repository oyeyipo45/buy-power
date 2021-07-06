const uuid = require('uuid').v4
const AWS = require('aws-sdk')
const middy = require('@middy/core')
const httpEventNormalizer = require('@middy/http-event-normalizer');
const httpErrorHandler = require('@middy/http-error-handler');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const createError = require('http-errors')

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function createAuction(event, context) {

  const { title } = event.body
  
  const now = new Date()

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString()
  }

 try {
    await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
 } catch (error) {
   console.error(error);
   throw new createError.InternalServerError(error)
 }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = middy(createAuction).use(httpEventNormalizer()).use(httpErrorHandler()).use(httpJsonBodyParser());


