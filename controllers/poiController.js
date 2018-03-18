const poiService = require('../services/poiService')

exports.getPois = (req, res) => {
    let searchType = req.query.type
    if (searchType === undefined) {
        searchType = 'store'
    }
    poiService.getPoisByType(req.query.latLong, searchType, pois => res.json(pois))
}

exports.addPoi = (req, res) => {
    poiService.savePoi(req.body.poi)
    res.sendStatus(200)
}

exports.editPoi = (req, res) => {
    poiService.editPoi(req.params.id, req.body, () => res.sendStatus(200))
}

exports.editPoiAdmin = (req, res) => {
    poiService.editPoiAdmin(req.params.id, req.body, () => res.sendStatus(200))
}

exports.getOurPois = (req, res) => {
    res.json(poiService.getOurPois())
}