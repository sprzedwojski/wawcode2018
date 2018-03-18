import React, { Component } from 'react'
import { AppBar } from 'material-ui'
import client from './client'
import './App.css'
import MapComponent from './map-component'

class App extends Component {
    constructor() {
        super()
        this.state = {
            pois: []
        }
        this.warsawCenterLatLong = '52.237049,21.017532'
        this.lastLatLong = this.warsawCenterLatLong
        this.searchType = 'store'
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

    getPois(latLong) {
        if (latLong) { this.lastLatLong = latLong }

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

    render() {
        return (
            <div className="App">
                <AppBar title="Gdzie na zakupy w niedzielę?"/>
                <MapComponent
                    handleSuggestOpen={id => this.handleSuggestOpen(id)}
                    handleSuggestClosed={id => this.handleSuggestClosed(id)}
                    handleAdminMarkOpen={id => this.handleAdminMarkOpen(id)}
                    markers={this.state.pois}
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAjCi8R-MDjzw40FbSMKNRNfgsjySNiJuM"
                    loadingElement={<div style={{ height: '100%' }}/>}
                    containerElement={<div style={{ height: '90vh' }}/>}
                    mapElement={<div style={{ height: '100%' }}/>}
                    userLocation={this.state.location}
                    forceGetPois={latLong => this.getPois(latLong)}
                />
            </div>
        )
    }
}

export default App
