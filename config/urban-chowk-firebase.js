require("dotenv").config();

module.exports = {
  firebase: {
    "type": "service_account",
    "project_id": process.env.FIREBASE_CLIENT_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_CLIENT_AUTH,
    "token_uri": process.env.FIREBASE_CLIENT_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_CLIENT_AUTH_PROVIDER,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_CLIENT_CERT
  }
}