import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions/app'
import {
  HuePicker,
  AlphaPicker
} from 'react-color'

class App extends Component {
  render() {
    const { getAppProperties } = this.props
    return (
      <div>
        <HuePicker />
        <AlphaPicker />
        <button onClick={() => getAppProperties('position', 1)}>Get app properties</button>
      </div>
    )
  }
}

export default connect(
  state => state.app,
  actions
)(App)
