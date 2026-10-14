########################################################################
# Durga Puja 2026 Pandal Hopping — AWS Serverless backend
#
# Provisions:
#   * IAM role + basic execution policy for Lambda
#   * CloudWatch log group (explicit, with retention)
#   * Lambda function (FastAPI via Mangum, python3.12)
#   * HTTP API Gateway (v2) with a catch-all proxy route + CORS
#   * Lambda invoke permission for API Gateway
#
# PREREQUISITE: run the build script first so ${var.lambda_build_dir}/ exists:
#   Linux/macOS :  ./build_lambda.sh
#   Windows     :  ./build_lambda.ps1
########################################################################

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {
  function_name = "${var.project_name}-api"
}

# ----------------------------------------------------------------------
# Package the Lambda. The build script installs Linux wheels + app code
# into the build dir; Terraform zips it here.
# ----------------------------------------------------------------------
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/${var.lambda_build_dir}"
  output_path = "${path.module}/dist/lambda.zip"
}

# ----------------------------------------------------------------------
# IAM
# ----------------------------------------------------------------------
data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_exec" {
  name               = "${local.function_name}-exec"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

# Minimal managed policy: write logs to CloudWatch. Nothing else is needed —
# the data is baked into the deployment package.
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# ----------------------------------------------------------------------
# Logs
# ----------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${local.function_name}"
  retention_in_days = var.log_retention_days
}

# ----------------------------------------------------------------------
# Lambda
# ----------------------------------------------------------------------
resource "aws_lambda_function" "api" {
  function_name = local.function_name
  role          = aws_iam_role.lambda_exec.arn

  runtime       = "python3.12"
  handler       = "app.handler.handler"
  architectures = ["x86_64"]

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  memory_size = var.lambda_memory_mb
  timeout     = var.lambda_timeout_s

  environment {
    variables = {
      ALLOWED_ORIGINS = join(",", var.allowed_origins)
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
    aws_cloudwatch_log_group.lambda,
  ]
}

# ----------------------------------------------------------------------
# HTTP API Gateway (v2) — cheaper & simpler than REST API.
# ----------------------------------------------------------------------
resource "aws_apigatewayv2_api" "http" {
  name          = "${var.project_name}-http-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = var.allowed_origins
    allow_methods = ["GET", "OPTIONS"]
    allow_headers = ["content-type", "authorization"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.api.invoke_arn
  payload_format_version = "2.0"
}

# Catch-all route: FastAPI does the real routing inside the Lambda.
resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 50
    throttling_rate_limit  = 100
  }
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowInvokeFromHttpApi"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}
