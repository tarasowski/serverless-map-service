module.exports.parseRequest = (event) => {
    const body = JSON.parse(event.body)
    const name = body.name
    const coordinates = {
        lat: body.content.lat,
        lng: body.content.lng
    }
    return {
        name,
        coordinates,
        rest: { ...body }
    }
}