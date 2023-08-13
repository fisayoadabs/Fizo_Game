terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

# specify the provider region
provider "aws" {
  region = "ca-central-1"
}

# the locals block is used to declare constants that 
locals {
  four_word_function_name = "4-words"
  four_word_handler_name  = "main.four_word_handler"
  four_word_artifact_name = "../get-word/4-words/artifact.zip"
  five_word_function_name = "5-words"
  five_word_handler_name  = "main.five_word_handler"
  five_word_artifact_name = "../get-word/5-words/artifact.zip"
  six_word_function_name = "6-words"
  six_word_handler_name  = "main.six_word_handler"
  six_word_artifact_name = "../get-word/6-words/artifact.zip"
  random_word_function_name = "random-words"
  random_word_handler_name  = "main.random_word_handler"
  random_word_artifact_name = "../get-word/random-words/artifact.zip"
}

# create a role for the Lambda function to assume
resource "aws_iam_role" "IAM-role-all" {
  name               = "IAM-for-lambda"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# create 4 archive files from the 4 main.py

data "archive_file" "four_word" {
  type = "zip"
  source_file = "../get-word/4-words/main.py"
  output_path = local.four_word_artifact_name
}

data "archive_file" "five_word" {
  type = "zip"
  source_file = "../get-word/5-words/main.py"
  output_path = local.five_word_artifact_name
}

data "archive_file" "six_word" {
  type = "zip"
  source_file = "../get-word/6-words/main.py"
  output_path = local.six_word_artifact_name
}

data "archive_file" "random_word" {
  type = "zip"
  source_file = "../get-word/random-words/main.py"
  output_path = local.random_word_artifact_name
}


# Create all  Lambda functions

resource "aws_lambda_function" "lambda-function-four-word" {
  role             = aws_iam_role.IAM-role-all.arn
  function_name    = local.four_word_function_name
  handler          = local.four_word_handler_name
  filename         = local.four_word_artifact_name
  source_code_hash = data.archive_file.four_word.output_base64sha256

  runtime = "python3.9"
}

resource "aws_lambda_function" "lambda-function-five-word" {
  role             = aws_iam_role.IAM-role-all.arn
  function_name    = local.five_word_function_name
  handler          = local.five_word_handler_name
  filename         = local.five_word_artifact_name
  source_code_hash = data.archive_file.five_word.output_base64sha256

  runtime = "python3.9"
}

resource "aws_lambda_function" "lambda-function-six-word" {
  role             = aws_iam_role.IAM-role-all.arn
  function_name    = local.six_word_function_name
  handler          = local.six_word_handler_name
  filename         = local.six_word_artifact_name
  source_code_hash = data.archive_file.six_word.output_base64sha256

  runtime = "python3.9"
}

resource "aws_lambda_function" "lambda-function-random-word" {
  role             = aws_iam_role.IAM-role-all.arn
  function_name    = local.random_word_function_name
  handler          = local.random_word_handler_name
  filename         = local.random_word_artifact_name
  source_code_hash = data.archive_file.random_word.output_base64sha256

  runtime = "python3.9"
}

# create a policy for publishing logs to CloudWatch

resource "aws_iam_policy" "logs" {
  name        = "lambda-log"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "s3:*"
      ],
      "Resource": ["*"],
      "Effect": "Allow"
    }
  ]
}
EOF
}

# attach the above policy to the function role
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.IAM-role-all.name
  policy_arn = aws_iam_policy.logs.arn
}

# create a Function URL for Lambda functions

resource "aws_lambda_function_url" "four_word_url" {
  function_name      = aws_lambda_function.lambda-function-four-word.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "five_word_url" {
  function_name      = aws_lambda_function.lambda-function-five-word.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "six_word_url" {
  function_name      = aws_lambda_function.lambda-function-six-word.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "random_word_url" {
  function_name      = aws_lambda_function.lambda-function-random-word.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

# show the Function URL after creation

output "lambda_url_four_word" {
  value = aws_lambda_function_url.four_word_url.function_url
}

output "lambda_url_five_word" {
  value = aws_lambda_function_url.five_word_url.function_url
}

output "lambda_url_six_word" {
  value = aws_lambda_function_url.six_word_url.function_url
}

output "lambda_url_random_word" {
  value = aws_lambda_function_url.random_word_url.function_url
}

#Dictionary URL
# lambda_url_five_word = "https://ms4wwf4ic4qbgwijmtbmhp34ia0ygcwa.lambda-url.ca-central-1.on.aws/"
# lambda_url_four_word = "https://o3bg27pv7q5kiqv62d53ff74ne0vitar.lambda-url.ca-central-1.on.aws/"
# lambda_url_random_word = "https://5wqnoydq7xgni3fx2t7ir732qm0tigdh.lambda-url.ca-central-1.on.aws/"
# lambda_url_six_word = "https://6allmdrxlzswqtwyrsxf7zgtqe0eyksx.lambda-url.ca-central-1.on.aws/"
