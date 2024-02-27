import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import validator from 'validator';
import { ValidationResult } from "../types/validation";
import { COMPANY_TABLE, PRODUCT_INDEX, SK_PRODUCT_PREFIX } from "../const/dynamo.const";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Finds one Company by its Company Id.
 */
async function handler(event: APIGatewayProxyEvent, context: Context) {

  const productId = event.pathParameters?.id;

  // Validate function input.
  const validationResult: ValidationResult = validate(productId);
  if (!validationResult.isValid) {
    return {
      statusCode: 400,
      body: JSON.stringify({error: validationResult.message}),
    };
  }

  const queryCommand = new QueryCommand({
    TableName: COMPANY_TABLE,
    IndexName: PRODUCT_INDEX,
    KeyConditionExpression: "sk = :sk",
    ExpressionAttributeValues: {
      ":sk": `${SK_PRODUCT_PREFIX}${productId}`
    }
  })

  const queryCommandOutput = await docClient.send(queryCommand);

  // Handle Gateway response with Dynamo result.
  let response: APIGatewayProxyResult
  if (!queryCommandOutput.Items || queryCommandOutput.Items.length === 0) {
    response = {
      statusCode: 404,
      body: 'Product not found',
    };
  } else {
    response = {
      statusCode: 200,
      body: JSON.stringify(queryCommandOutput.Items[0]),
    };
  }

  return response;
}

/**
 * Validates the companyId path parameter.
 */
function validate(productId: string|undefined): ValidationResult {
  let validationResult: ValidationResult = {
    isValid: true,
    message: ''
  }

  if (!productId) {
    validationResult = {
      isValid: false,
      message: 'Product Id is undefined'
    };
  } else if(!validator.isNumeric(productId)) {
    validationResult = {
      isValid: false,
      message: 'Product Id should be numeric'
    };
  }

  return validationResult;
}

export { handler };