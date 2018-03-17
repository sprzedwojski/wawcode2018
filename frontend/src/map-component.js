import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

class MapComponent extends Component {
    constructor() {
        super()
        this.warsawCoords = { lat: 52.237049, lng: 21.017532 }
    }

    render() {
        return (
            <GoogleMap
                defaultZoom={13}
                defaultCenter={this.warsawCoords}
            >
                {this.props.markers.map(marker =>
                    <Marker key={marker.id} position={{ lat: marker.lat, lng: marker.lng }} />
                )}
            </GoogleMap>
        )
    }
}

export default withScriptjs(withGoogleMap(MapComponent))
