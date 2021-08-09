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

    const notifySeller = sqs.sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
            subject: 'Your item has been sold',
            recipitent: seller,
            body: `Your item "${title}" has been sold for $${amount}`
        })
    }).promise()


    const notifyBidder = sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: 'You won an auction',
          recipitent: bidder,
          body: `You just scored yourself a great deal buying "${title}" for the amount of $${amount}`,
        }),
      })
        .promise();
    
    return Promise.all([notifyBidder, notifySeller])
}