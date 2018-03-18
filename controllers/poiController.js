const poiService = require('../services/poiService')

exports.getPois = (req, res) => {
    res.json(poiService.getPois())
}

exports.getNearestPois = (req, res) => {
    poiService.getPois(req.query.latLong, pois => res.json(pois))
}

exports.addPoi = (req, res) => {
    poiService.savePoi(req.body.poi)
    res.sendStatus(200)
}

exports.editPoi = (req, res) => {
    poiService.editPoi(req.params.id, req.body, () => res.sendStatus(200))
}

exports.editPoiAdmin = (req, res) => {
    poiService.editPoi(req.params.id, req.body, () => res.sendStatus(200))
}

exports.getOurPois = (req, res) => {
    res.json(poiService.getOurPois())
}