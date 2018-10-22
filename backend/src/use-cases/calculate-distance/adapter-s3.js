const BUCKET_NAME = process.env.BUCKET_NAME

module.exports.getFileMetadata = (storage, location) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: `${location}.json`
    }
    return storage.headObject(params).promise()
}