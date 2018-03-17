import React, { Component } from 'react'
import { AppBar } from 'material-ui'
import client from './client'
import './App.css'
import MapComponent from './map-component'

class App extends Component {
    constructor() {
        super()
        this.state = {
            message: ''
        }
    }

    // componentDidMount() {
    //     client.get('/api/test')
    //         .then(res => this.setState({ message: res.data.message }))
    // }

    render() {
        return (
            <div className="App">
                <AppBar title="Gdzie na zakupy w niedzielę?"/>
                <MapComponent
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAjCi8R-MDjzw40FbSMKNRNfgsjySNiJuM"
                    loadingElement={<div style={{ height: '100%' }}/>}
                    containerElement={<div style={{ height: '90vh' }}/>}
                    mapElement={<div style={{ height: '100%' }}/>}
                />
            </div>
        )
    }
}

export default App
