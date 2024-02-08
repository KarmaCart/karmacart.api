import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { COMPANY_TABLE } from "../const/dynamo.const";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Finds all Companies.
 */
async function handler(event: APIGatewayProxyEvent, context: Context) {

  // Scan entire table for all Companies
  const scanCommand = new ScanCommand({
    TableName: COMPANY_TABLE,
  });

  const scanCommandOutput = await docClient.send(scanCommand);

  // Handle Gateway response with Dynamo result.
  let response: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify(scanCommandOutput.Items),
    };

  return response;
}

export { handler };