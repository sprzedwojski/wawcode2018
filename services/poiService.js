const data = require('../data/pois')

let localPoiStorage = []

Object.assign(localPoiStorage, data.pois)

exports.getPois = () => localPoiStorage

exports.savePoi = (poi) => {
    localPoiStorage.push(poi)
}
