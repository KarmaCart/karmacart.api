import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ALL_PRODUCTS_BY_SORT_INDEX, COMPANY_TABLE } from "../const/dynamo.const";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Finds all Products, sorted by name.
 */
async function handler(event: APIGatewayProxyEvent, context: Context) {

  const queryCommand = new QueryCommand({
    TableName: COMPANY_TABLE,
    IndexName: ALL_PRODUCTS_BY_SORT_INDEX,
    KeyConditionExpression: "allProductsGSIPK = :allProductsGSIPK",
    ExpressionAttributeValues: {
      ":allProductsGSIPK": "PRODUCT#ALL"
    },
    ScanIndexForward: true
  })

  const queryCommandOutput = await docClient.send(queryCommand);

  // Handle Gateway response with Dynamo result.
  let response: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify(queryCommandOutput.Items),
    };

  return response;
}

export { handler };