import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({        
    type: "service_account",
    project_id: "vigilant-12535",
    private_key_id: process.env.Private_key_id,
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxYIhVsSE/4WCt\nuxYyQgCQl30AikGI17s3PUY9L6d90wbeP3yLPyqUTuBU+XpIASYPJxksvb9hWKjL\nnMGCO/V/2vS4256RJP2zJ76e0mhVHFaP/NhFoM9WhlNJU21iFOBw/FtBZTwGg9jG\nbxKQjqNBqKlJWX7s9mq8VlB3ZpDnJREP5xpjGe3GaoHdqdG4uz5rCezbchamVvsA\n+9Xgi+dtQTNacEiKcGZXWcwIbT48jspYtZA+wKWEL9Nzh1i2ORrCDqoupMwi6C+Q\nOBvW1q2rzg84Y5KP0VXd03GV78TIEI666wSLh7s8kEbGt03GseUvw+7sXERoIK17\nNXSbHr6hAgMBAAECggEAG+LMhEZU7x1QbPe6+VtBifna+90AiRI7e2d9dayahTBK\nReIOwziCye6tm4ZeOFg/4sV3kn5hSl1dKieij4Y8JiXm7/INF44MeaA/umnjX7AV\nFs1+NdIejqCPEvnT+kXEdFbkRN90xKRxTd8T+NiH55Brzt2MVBY4eRQL0f20vbXl\n2sD51c7gYRgO35+m7/Q0bZTzn/WA7K72PCqsWlJBqM08jazmhVvzntEbA6q7/eBE\nIMI45T7jPfMiZSGNDml2nEkisNM83DtqvIPxJ4Sm/YgNvwOV2x61eq2gAd2cLHF0\nScJWjvgHtWoAfrjpL3YQszIgLywjunbNGBAQS5rlPQKBgQDYAOCDWZavjuEfdaU3\nxIjJHDngxQAi6Q+dwBnZKFB9bU6tY9aeNBW0RKPov8LUtImnzI8a5Ax4q0JINFnV\nmJl58Vvt8kbc/n6VaHaUek5LiMyd1VU6w2XY6RssjXvs+CeyuiWqJoExMy8EFVqx\n4nakc7tREe9BtJ45g2iBwUDlBQKBgQDSOKqhemKb0h1b1HQsVz6Hxi2rhhvDLBQW\n2pRXX1KA0EzuVVQrxNQu5s6p/Ljn/1bPxUhG5GCqkylz6MgSUdHElons6tdOCcBi\nuweC0Mace/ewodD7Qjv6pRi09FYZynCwioeDvnoghvlRPCHH53SNGZwqHFXrDQsW\nva/U//0l7QKBgQCjSe5vfV9bcfCffqkagnlBRxQ95c8XlQYYI+umbUKDvwk2LH5G\n9Grf7u/V+HkJoT1a21nnYzRGWHjv6ptqzERhmeL7+yY01DLPMbxKvDbKBS1ht68J\nkENC+d1wDbj8SBCCnRPyD8+kaOQG+zmnteIoqdCWFa/ABRGDuuJbDMPJHQKBgDdm\nVZk+fnQf+Dq2D3OL/l+bm3eDXRefKyAmtEceSMjHnC6G8CqksWI20ym6/yOsh70z\neWutTchGBfuU0fz58PUE0w5LiTf4m+mo7j7MNDsS9GBpFIDSoKnaDlvJtFMRpYbw\nyuuuK9McnuGInkJnPbDdmekDFKVgB5cToB3a5GS1AoGBANIPZNczmpH6Q8EYq5e1\nZ4mkeA5JFU1fih2B2Ll2KiDQpUMFne59zAsUqtZQ1AMhVDJZHicmVD4BphHlK9Im\nfijzHFQ8lJVxMAFeDjz6JBGt0VlF1V1ty6qBA668LxsTbYWSHjev+yFG+DqWA+KX\nk1iwHmoP76zxHsyFesy0ukZu\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-v6l96@vigilant-12535.iam.gserviceaccount.com",
    client_id: "106643052260083512683",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-v6l96%40vigilant-12535.iam.gserviceaccount.com"
  })
});

export default admin;