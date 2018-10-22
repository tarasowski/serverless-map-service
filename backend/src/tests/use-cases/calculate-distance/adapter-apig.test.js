const test = require('tape')
const AWS = require('aws-sdk')
const storage = new AWS.S3({ region: process.env.BUCKET_REGION })
const BUCKET_NAME = process.env.BUCKET_NAME

test('should create a s3 bucket', async assert => {
    assert.plan(1)
    const msg = 'bucket created'
    let actual
    const params = {
        Bucket: BUCKET_NAME,
    }
    try {
        actual = await storage.createBucket(params).promise()
    } catch (err) {
        assert.fail(err)
    }
    const expected = actual.hasOwnProperty('Location') ? actual : false
    assert.same(actual, expected, msg)
})

test('should upload a json file to s3', async assert => {
    assert.plan(1)
    const msg = 'file uploaded'
    const apiCall = require('../../../use-cases/upload-location/adapter-apig').handler
    const payload = require('../../../mocks/add-location-payload.json')
    let actual
    try {
        actual = await apiCall(payload)
    } catch (err) {
        assert.fail(err)
    }
    const expected = actual.statusCode === 200 ? actual : false
    assert.same(actual, expected, msg)

})

test('should retrieve metadata from an object and calculate distance', async assert => {
    assert.plan(1)
    const msg = 'calculate distance'
    const apiCall = require('../../../use-cases/calculate-distance/adapter-apig').handler
    const payload = require('../../../mocks/retrieve-location-payload.json')
    let actual
    try {
        const response = await apiCall(payload)
        actual = response
    } catch (err) {
        assert.fail(err)
    }
    const expected = JSON.parse(actual.body).distance === 503 ? actual : false

    assert.same(actual, expected, msg)
})


test('should delete an object from s3', async assert => {
    assert.plan(1)
    const msg = 'file deleted'
    const { deleteLocation } = require('../../../use-cases/upload-location/adapter-s3')
    const payload = require('../../../mocks/add-location-payload.json')
    let actual
    const params = {
        Bucket: BUCKET_NAME,
        Key: JSON.parse(payload.body).name
    }
    try {
        actual = await deleteLocation(storage, params)
    } catch (err) {
        assert.fail(err)
    }
    const expected = {}
    assert.same(actual, expected, msg)
})


test('should delete a s3 bucket', async assert => {
    assert.plan(1)
    const msg = 'bucket deleted'
    let actual
    const expected = {}
    const params = {
        Bucket: BUCKET_NAME
    }
    try {
        actual = await storage.deleteBucket(params).promise()
    } catch (err) {
        assert.fail(err)
    }
    assert.same(actual, expected, msg)
})