const BUCKET_NAME = process.env.BUCKET_NAME

module.exports.listObjects = (storage) => {
    const params = {
        Bucket: BUCKET_NAME,
        MaxKeys: 100
    }
    return storage.listObjectsV2(params).promise()
}