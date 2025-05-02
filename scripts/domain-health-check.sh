#!/bin/bash

DOMAIN="www.careecho.online"
API_ENDPOINT="/api/healthcheck"

echo "🔍 Running health check for $DOMAIN"
echo "========================================"

echo -e "\n📝 Basic Response Check:"
curl -I -s $DOMAIN | head -n 3

echo -e "\n⏱️ Timing Information:"
curl -w "DNS Resolution: %{time_namelookup}s\nTCP Connection: %{time_connect}s\nTLS Handshake: %{time_appconnect}s\nTime to First Byte: %{time_starttransfer}s\nTotal Time: %{time_total}s\n" -o /dev/null -s https://$DOMAIN

echo -e "\n🔒 Security Headers:"
curl -I -s https://$DOMAIN | grep -E 'Content-Security-Policy|Strict-Transport-Security|X-Content-Type-Options|X-Frame-Options'

echo -e "\n🔍 API Health Check:"
curl -s https://$DOMAIN$API_ENDPOINT

echo -e "\n🔄 Redirect Test:"
curl -L -s -o /dev/null -w "%{url_effective}\n" http://$DOMAIN

echo -e "\n📊 Performance Test (5 requests):"
for i in {1..5}; do 
  curl -s -w "%{time_total}\n" -o /dev/null https://$DOMAIN
done

echo -e "\n📝 Authentication Pages Check:"
AUTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/auth/signin)
echo "Sign-in page status: $AUTH_STATUS"

echo -e "\n✅ Check Complete!"

# Report findings
if [[ $(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN) == "200" && 
      $(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN$API_ENDPOINT) == "200" ]]; then
  echo -e "\n✅ Site appears to be healthy"
else
  echo -e "\n❌ Site may have issues - please investigate"
fi 