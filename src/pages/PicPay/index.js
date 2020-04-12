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
                <Container className="picpay">
                    <div className="box-all">
                        <div className="box-picpay">
                            <img onClick={() => window.open('https://picpay.me/veiguiz')} className="rounded" src={picpay} alt="Apoie o meu trabalho, doando qualquer quantia acima de R$ 0,05" />
                            <div className="description p-3 bg-light rounded text-dark p-2 mt-2 text-center">
                                <h5>Qualquer quantia me ajuda! 💚</h5>
                                <p className='m-0 p-0'>Abra o PicPay em seu telefone e escaneie o código acima para ajudar a comunidade.</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </>
        )
    }
}

export default PicPayPage