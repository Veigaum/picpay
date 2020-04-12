import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import {
  Container
} from "reactstrap"

import './index.scss'

// Components
import PicPayPage from './pages/PicPay'

class MainController extends Component {
  render() {
    return (
      <Router>
        <Container fluid id="main">
          <Route exact path="/" component={PicPayPage} />
        </Container>
      </Router>
    )
  }
}

export default MainController
