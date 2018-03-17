import React, { Component } from 'react'
import { AppBar } from 'material-ui'
import client from './client'
import './App.css'

class App extends Component {
    constructor() {
        super()
        this.state = {
            message: ''
        }
    }

    componentDidMount() {
        client.get('/api/test')
            .then(res => this.setState({ message: res.data.message }))
    }

    render() {
        return (
            <div className="App">
                <AppBar title="Wawcode 2018"/>
                <div>
                    {this.state.message}
                </div>
            </div>
        )
    }
}

export default App
