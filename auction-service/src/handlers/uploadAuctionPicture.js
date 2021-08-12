import { getAuctionById } from './getAuction'
import { uploadPictureToS3 } from '../lib/uploadPictureToS3';
import createError from 'http-errors';

export async function uploadAuctionPicture(event) {

    const { id } = event.pathParameters

    const auction = await getAuctionById(id)

    if (!auction) {
      throw new createError.NotFound(`Auction with ID "${id}" not found`);
    }

    const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    const uploadPictureResult = await uploadPictureToS3(auction.id + '.jpg', buffer)

    // const uploadPictureResult = await uploadPictureToS3(`${auction.id}.jpg, ${buffer}`);

    console.log(uploadPictureResult);


    
    return {
        statusCode: 200,
        body: JSON.stringify({})
    }
}

export const handler = uploadAuctionPicture;