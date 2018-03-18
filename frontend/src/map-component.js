/* eslint-disable no-undef */

import React, { Component } from 'react'
import { GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs } from 'react-google-maps'
import { List, ListItem } from 'material-ui/List'
import ActionGrade from 'material-ui/svg-icons/action/grade'
import { AlertError, AlertWarning, DeviceGpsFixed, ActionAlarm } from 'material-ui/svg-icons/index'
import { FloatingActionButton, RaisedButton } from 'material-ui'
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel'

class MapComponent extends Component {
    constructor() {
        super()
        this.warsawCoords = { lat: 52.237049, lng: 21.017532 }
        this.state = {
            openMarkerId: null,
            centerChanged: false
        }
        this.map = undefined
        this.buttonStyle = {
            position: 'fixed',
            top: '150px',
            left: '50%',
            transform: 'translateX(-50%)'
        }
        this.centerButtonStyle = {
            position: 'fixed',
            bottom: '100px',
            right: '5%',
            transform: 'translateX(5%)'
        }
    }

    toggleInfoWindow(markerId) {
        if (this.state.openMarkerId === markerId) {
            this.setState({ openMarkerId: null })
        } else {
            this.setState({ openMarkerId: markerId })
        }
    }

    onMapMounted(ref) {
        this.map = ref
    }

    handleCenterChanged() {
        this.setState({ centerChanged: true })
    }

    forceGetPois() {
        this.setState({ centerChanged: false })
        const centerObj = this.map.getCenter()

        // To jest magia...
        const center = JSON.parse(JSON.stringify(centerObj))

        const location = `${center.lat},${center.lng}`
        this.props.forceGetPois(location)
    }

    resolveMarkerIcon(marker) {
        let icon = ''
        if (marker.open && marker.open.freeSundays.open) {
            icon = './icon-green.png'
        } else if (marker.open && marker.open.freeSundaysSuggestions.filter(sugg => sugg.open).length > marker.open.freeSundaysSuggestions.filter(sugg => !sugg.open).length) {
            icon = './icon-blue.png'
        }
        return icon
    }

    render() {
        return (
            <div>
                {this.state.centerChanged && <RaisedButton label="Wyszukaj w tym obszarze" style={this.buttonStyle}
                                                           onClick={() => this.forceGetPois()}/>}
                <FloatingActionButton mini={true} style={this.centerButtonStyle} onClick={() => {
                    this.map.panTo(this.props.userLocation)
                    this.forceGetPois()
                }}>
                    <DeviceGpsFixed/>
                </FloatingActionButton>

                <GoogleMap
                    defaultZoom={17}
                    defaultCenter={this.warsawCoords}
                    center={this.props.userLocation && this.props.userLocation}
                    onCenterChanged={() => this.handleCenterChanged()}
                    ref={this.onMapMounted.bind(this)}>
                    {
                        this.props.markers.map(marker =>
                            <MarkerWithLabel key={marker.id}
                                position={{ lat: marker.location.lat, lng: marker.location.lng }}
                                onClick={() => this.toggleInfoWindow(marker.id)}
                                icon={this.resolveMarkerIcon(marker)}
                                labelAnchor={new google.maps.Point(0, 0)}>
                                <div>
                                    <span>{marker.name.substring(0, 20)}</span>
                                {
                                    this.state.openMarkerId === marker.id &&
                                <InfoWindow onCloseClick={() => this.toggleInfoWindow(marker.id)} position={{ lat: marker.location.lat, lng: marker.location.lng }}
                                options={{ pixelOffset: new google.maps.Size(-1, -38) }}
                                >
                                    <InfoWindowContent marker={marker}
                                                       suggestOpen={this.props.handleSuggestOpen}
                                                       suggestClosed={this.props.handleSuggestClosed}
                                                       adminMarkOpen={this.props.handleAdminMarkOpen}
                                    />
                                </InfoWindow>
                                }
                                </div>
                            </MarkerWithLabel>
                        )}
                    {this.props.userLocation &&
                    <Marker key='user' position={this.props.userLocation}
                    icon='https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/location-24-32.png'/>
                    }
                </GoogleMap>
            </div>
        )
    }
}

const InfoWindowContent = props => (
    <div>
        {props.marker.open && props.marker.open.freeSundays.open && <OpenFreeSundaysPOIInfo {...props}/>}
        {props.marker.open && !props.marker.open.freeSundays.open && <OpenWorkingSundaysPOIInfo {...props}/>}
        {!props.marker.open && <UnknownPOIInfo {...props}/>}
    </div>
)

const UnknownPOIInfo = props => (
    <div>
        <List>
            <ListItem primaryText={props.marker.name}/>
            <ListItem primaryText="Brak danych o punkcie." leftIcon={<AlertWarning/>}/>
        </List>
        <RaisedButton label="Oznacz jako otwarte" primary={true} onClick={() => props.suggestOpen(props.marker.id)}/>
    </div>
)

const OpenWorkingSundaysPOIInfo = (props) => {
    const { open } = props.marker
    const openSuggestions = open ? open.freeSundaysSuggestions.filter(fss => fss.open) : []
    return (
        <div>
            <List>
                <ListItem primaryText={props.marker.name}/>
                <ListItem primaryText="Brak danych o punkcie." leftIcon={<AlertError/>}/>
                {openSuggestions.length > 0 &&
                <ListItem primaryText={`${openSuggestions.length}
                    użytkowników zasugerowało otwarcie w niedziele handlowe`} leftIcon={<ActionGrade/>}/>
                }
            </List>
            <RaisedButton label="Oznacz jako otwarte" primary={true}
                          onClick={() => props.suggestOpen(props.marker.id)}/>
        </div>
    )
}

const OpenFreeSundaysPOIInfo = (props) => {
    const { open } = props.marker
    const closedSuggestions = open ? open.freeSundaysSuggestions.filter(fss => !fss.open) : []
    const hasOpeningHours = open && open.freeSundays && open.freeSundays.openingHour && open.freeSundays.closingHour
    return (
        <div>
            <List>
                <ListItem primaryText={props.marker.name}/>
                <ListItem primaryText="Otwarte we wszystkie niedziele" leftIcon={<ActionGrade/>}/>
                {hasOpeningHours ? <ListItem primaryText={`${open.freeSundays.openingHour} - ${open.freeSundays.closingHour}`} leftIcon={<ActionAlarm/>}/> : ''}
                {closedSuggestions.length > 0 &&
                <ListItem primaryText={`${closedSuggestions.length}
                    użytkowników zasugerowało zamknięcie w niedziele handlowe`} leftIcon={<AlertWarning/>}/>
                }
            </List>
            <RaisedButton label="Oznacz jako zamknięte" secondary={true}
                          onClick={() => props.suggestClosed(props.marker.id)}/>
        </div>
    )
}

export default withScriptjs(withGoogleMap(MapComponent))
