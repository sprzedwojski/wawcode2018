import React, { Component } from 'react'
import {AppBar, Chip, Toggle, Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui'
import { ActionTrackChanges } from 'material-ui/svg-icons/index'
import client from './client'
import './App.css'
import MapComponent from './map-component'
import MyDrawer from './my-drawer'

class App extends Component {
    constructor() {
        super()
        this.state = {
            pois: [],
            onlyFreeSundays: false,
            drawerOpen: false
        }
        this.warsawCenterLatLong = '52.237049,21.017532'
        this.lastLatLong = this.warsawCenterLatLong
        this.searchType = 'store'
        this.freeSundays = [
            '2018-03-18',
            '2018-04-01',
            '2018-04-08',
            '2018-04-22',
            '2018-05-13',
            '2018-05-20',
            '2018-06-10',
            '2018-06-17',
            '2018-07-08',
            '2018-07-15',
            '2018-07-22',
            '2018-08-12',
            '2018-08-19',
            '2018-09-09',
            '2018-09-16',
            '2018-09-23',
            '2018-10-14',
            '2018-10-21',
            '2018-11-11',
            '2018-11-18',
            '2018-12-09'
        ]
        this.poiTypes = [
            {
                namePl: 'Wszystkie',
                type: 'store'
            },
            {
                namePl: 'Piekarnie',
                type: 'bakery'
            },
            {
                namePl: 'Ubrania',
                type: 'clothing_store'
            },
            {
                namePl: 'Dom towarowy',
                type: 'department_store'
            },
            {
                namePl: 'Elektronika',
                type: 'electronics_store'
            },
            {
                namePl: 'Stacje benzynowe',
                type: 'gas_station'
            },
            {
                namePl: 'Sklepy z alkoholem',
                type: 'liquor_store'
            },
            {
                namePl: 'Apteki',
                type: 'pharmacy'
            },
            {
                namePl: 'Buty',
                type: 'shoe_store'
            },
            {
                namePl: 'Centrum handlowe',
                type: 'shopping_mall'
            },
            {
                namePl: 'Supermarket',
                type: 'supermarket'
            }
        ]
    }

    componentDidMount() {
        this.getPois()
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                location: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            })
            this.getPois(`${position.coords.latitude},${position.coords.longitude}`)
        }, (error) => {
            console.log('error getting location', error)
        })
        console.log(process.env.NODE_ENV)
    }

    getNextSunday() {
        const sunday = 0
        const date = new Date()
        if (date.getDay() === sunday) {
            return date
        }
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + (7 - date.getDay()))
    }

    getPois(latLong) {
        if (latLong) {
            this.lastLatLong = latLong
        }

        client.get('/api/pois', {
            params: {
                latLong: latLong || this.lastLatLong,
                type: this.searchType
            }
        }).then(res => this.setState({ pois: res.data }))
    }

    handleSuggestOpen(markerId) {
        console.log(`marker id ${markerId} suggested as open`)
        client.post(`/api/pois/${markerId}`, {
            open: true,
            openingHour: '11:00',
            closingHour: '15:00'
        }).then((res) => {
            console.log(res)
            this.getPois()
        })
    }

    handleSuggestClosed(markerId) {
        console.log(`marker id ${markerId} suggested as closed`)
        client.post(`/api/pois/${markerId}`, {
            open: false
        }).then((res) => {
            console.log(res)
            this.getPois()
        })
    }

    handleAdminMarkOpen(markerId) {
        console.log(`marker id ${markerId} admin marked as open`)
        client.post(`/api/admin/pois/${markerId}`, {
            open: true
        }).then((res) => {
            console.log(res)
            this.getPois()
        })
    }

    handleOnlyFreeSundaysToggled(event, isInputChecked) {
        this.setState({ onlyFreeSundays: isInputChecked })
        console.log(isInputChecked)
    }

    toggleDrawer() {
        this.setState({ drawerOpen: !this.state.drawerOpen })
    }

    handleDrawerStateChanged(open) {
        this.setState({ drawerOpen: open })
    }

    handleTypeSelected(poiType) {
        this.searchType = poiType.type
        this.getPois()
    }

    render() {
        const styles = {
            thumbSwitched: {
                backgroundColor: '#48ff00',
            },
            trackSwitched: {
                backgroundColor: '#8bff5e',
            },
            labelStyle: {
                color: 'white',
            }
        }
        const today = new Date()
        const nextSunday = this.getNextSunday()
        const isSunday = today.toISOString().split('T')[0] === nextSunday.toISOString().split('T')[0]
        const isNextSundayFree = this.freeSundays.filter(date => new Date(date) === nextSunday)
        let message = ''
        if (isSunday) {
            message = 'Dziś jest niedziela  '
        } else {
            message = `Następna niedziela to ${nextSunday.toLocaleString().split(',')[0]}. To będzie niedziela  `
        }
        message = message.concat(isNextSundayFree ? 'niehandlowa.' : 'zwykła.')
        return (
            <div className="App">
                <AppBar title="Gdzie na zakupy w niedzielę?"
                        iconElementRight={<Toggle
                            label="Tylko niedziele niehandlowe"
                            thumbSwitchedStyle={styles.thumbSwitched}
                            trackSwitchedStyle={styles.trackSwitched}
                            labelStyle={styles.labelStyle}
                            style={{ marginTop: '1rem' }}
                            defaultToggled={false}
                            onToggle={(event, isInputChecked) => this.handleOnlyFreeSundaysToggled(event, isInputChecked)}
                        />}
                        onLeftIconButtonClick={() => this.toggleDrawer()}
                />
                <MyDrawer open={this.state.drawerOpen}
                          onDrawerStateChanged={open => this.handleDrawerStateChanged(open)}
                          onTypeSelected={poiType => this.handleTypeSelected(poiType)}
                          items={this.poiTypes}
                />
                <Toolbar>
                    <ToolbarGroup>
                        {
                            isSunday && isNextSundayFree && <ActionTrackChanges color={'red'}/>
                        }
                        <ToolbarTitle text={message} style={{ marginLeft: '50px' }}/>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        {this.searchType !== 'store' &&
                            <Chip onRequestDelete={() => this.handleTypeSelected(this.poiTypes[0])}>
                                {this.poiTypes.filter(type => type.type === this.searchType)[0].namePl}
                            </Chip>
                        }
                    </ToolbarGroup>
                </Toolbar>
                <MapComponent
                    handleSuggestOpen={id => this.handleSuggestOpen(id)}
                    handleSuggestClosed={id => this.handleSuggestClosed(id)}
                    handleAdminMarkOpen={id => this.handleAdminMarkOpen(id)}
                    markers={this.state.onlyFreeSundays ? this.state.pois.filter(poi => poi.open && poi.open.freeSundays.open) : this.state.pois}
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyD4MEmEF15lUmc_65JM-YG7AqAmcCeZObU"
                    loadingElement={<div style={{ height: '100%' }}/>}
                    containerElement={<div style={{ height: '87vh' }}/>}
                    mapElement={<div style={{ height: '100%' }}/>}
                    userLocation={this.state.location}
                    forceGetPois={latLong => this.getPois(latLong)}
                />
            </div>
        )
    }
}

export default App
