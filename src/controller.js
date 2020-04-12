import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import {
  Container
} from "reactstrap"

// Components
import PicPayPage from './pages/PicPay'

class MainController extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={PicPayPage} />
      </Router>
    )
  }
}

export default MainController
