from twilio.rest import Client
from twilio.http.http_client import TwilioHttpClient
import requests

sid = "AC38112b64a51dbbb34ea1db098da86ab0"
token = "4198d10c25c2f57a87ff57138126451c"
service_sid = "VA695486c822347a776618117df64e6594"

# Disable SSL verification (only for testing)
proxy_client = TwilioHttpClient()
proxy_client.session.verify = False  # Disable cert check

client = Client(sid, token, http_client=proxy_client)

try:
    verification = client.verify.v2.services(service_sid).verifications.create(
        to="+918511918853",  # your phone number
        channel="sms"
    )
    print(f"OTP Sent: {verification.sid}")
except Exception as e:
    print(f"Twilio Error: {e}")
