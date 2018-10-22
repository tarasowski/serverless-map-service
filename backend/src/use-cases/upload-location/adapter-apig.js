const AWS = require('aws-sdk')
const storage = new AWS.S3({ region: process.env.BUCKET_REGION })
const { ok, internalError, badRequest } = require('./lib/http')
const { uploadLocation } = require('./adapter-s3')
const { parseRequest } = require('./lib/parse')

module.exports.handler = async (event) => {
    const file = parseRequest(event)
    try {
        if (!file.coordinates.ltn && !file.coordinates.lng) return badRequest('Error: Please provide lat & lng values in your file. Please try again!')
        await uploadLocation(storage, file)
        return ok('Your location was successfully uploaded')
    } catch (err) {
        console.log(err)
        return internalError()

    }
}