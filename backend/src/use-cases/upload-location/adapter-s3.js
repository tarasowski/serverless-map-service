const BUCKET_NAME = process.env.BUCKET_NAME

module.exports.uploadLocation = (storage, file) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: file.name,
        Metadata: {
            'x-amz-meta-lat': String(file.coordinates.lat),
            'x-amz-meta-lng': String(file.coordinates.lng)
        },
        Body: Buffer.from(JSON.stringify(file))
    }
    return storage.putObject(params).promise()
}

module.exports.deleteLocation = (storage, params) => {
    return storage.deleteObject(params).promise()
}