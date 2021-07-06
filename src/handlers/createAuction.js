const uuid = require('uuid').v4
const AWS = require('aws-sdk')
const middy = require('@middy/core')
const commonMiddleware = require('./lib/commonMiddleware')
const createError = require('http-errors');

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

export const handler = commonMiddleware(createAuction);


