import AWS from 'aws-sdk'


const ses = new AWS.SES({
  region: 'us-east-1',
})


async function sendMail(event, context) {
  const params = {
    Source: 'damilola.oyeyipo@joinfleri.com',
    Destination: {
      ToAddresses : ['oyeyipo45@gmail.com']
    },
    Message: {
      Body: {
        Text: {
          Data: 'Hello Damilola'
        }
      },
      Subject: {
        Data: 'Test Mail'
      }
    }
  }

  try {
    const result = await ses.sendEmail(params).promise()
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
  }
}

export const handler = sendMail;


