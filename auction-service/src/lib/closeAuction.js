import AWS from 'aws-sdk'



const dynamodb = new AWS.DynamoDB.DocumentClient()



export async function closeAuction(auction) {


    const sqs = new AWS.SQS()

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id: auction.id },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeValues: {
            ':status' : 'CLOSED'
        },
        ExpressionAttributeNames: {
            '#status' : 'status'
        }
    }
 

    await dynamodb.update(params).promise()

    const { title, seller, highestBid } = auction
    const { amount, bidder } = highestBid

    console.log(highestBid)


    if (amount === 0) {
         await sqs.sendMessage({
             QueueUrl: process.env.MAIL_QUEUE_URL,
             MessageBody: JSON.stringify({
               subject: 'No Bids',
               recipient: seller,
               body: `Your item "${title}" did not get any bids`,
             }),
           }).promise();
    
        return;
    }

    if (bidder) {
        const notifySeller = sqs
          .sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
              subject: 'Your item has been sold',
              recipient: seller,
              body: `Your item "${title}" has been sold for $${amount}`,
            }),
          })
          .promise();

        const notifyBidder = sqs
          .sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
              subject: 'You won an auction',
              recipient: bidder,
              body: `You just scored yourself a great deal buying "${title}" for the amount of $${amount}`,
            }),
          })
            .promise();
        
         return Promise.all([notifySeller, notifyBidder]);
   }
    
   
}