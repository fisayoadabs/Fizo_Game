import json
import boto3

bucket = boto3.client('s3')

def five_word_handler(event, context):
    bucket_name = "fiztech-wordle"
    bucket_json = "five-letter-wordbook.json"

    try:
        response = bucket.get_object(Bucket=bucket_name, Key=bucket_json)
        data = json.loads(response['Body'].read().decode('utf-8'))

        return {
            "statusCode": 200,
            "body": json.dumps(data)
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
