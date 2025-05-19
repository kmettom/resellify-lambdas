const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

const userPoolId = 'eu-west-1_24H3H8KXv';

const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true,  "Content-Type": "application/json" };

exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers: headers,
        };
    }

    try {
        const email = event.queryStringParameters?.email;
        console.log("email", email)

        if (!email) {
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({ message: 'Email query parameter is required' }),
            };
        }

        const params = {
            UserPoolId: userPoolId,
            Filter: `email = "${email}"`,
        };

        const result = await cognito.listUsers(params).promise();

        console.log("result", result)

        if (result.Users.length === 0) {
            return {
                statusCode: 404,
                headers: headers,
                body: JSON.stringify({ message: 'User not found' }),
            };
        }

        // const userId = result.Users[0].Username;
        const user = result.Users[0];

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ user: user }),
        };
    } catch (error) {
        console.error('Error retrieving user:', error);

        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};

