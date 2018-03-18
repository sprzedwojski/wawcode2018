import React, { Component } from 'react'
import { GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs } from 'react-google-maps'
import { List, ListItem } from 'material-ui/List'
import ActionGrade from 'material-ui/svg-icons/action/grade'
import { AlertError, AlertWarning } from 'material-ui/svg-icons/index'
import { RaisedButton } from 'material-ui'

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
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)'
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
        console.log(this.map.getCenter())
    }

    render() {
        return (
            <div>
                {this.state.centerChanged && <RaisedButton label="Wyszukaj w tym obszarze" style={this.buttonStyle}
                                                           onClick={() => this.setState({ centerChanged: false })}/>}
                <GoogleMap
                    defaultZoom={13}
                    defaultCenter={this.warsawCoords}
                    center={this.props.userLocation && this.props.userLocation}
                    onCenterChanged={() => this.handleCenterChanged()}
                    ref={this.onMapMounted.bind(this)}
                >
                    {
                        this.props.markers.map(marker =>
                            <Marker key={marker.id} position={{ lat: marker.location.lat, lng: marker.location.lng }}
                                    onClick={() => this.toggleInfoWindow(marker.id)}>
                                {this.state.openMarkerId === marker.id &&
                                <InfoWindow onCloseClick={() => this.toggleInfoWindow(marker.id)}>
                                    <InfoWindowContent marker={marker}
                                                       suggestOpen={this.props.handleSuggestOpen}
                                                       suggestClosed={this.props.handleSuggestClosed}
                                    />
                                </InfoWindow>
                                }
                            </Marker>
                        )}
                    {this.props.userLocation &&
                    <Marker key='user' position={this.props.userLocation}/>
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
    return (
        <div>
            <List>
                <ListItem primaryText="Otwarte we wszystkie niedziele" leftIcon={<ActionGrade/>}/>
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
