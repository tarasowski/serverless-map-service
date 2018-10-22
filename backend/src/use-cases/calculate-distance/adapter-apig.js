const AWS = require('aws-sdk')
const storage = new AWS.S3({ region: process.env.BUCKET_REGION })
const { ok, internalError, badRequest } = require('./lib/http')
const { parseRequest } = require('./lib/parse')
const calculate = require('./calculator')

module.exports.handler = async (event) => {
    const location = parseRequest(event)
    try {
        const distance = await calculate(storage, location)
        if (!distance) return badRequest('Your location is not valid. Please try again!')
        return ok({
            location,
            distance
        })
    } catch (err) {
        console.log(err)
        return internalError()
    }
}