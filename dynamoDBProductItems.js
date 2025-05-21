const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = 'Items-livrgwhq6bgn3hqrktnwm2hxzi-NONE';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
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
        const itemsArray = JSON.parse(event.body);

        const promises = itemsArray.map(item => {
            const params = {
                TableName: tableName,
                Item: item,
            };
            return dynamodb.put(params).promise();
        });

       await Promise.all(promises);

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({message: 'Item successfully saved', items: itemsArray}),
        };
    } catch (error) {
        console.error('Error saving item to DynamoDB:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({message: 'Internal server error'}),
        };
    }
};
