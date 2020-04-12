import React, { Component } from 'react'
import {
    Row,
    Col,
} from 'reactstrap'

class LoadingComponent extends Component {
    render() {
        return (
            <Row className="p-5">
                <Col xs="12" className="text-center">
                    <div className="spinner-border text-warning" role="status">
                        <span className="sr-only">Carregando Componente</span>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default LoadingComponent