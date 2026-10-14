# Method 1 — AWS Serverless (Terraform)

Deploys the FastAPI backend as an AWS Lambda function behind an HTTP API
Gateway. The same `app/` code that runs locally runs here, adapted by Mangum.

```
infra/terraform/
├── versions.tf        # Terraform + provider versions
├── variables.tf       # Inputs (region, memory, CORS, …)
├── main.tf            # Lambda, API Gateway, IAM, logs
├── outputs.tf         # api_base_url, health_check_url, …
├── build_lambda.sh    # Build the deployment dir (Linux/macOS)
├── build_lambda.ps1   # Build the deployment dir (Windows)
└── example.tfvars     # Copy to terraform.tfvars and edit
```

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/downloads) ≥ 1.5
- AWS CLI configured with credentials (`aws configure`) that can create IAM
  roles, Lambda functions, API Gateway, and CloudWatch log groups
- Python 3.12 available as `python` on your PATH (used only to *download* the
  Linux wheels — nothing runs locally)

## Deploy

```bash
cd infra/terraform

# 1. Build the Lambda package (installs Linux wheels + copies app code).
#    Windows PowerShell:  ./build_lambda.ps1
./build_lambda.sh

# 2. Provision.
terraform init
terraform apply        # review the plan, type "yes"
```

Terraform prints `api_base_url` and `health_check_url` at the end. Test it:

```bash
curl "$(terraform output -raw health_check_url)"
```

Then point the frontend at it by setting `VITE_API_BASE_URL` to the
`api_base_url` value (see the frontend README) and rebuild/redeploy the frontend.

## Updating

Re-run the build script (step 1) whenever backend code or dependencies change,
then `terraform apply`. The `source_code_hash` changes, so Lambda redeploys.

## Tear down

```bash
terraform destroy
```

## Notes & cost

- **Region** defaults to `ap-south-1` (Mumbai), closest to Kolkata. Override with
  `-var aws_region=...` or in `terraform.tfvars`.
- This is a **read-only JSON API with data baked into the package**, so the IAM
  role only grants CloudWatch Logs — nothing else.
- Lambda + HTTP API are pay-per-request and fit comfortably in the AWS Free Tier
  for personal/demo traffic. You still pay for Directions/Maps calls on the
  **Google** side (those happen in the browser, not here).
- **Cross-platform build:** the build scripts pass
  `--platform manylinux2014_x86_64 --only-binary=:all:` to pip so the compiled
  `pydantic-core` wheel matches the Lambda runtime even when you build on
  Windows/macOS. If you change the Lambda `architectures` to `arm64`, change the
  platform to `manylinux2014_aarch64` too.
