/* eslint-disable no-undef */

import React, { Component } from 'react'
import { GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs } from 'react-google-maps'
import { List, ListItem } from 'material-ui/List'
import ActionGrade from 'material-ui/svg-icons/action/grade'
import { AlertError, AlertWarning, DeviceGpsFixed, ActionAlarm } from 'material-ui/svg-icons/index'
import { FloatingActionButton, RaisedButton } from 'material-ui'

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
            icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        } else if (marker.open && marker.open.freeSundaysSuggestions.filter(sugg => sugg.open).length > marker.open.freeSundaysSuggestions.filter(sugg => !sugg.open).length) {
            icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
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
                            <Marker key={marker.id}
                                position={{ lat: marker.location.lat, lng: marker.location.lng }}
                                onClick={() => this.toggleInfoWindow(marker.id)}
                                label={marker.name.substring(0, 20)}
                                icon={this.resolveMarkerIcon(marker)}>
                                {this.state.openMarkerId === marker.id &&
                                <InfoWindow onCloseClick={() => this.toggleInfoWindow(marker.id)}>
                                    <InfoWindowContent marker={marker}
                                                       suggestOpen={this.props.handleSuggestOpen}
                                                       suggestClosed={this.props.handleSuggestClosed}
                                                       adminMarkOpen={this.props.handleAdminMarkOpen}
                                    />
                                </InfoWindow>
                                }
                            </Marker>
                        )}
                    {this.props.userLocation &&
                    <Marker key='user' position={this.props.userLocation}
                    icon='https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/location-24-32.png'
                />
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
        <RaisedButton label="Admin: Oznacz jako otwarte" secondary={true} onClick={() => props.adminMarkOpen(props.marker.id)}/>
    </div>
)

const UnknownPOIInfo = props => (
    <div>
        <List>
            <ListItem primaryText="Niestety nic nie wiemy o tym POI... :(" leftIcon={<AlertWarning/>}/>
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
                <ListItem primaryText="Zamknięte w niedziele handlowe..." leftIcon={<AlertError/>}/>
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
