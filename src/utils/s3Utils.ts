export async function bucketExists(
  s3: AWS.S3,
  bucketName: string,
): Promise<boolean> {
  try {
    await s3.headBucket({ Bucket: bucketName }).promise();
    return true;
  } catch (err) {
    return false;
  }
}

export async function createBucketIfNotExists(
  s3: AWS.S3,
  bucketName: string,
): Promise<void> {
  try {
    const exists = await bucketExists(s3, bucketName);
    if (!exists) {
      await s3.createBucket({ Bucket: bucketName }).promise();
      console.log(`Bucket "${bucketName}" created successfully.`);
    } else {
      console.log(`Bucket "${bucketName}" already exists.`);
    }
  } catch (err) {
    console.error("Error creating/checking bucket:", err);
    throw err;
  }
}

export async function setPublicReadPolicy(
  s3: AWS.S3,
  bucketName: string,
): Promise<void> {
  try {
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: "s3:GetObject",
          Resource: `arn:aws:s3:::${bucketName}/*`,
          Condition: {
            "StringEquals": {
              "aws:Referer": "*"
            }
          }
        },
      ],
    };
    await s3
      .putBucketPolicy({ Bucket: bucketName, Policy: JSON.stringify(policy) })
      .promise();
    console.log(
      `Bucket "${bucketName}" policy updated for public read access.`,
    );
  } catch (err) {
    console.error("Error setting bucket policy:", err);
    throw err;
  }
}

export async function setPrivateWritePolicy(
  s3: AWS.S3,
  bucketName: string,
): Promise<void> {
  try {
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PrivateWritePutObject",
          Effect: "Allow",
          Principal: {
            AWS: process.env.S3_ACCESS_KEY, // Replace with your AWS account ID or IAM user ARN
          },
          Action: "s3:PutObject",
          Resource: `arn:aws:s3:::${bucketName}/*`,
          Condition: {
            "StringEquals": {
              "aws:Referer": "*"
            }
          }
        },
      ],
    };
    await s3
      .putBucketPolicy({ Bucket: bucketName, Policy: JSON.stringify(policy) })
      .promise();
    console.log(
      `Bucket "${bucketName}" policy updated for private write access.`,
    );
  } catch (err) {
    console.error("Error setting bucket policy:", err);
    throw err;
  }
}

export async function getPublicUploadURL(
  s3: AWS.S3,
  bucketName: string,
  objectKey: string,
): Promise<string> {
  try {
    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Expires: 90,
    };
    return s3.getSignedUrl("putObject", params);
  } catch (err) {
    console.error("Error generating public upload URL:", err);
    throw err;
  }
}

export async function getPublicDownloadURL(
  s3: AWS.S3,
  bucketName: string,
  objectKey: string,
): Promise<string> {
  try {
    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Expires: 90,
    };
    return s3.getSignedUrl("getObject", params);
  } catch (err) {
    console.error("Error generating private download URL:", err);
    throw err;
  }
}
