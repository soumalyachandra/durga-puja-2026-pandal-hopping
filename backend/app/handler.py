"""AWS Lambda entry point.

API Gateway (HTTP API, payload format v2) invokes this handler. Mangum adapts
the ASGI FastAPI app to the Lambda event/response contract, so the exact same
``app`` that runs under uvicorn locally also runs serverless — no code forks.
"""

from mangum import Mangum

from app.main import app

handler = Mangum(app, lifespan="off")
