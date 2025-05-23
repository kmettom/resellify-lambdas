const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = 'Items-livrgwhq6bgn3hqrktnwm2hxzi-NONE';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
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

    try {
        // Parse incoming request body
        const {userId} = JSON.parse(event.body);

        if (!userId) {
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({message: 'UserId is required'}),
            };
        }

        // Scan the table to find all items belonging to the specified UserID
        const scanParams = {
            TableName: tableName,
            FilterExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
        };

        const scanResult = await dynamodb.scan(scanParams).promise();

        if (!scanResult.Items || scanResult.Items.length === 0) {
            return {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({message: `No items found for userId: ${userId}`}),
            };
        }

        
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({productItems: scanResult}),
        };

    } catch (error) {
        console.error('Error deleting items from DynamoDB:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({message: 'Internal server error'}),
        };
    }
};