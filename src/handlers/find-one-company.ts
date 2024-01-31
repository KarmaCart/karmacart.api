import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import validator from 'validator';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

async function handler(event: APIGatewayProxyEvent, context: Context) {

  const companyId = event.pathParameters?.id

  if (!companyId) {
    throw new Error('Company id is undefined')
  }

  validator.isNumeric(companyId)

  const command = new GetCommand({
    TableName: "Company",
    Key: {
      pk: `COMPANY#${companyId}`,
    },
  });

  const getCommandOutput = await docClient.send(command);

  let response: APIGatewayProxyResult
  if (!getCommandOutput.Item) {
    response = {
      statusCode: 404,
      body: 'Company not found',
    };
  } else {
    response = {
      statusCode: 200,
      body: JSON.stringify(getCommandOutput.Item),
    };
  }

  return response;
}

export { handler };