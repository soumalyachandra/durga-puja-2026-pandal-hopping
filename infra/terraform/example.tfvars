# Example variable overrides. Copy to `terraform.tfvars` and edit.
# (terraform.tfvars is gitignored so your values stay local.)

aws_region   = "ap-south-1"
project_name = "durga-puja-2026-pandal-hopping"

lambda_memory_mb = 256
lambda_timeout_s = 15

# For production, replace "*" with your real frontend origin(s), e.g.:
# allowed_origins = ["https://pujo.example.com"]
allowed_origins = ["*"]
