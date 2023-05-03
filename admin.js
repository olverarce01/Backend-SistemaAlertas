import * as dotenv from 'dotenv'
dotenv.config()

import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({        
    type: "service_account",
    project_id: "vigilant-12535",
    private_key_id: process.env.Private_key_id,
    private_key: process.env.private_key? (JSON.parse(process.env.private_key)):undefined,
    client_email: "firebase-adminsdk-v6l96@vigilant-12535.iam.gserviceaccount.com",
    client_id: "106643052260083512683",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-v6l96%40vigilant-12535.iam.gserviceaccount.com"
  })
});

export default admin;