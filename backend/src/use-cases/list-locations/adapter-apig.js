const AWS = require('aws-sdk')
const storage = new AWS.S3({ region: process.env.BUCKET_REGION })
const { internalError, ok } = require('./lib/http')
const { listObjects } = require('./adapter-s3')
const { parseList } = require('./lib/parse')


module.exports.handler = async (event) => {
    try {
        const list = await listObjects(storage)
        const locations = parseList(list)
        return ok(locations)
    }
    catch (err) {
        console.log(err)
        return internalError()
    }
}