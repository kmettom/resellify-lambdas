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

        // Delete all items that belong to the userId
        const deletePromises = scanResult.Items.map(item => {
            const deleteParams = {
                TableName: tableName,
                Key: {
                    id: item.id,  // Replace "id" with your table's partition key, if different
                },
            };
            return dynamodb.delete(deleteParams).promise();
        });

        await Promise.all(deletePromises);

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({message: `Successfully deleted items for UserID: ${UserID}`}),
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