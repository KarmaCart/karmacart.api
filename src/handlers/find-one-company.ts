import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import validator from 'validator';
import { ValidationResult } from "../types/validation";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Finds one Company by its Company Id.
 */
async function handler(event: APIGatewayProxyEvent, context: Context) {

  const companyId = event.pathParameters?.id;

  // Validate function input.
  const validationResult: ValidationResult = validate(companyId);
  if (!validationResult.isValid) {
    return {
      statusCode: 400,
      body: JSON.stringify({error: validationResult.message}),
    };
  }

  // Get Company from Dynamo Table.
  const command = new GetCommand({
    TableName: "Company",
    Key: {
      pk: `COMPANY#${companyId}`,
    },
  });

  const getCommandOutput = await docClient.send(command);

  // Handle Gateway response with Dynamo result.
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

/**
 * Validates the companyId path parameter.
 */
function validate(companyId: string|undefined): ValidationResult {
  let validationResult: ValidationResult = {
    isValid: true,
    message: ''
  }

  if (!companyId) {
    validationResult = {
      isValid: false,
      message: 'Company Id is undefined'
    };
  } else if(!validator.isNumeric(companyId)) {
    validationResult = {
      isValid: false,
      message: 'Company Id should be numeric'
    };
  }

  return validationResult;
}

export { handler };