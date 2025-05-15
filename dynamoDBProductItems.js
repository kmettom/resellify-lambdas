const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();


const tableName = 'Items-livrgwhq6bgn3hqrktnwm2hxzi-NONE';

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);

        const { userId, itemId, ...additionalData } = body;
        if (!userId || !itemId) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,access-control-allow-origin",
                    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({ message: 'userId and itemId are required fields' }),
            };
        }

        const item = {
            userId,
            itemId,
            ...additionalData,
        };

        const params = {
            TableName: tableName,
            Item: item,
        };

        await dynamodb.put(params).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,access-control-allow-origin",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({ message: 'Item successfully saved', item }),

        };
    } catch (error) {
        console.error('Error saving item to DynamoDB:', error);

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,access-control-allow-origin",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};
