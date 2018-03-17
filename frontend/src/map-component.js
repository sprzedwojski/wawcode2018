import React, { Component } from 'react'
import { GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs } from 'react-google-maps'
import { List, ListItem } from 'material-ui/List'
import ActionGrade from 'material-ui/svg-icons/action/grade'

class MapComponent extends Component {
    constructor() {
        super()
        this.warsawCoords = { lat: 52.237049, lng: 21.017532 }
        this.state = {
            openMarkerId: null
        }
    }

    toggleInfoWindow(markerId) {
        if (this.state.openMarkerId === markerId) {
            this.setState({ openMarkerId: null })
        } else {
            this.setState({ openMarkerId: markerId })
        }
    }

    render() {
        return (
            <GoogleMap
                defaultZoom={13}
                defaultCenter={this.warsawCoords}
            >
                {
                    this.props.markers.map(marker =>
                    <Marker key={marker.id} position={{ lat: marker.location.lat, lng: marker.location.lng }}
                            onClick={() => this.toggleInfoWindow(marker.id)}>
                        {this.state.openMarkerId === marker.id &&
                        <InfoWindow onCloseClick={() => this.toggleInfoWindow(marker.id)}>
                            <InfoWindowContent marker={marker}/>
                        </InfoWindow>
                        }
                    </Marker>
                )}
            </GoogleMap>
        )
    }
}

const InfoWindowContent = props => (
    <div>
        {props.marker.open && props.marker.open.freeSundays.open && <List>
            <ListItem primaryText="Otwarte we wszystkie niedziele!" leftIcon={<ActionGrade/>}/>
        </List>}
        {props.marker.open && !props.marker.open.freeSundays.open && <List>
            <ListItem primaryText="Zamknięte... :(" leftIcon={<ActionGrade/>}/>
        </List>}
        {!props.marker.open && <List>
            <ListItem primaryText="Niestety nic nie wiemy o tym POI... :(" leftIcon={<ActionGrade/>}/>
        </List>}
    </div>
)

export default withScriptjs(withGoogleMap(MapComponent))
