import React, { Component } from 'react'
import BezierEditor from 'bezier-easing-editor'
import {
  HuePicker,
  AlphaPicker
} from 'react-color'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div>
        <HuePicker />
        <AlphaPicker />
        I am a React Component =)
      </div>
    )
  }
}
