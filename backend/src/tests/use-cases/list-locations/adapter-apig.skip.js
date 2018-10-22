const test = require('tape')
const AWS = require('aws-sdk')
const storage = new AWS.S3({ region: process.env.BUCKET_REGION })
const BUCKET_NAME = process.env.BUCKET_NAME


test('should create an s3 bucket', async assert => {
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

test('should upload an json file to s3', async assert => {
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

test('should list all locations aka objects', async assert => {
    assert.plan(1)
    const msg = 'locations listed'
    const payload = {}
    const apiCall = require('../../../use-cases/list-locations/adapter-apig').handler
    let actual
    try {
        actual = await apiCall(payload)
    } catch (err) {
        assert.fail(err)
    }
    const objectKey = JSON.parse(actual.body).Contents[0].Key
    const expected = objectKey === 'Muenchen.json' ? actual : false
    assert.same(actual, expected, msg)
})

test('should delete an object from s3', async assert => {
    assert.plan(1)
    const msg = 'file deleted'
    const { deleteLocation } = require('../../../use-cases/upload-location/adapter-s3')
    let actual
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'Muenchen.json'
    }
    try {
        actual = await deleteLocation(storage, params)
    } catch (err) {
        assert.fail(err)
    }
    const expected = {}
    assert.same(actual, expected, msg)
})


test('should delete an s3 bucket', async assert => {
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