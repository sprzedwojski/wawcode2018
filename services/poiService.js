const data = require('../data/pois')
const googleApi = require('../googleApi')

const localPoiStorage = []

const alwaysOpen = {
    open: {
        freeSundays: { open: true, openingHour: '0:00', closingHour: '23:59' },
        workingSundays: {},
        freeSundaysSuggestions: []
    }
}

const pharmacyOpen = {
    open: {
        freeSundays: { open: true, openingHour: '8:00', closingHour: '20:00' },
        workingSundays: {},
        freeSundaysSuggestions: []
    }
}

Object.assign(localPoiStorage, data.pois)

const getPoiById = id => localPoiStorage.filter(item => item.id === id)[0]

exports.getPoisByType = (location, type, cb) => {
    googleApi.getPointsByType(location, type, (items) => {
        const pois = items.map((item) => {
            const poiData = getPoiById(item.id)
            const poi = {
                id: item.id,
                location: item.geometry.location,
                name: item.name
            }
            if (item.types.includes('gas_station')) {
                poi.open = alwaysOpen.open
            } else if (item.types.includes('pharmacy')) {
                poi.open = pharmacyOpen.open
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

const openingHours = ['9:00', '10:00', '11:00', '12:00']
const closingHours = ['14:00', '15:00', '16:00', '17:00', '18:00']

exports.editPoiAdmin = (id, open, callback) => {
    const item = getPoiById(id)
    if (item === undefined) {
        this.savePoi({
            id,
            open: {
                freeSundays: {
                    open: true,
                    openingHour: openingHours[Math.floor(Math.random() * openingHours.length)],
                    closingHour: closingHours[Math.floor(Math.random() * closingHours.length)]
                },
                workingSundays: {},
                freeSundaysSuggestions: []
            }
        })
    }
    callback()
}

exports.getOurPois = () => localPoiStorage
