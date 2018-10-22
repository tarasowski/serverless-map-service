const test = require('tape')
const rewire = require('rewire')

test('should calculate the distance from office to munich', assert => {
    assert.plan(1)
    const msg = 'shows distance in km'
    const calculate = rewire('../../../use-cases/calculate-distance/calculator')
    const getDistanceFromLatLonInKm = calculate.__get__('getDistanceFromLatLonInKm')
    const data = {
        lat1: 48.137154,
        lng1: 11.576124,
        lat2: 52.502931,
        lng2: 13.408249
    }
    const actual = getDistanceFromLatLonInKm(data)
    const expected = 503
    assert.same(actual, expected, msg)
})