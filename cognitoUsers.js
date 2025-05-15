const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

const userPoolId = 'eu-west-1_24H3H8KXv';

exports.handler = async (event) => {
    try {
        const email = event.queryStringParameters?.email;
        console.log("email", email)
        if (!email) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
                    "Access-Control-Allow-Credentials": true
                },
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
                body: JSON.stringify({ message: 'User not found' }),
            };
        }


        // const userId = result.Users[0].Username;
        const user = result.Users[0];

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({ user: user }),
        };
    } catch (error) {
        console.error('Error retrieving user:', error);

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};

