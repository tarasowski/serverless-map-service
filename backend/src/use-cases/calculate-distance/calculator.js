const { getFileMetadata } = require('./adapter-s3')
const STARTING_LAT = process.env.STARTING_LAT
const STARTING_LNG = process.env.STARTING_LNG

const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}

// Source: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
const getDistanceFromLatLonInKm = (data) => {
    const params = { ...data }
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(params.lat2 - params.lat1)  // deg2rad below
    const dLon = deg2rad(params.lng2 - params.lng1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(params.lat1)) * Math.cos(deg2rad(params.lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c) // Distance in km
}

const calculateDistanceFromS3File = async (storage, location) => {
    try {
        const response = await getFileMetadata(storage, location)
        const lat2 = response.Metadata['x-amz-meta-lat']
        const lng2 = response.Metadata['x-amz-meta-lng']
        const params = {
            lat1: STARTING_LAT,
            lng1: STARTING_LNG,
            lat2: Number(lat2),
            lng2: Number(lng2)
        }
        const distance = getDistanceFromLatLonInKm(params)
        return distance
    } catch (err) {
        console.log(err)
        if (err.code === 'NotFound') return null
        throw new Error(err)
    }

}

module.exports = calculateDistanceFromS3File
