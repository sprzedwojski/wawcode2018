import React from 'react'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

class MyDrawer extends React.Component {
    handleRequestChange(open) {
        this.props.onDrawerStateChanged(open)
    }

    handleTypeClicked(item) {
        this.handleRequestChange(false)
        this.props.onTypeSelected(item)
    }

    render() {
        return (
            <Drawer
                docked={false}
                width={200}
                open={this.props.open}
                onRequestChange={open => this.handleRequestChange(open)}
            >
                {this.props.items.map(item =>
                    <MenuItem key={item.type} onClick={() => this.handleTypeClicked(item)}>{item.namePl}</MenuItem>
                )}
            </Drawer>
        )
    }
}

export default MyDrawer
