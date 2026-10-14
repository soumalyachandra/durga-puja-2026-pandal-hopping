variable "aws_region" {
  description = "AWS region to deploy into."
  type        = string
  default     = "ap-south-1" # Mumbai — closest region to Kolkata.
}

variable "project_name" {
  description = "Name prefix for all created resources."
  type        = string
  default     = "durga-puja-2026-pandal-hopping"
}

variable "lambda_memory_mb" {
  description = "Memory (MB) for the Lambda function."
  type        = number
  default     = 256
}

variable "lambda_timeout_s" {
  description = "Timeout (seconds) for the Lambda function."
  type        = number
  default     = 15
}

variable "log_retention_days" {
  description = "CloudWatch Logs retention for the Lambda log group."
  type        = number
  default     = 14
}

variable "allowed_origins" {
  description = <<-EOT
    CORS allow-list passed to the app as the ALLOWED_ORIGINS env var AND used for
    API Gateway CORS. Use ["*"] for easy testing; set your real frontend origin(s)
    (e.g. ["https://pujo.example.com"]) for production.
  EOT
  type        = list(string)
  default     = ["*"]
}

variable "lambda_build_dir" {
  description = "Directory that the build script populates (app code + deps) before apply."
  type        = string
  default     = "build"
}
