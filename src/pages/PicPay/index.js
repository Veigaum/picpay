import React, { Component } from 'react'
import {
    Container,
    Col,
    Row,
} from 'reactstrap'

import './picpay.scss'

import picpay from './../../assets/images/picpay_qrcode.PNG'

class PicPayPage extends Component {
    state = {
        loading: true
    }

    render() {
        return (
            <>
                <Container>
                    <div className="column">
                        <div className="d-flex align-items-center">
                                <img width="35px" src="https://static-cdn.jtvnw.net/jtv_user_pictures/21ca5256-499a-4d39-8b66-b60fbff91e7f-profile_image-300x300.png" alt="Veiguiz" className="img-fluid rounded-circle" />
                                <h3 className="ml-3" onClick={() => window.open('https://twitch.tv/veiguiz', '_blank')}>Veiguiz</h3>
                        </div>
                        <div className="align-self-center">
                            <img className="rounded" src={picpay} alt="Apoie o meu trabalho, doando qualquer quantia acima de R$ 0,05" />
                        </div>
                        <div className="p-3 bg-light rounded text-dark">
                            <h3>doe qualquer quantia para @veiguiz.</h3>
                            <p className='m-0 p-0'>Abra o PicPay em seu telefone e escaneie o código acima</p>
                        </div>
                    </div>
                </Container>
            </>
        )
    }
}

export default PicPayPage