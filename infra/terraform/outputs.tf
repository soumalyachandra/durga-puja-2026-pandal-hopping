output "api_base_url" {
  description = "Base URL of the deployed API. Use this as the frontend VITE_API_BASE_URL."
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "health_check_url" {
  description = "Convenience URL to verify the deployment."
  value       = "${aws_apigatewayv2_stage.default.invoke_url}/api/health"
}

output "lambda_function_name" {
  description = "Name of the Lambda function."
  value       = aws_lambda_function.api.function_name
}

output "lambda_log_group" {
  description = "CloudWatch log group for the Lambda."
  value       = aws_cloudwatch_log_group.lambda.name
}

output "region" {
  value = data.aws_region.current.name
}
