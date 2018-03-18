const data = require('../data/pois')
const googleApi = require('../googleApi')

const localPoiStorage = []

Object.assign(localPoiStorage, data.pois)

const getPoiById = id => localPoiStorage.filter(item => item.id === id)[0]

exports.getPois = (location, cb) => {
    googleApi.getPoints(location, (items) => {
        const pois = items.map((item) => {
            const poiData = getPoiById(item.id)
            const poi = {
                id: item.id,
                location: item.geometry.location,
                name: item.name
            }
            if (poiData !== undefined) {
                poi.open = poiData.open
            }
            return poi
        })
        cb(pois)
    })
}

exports.savePoi = (poi) => {
    localPoiStorage.push(poi)
}

exports.editPoi = (id, open, callback) => {
    const item = getPoiById(id)
    if (item === undefined) {
        this.savePoi({
            id,
            open: {
                freeSundays: {},
                workingSundays: {},
                freeSundaysSuggestions: [open]
            }
        })
    } else {
        item.open.freeSundaysSuggestions.push(open)
    }
    callback()
}
