
const middy = require('@middy/core');
const httpEventNormalizer = require('@middy/http-event-normalizer');
const httpErrorHandler = require('@middy/http-error-handler');
const httpJsonBodyParser = require('@middy/http-json-body-parser');



export default handler => middy(handler)
    .use([
        httpEventNormalizer(),
        httpErrorHandler(),
        httpJsonBodyParser()
    ]);
