docker exec -it isafety-nuxt node -e """
const crypto = require('crypto');
function token(){return crypto.randomBytes(16).toString('base64')}
console.log('STRAPI_APP_KEYS='+token()+','+token()+','+token()+','+token())
console.log('STRAPI_API_TOKEN_SALT='+token())
console.log('STRAPI_ADMIN_JWT_SECRET='+token())
console.log('STRAPI_TRANSFER_TOKEN_SALT='+token())
console.log('STRAPI_JWT_SECRET='+token())
"""

# inserting new nuxt 
echo "First Copy the generated API-key for .env file"
docker stop isafety-nuxt
docker rm isafety-nuxt
docker compose build nuxt
docker compuse up -d
