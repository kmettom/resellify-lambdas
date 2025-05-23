const AWS = require('aws-sdk');
const s3 = new AWS.S3();

export const S3BucketOptions = {
    bucketName:
        "amplify-expotestapp-lloyd-resellifyimagestoragebuc-hxtkoqw6hqft",
    region: "eu-west-1",
}

export const S3BucketFolder = 'item-image/'

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
    "Content-Type": "application/json",
};

exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers: headers,
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: headers,
            body: JSON.stringify({ message: 'Method not allowed, supported methods: POST' }),
        };
    }

    try {
        const body = JSON.parse(event.body);

        const { fileName, fileType } = body;

        console.log("fileName, fileType", fileName, fileType)

        if (!fileName || !fileType) {
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({ message: 'Missing required fields: fileName and fileType' }),
            };
        }

        const params = {
            Bucket: S3BucketOptions.bucketName,
            Key: fileName, // Full key (e.g., "uploads/image.png")
            ContentType: fileType,
            Expires: 60, // Presigned URL expiration time in seconds
        };

        const uploadURL = await s3.getSignedUrlPromise('putObject', params);

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({
                message: 'Presigned URL successfully generated',
                uploadURL,
                filePath: `s3://${bucketName}/${fileName}`,
            }),
        };
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({
                message: 'Internal server error',
            }),
        };
    }
};