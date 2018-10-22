module.exports.parseList = (list) => {
    return list.Contents.map(element => {
        const key = element.Key.split('.')
        return key[0]
    })
}