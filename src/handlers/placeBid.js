const AWS = require('aws-sdk');
import commonMiddleware from './lib/commonMiddleware';
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  let auction;

    const { id } = event.pathParameters;
    const { amount } = event.body;

    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
      UpdateExpression: 'set highestBid.amount = :amount',
      ExpressionAttributeValues: {
        ':amount': amount,
      },
      ReturnValues: 'ALL_NEW',
    };

    let updatedAuction;

  try {
    const result = await dynamodb
      .update(params)
        .promise();
      
    updatedAuction = result.Attributes

    auction = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}


export const handler = commonMiddleware(placeBid);
