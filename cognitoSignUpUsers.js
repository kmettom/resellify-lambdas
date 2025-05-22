const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

const userPoolId = 'eu-west-1_24H3H8KXv';
const clientId = 'YOUR_USER_POOL_CLIENT_ID'; // Replace with your Cognito App Client ID

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
            body: JSON.stringify({ message: 'Method not allowed' }),
        };
    }

    try {
        const body = JSON.parse(event.body);

        const { username, password, email } = body;

        if (!username || !password || !email) {
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({ message: 'Missing required fields: username, password, and email' }),
            };
        }

        const params = {
            ClientId: clientId,
            Username: username,
            Password: password,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email,
                },
            ],
        };

        const result = await cognito.signUp(params).promise();

        return {
            statusCode: 201,
            headers: headers,
            body: JSON.stringify({ message: 'User registered successfully', result }),
        };
    } catch (error) {
        console.error('Error signing up user:', error);

        let message = 'Internal server error';
        if (error.code === 'UsernameExistsException') {
            message = 'Username already exists';
        } else if (error.code === 'InvalidPasswordException') {
            message = 'Password does not meet the complexity requirements';
        } else if (error.code === 'InvalidParameterException') {
            message = 'Invalid parameter provided';
        }
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ message, error }),
        };
    }
};