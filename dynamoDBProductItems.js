const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = 'Items-livrgwhq6bgn3hqrktnwm2hxzi-NONE';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    "Content-Type": "application/json"
};

exports.handler = async (event) => {
    try {
        const itemsArray = JSON.parse(event.body);

        console.log("itemsArray", itemsArray);

        const promises = itemsArray.map(item => {
            const params = {
                TableName: tableName,
                Item: item,
            };
            return dynamodb.put(params).promise();
        });

        const savedItems = await Promise.all(promises);

        console.log("savedItems", savedItems)

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({message: 'Item successfully saved', items: savedItems}),
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
