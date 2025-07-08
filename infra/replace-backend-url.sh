#!/bin/sh

# Replace backend URL placeholder with environment variable if provided
if [ ! -z "$API_URL" ]; then
  echo "Replacing backend URL with $API_URL"
  find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_API_URL_PLACEHOLDER|$API_URL|g" {} \;
fi

# Start nginx
exec "$@" 
