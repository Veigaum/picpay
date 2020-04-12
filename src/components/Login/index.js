import React, { Component } from 'react'
import { provider, auth } from './../../firebase'
// import { update } from "./../../services/bigquery"

import { getAddress } from "./../../services/google"
import { createUser } from "./../../services/users"

import {
    Form,
    FormGroup,
    Input,
    Button,
    Alert,
    Row,
    Col,
    Label
} from 'reactstrap'
import InputMask from 'react-input-mask'

import './login.scss'

import Loading from './../Loading/simple'

import btn_google from './../../assets/images/btn_google.png'

class LoginComponent extends Component {
    constructor(props) {
        super(props)

        this.login = this.login.bind(this)
        this.socialLogin = this.socialLogin.bind(this)
        this.register = this.register.bind(this)
        this.onChange = this.onChange.bind(this)
        this.handleDocumentChange = this.handleDocumentChange.bind(this)
        this.handleSexChange = this.handleSexChange.bind(this)
        this.getZipcode = this.getZipcode.bind(this)
    }

    state = {
        loading: false,
        user: null,
        alert: {
            status: false,
            error: false,
            message: "",
            color: ""
        },
        input: {
            email: "",
            newEmail: "",
            password: "",
            confirmEmail: "",
            newPassword: "",
            confirmPassword: "",
            zipcode: "",
            street: "",
            number: "",
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
            fullName: "",
            typeDocument: "cpf",
            cpf: "",
            cnpj: "",
            phone: "",
            sex: "masculino",
            birth: "",
            companyName: "",
            stateRegistration: ""
        },
        isNewUser: false,
        isLogging: false,
        isSocialLogging: false,
        isRegistering: false,
        provider: ""

    }

    handleSexChange = e => {
        this.setState({
            input: {
                ...this.state.input,
                sex: e.target.value
            }
        })
    }

    handleDocumentChange = e => {
        this.setState({
            input: {
                ...this.state.input,
                typeDocument: e.target.value
            }
        })
    }

    register = (e) => {
        e.preventDefault()
        const self = this
        const { confirmEmail: email, confirmPassword: password } = this.state.input
        const { input } = this.state
        const { userLogged } = this.props
        if (this.state.isNewUser) {
            this.setState({
                isRegistering: true,
                isNewUser: true,
                isLogging: false,
                isSocialLogging: false,
                provider: "password",
                alert: {
                    status: false,
                    error: false,
                    message: "",
                    color: ""
                }
            })

            auth().createUserWithEmailAndPassword(email, password)
                .then(response => {
                    let user = auth().currentUser
                    createUser({
                        full_name: input.fullName,
                        zipcode: input.zipcode,
                        street: input.street,
                        street_number: input.street_number,
                        complement: input.complement,
                        neighborhood: input.neighborhood,
                        city: input.city,
                        state: input.state,
                        email: email,
                        country: input.country,
                        phone: input.phone,
                        birth: input.bith,
                        type_document: input.typeDocument,
                        document: (input.typeDocument === 'cpf' ? input.cpf : input.cnpj),
                        sex: input.sex,
                        company_name: input.companyName,
                        state_registration: input.stateRegistration,
                        authorize: true
                    })
                        .then(response => {
                            if (response.status === 200 && !response.data.status.error) {
                                auth().signInWithEmailAndPassword(email, password)
                                    .then(async result => {
                                        const token = await auth().currentUser.getIdToken(true)
                                        self.setState({
                                            isRegistering: false,
                                            isNewUser: false,
                                            isLogging: false,
                                            isSocialLogging: false,
                                            alert: {
                                                status: true,
                                                error: false,
                                                message: "Cadastrado com sucesso no Firebase Auth e Logado",
                                                color: "success"
                                            },
                                        })
                                        userLogged({ token, displayName: input.fullName, email })
                                    })
                                    .catch(err => {
                                        self.setState({
                                            isRegistering: false,
                                            isNewUser: true,
                                            isLogging: false,
                                            isSocialLogging: false,
                                            alert: {
                                                status: true,
                                                error: true,
                                                message: "Houve um erro ao logar usuário após cadastro, cheque o console",
                                                color: "danger"
                                            }
                                        })
                                    })

                            } else {
                                self.setState({
                                    isRegistering: false,
                                    isNewUser: true,
                                    isLogging: false,
                                    isSocialLogging: false,
                                    alert: {
                                        status: true,
                                        error: true,
                                        message: "Houve um erro ao cadastrar usuário no database, cheque o console",
                                        color: "danger"
                                    }
                                })
                            }
                        })
                        .catch(err => {
                            self.setState({
                                isRegistering: false,
                                isNewUser: true,
                                isLogging: false,
                                isSocialLogging: false,
                                alert: {
                                    status: true,
                                    error: true,
                                    message: "Houve um erro ao cadastrar usuário no database, cheque o console",
                                    color: "danger"
                                }
                            })
                        })
                })
                .catch(err => {
                    switch (err.code) {
                        case "auth/email-already-in-use":
                            err.message = 'Este e-mail já está sendo usado por uma outra conta.'
                            break
                        case "auth/weak-password":
                            err.message = 'Sua senha deverá ser maior que 6 caracteres.'
                            break
                        default:
                            err.message = 'Houve um erro não tratado'
                    }
                    let errorMsg = err.message
                    self.setState({
                        isRegistering: false,
                        isNewUser: true,
                        isLogging: false,
                        isSocialLogging: false,
                        alert: {
                            status: true,
                            error: true,
                            message: errorMsg,
                            color: "danger"
                        }
                    })
                })
        } else {
            this.setState({
                isNewUser: true
            })
        }
    }

    login = (e) => {
        e.preventDefault()
        let self = this
        const { userLogged } = this.props
        const { input } = this.state
        this.setState({
            alert: {
                status: false,
                error: false,
                message: "",
                color: ""
            },
            isNewUser: false,
            isLogging: true,
            isSocialLogging: false,
            isRegistering: false
        })

        try {
            auth().signInWithEmailAndPassword(input.email, input.password)
                .then(async result => {
                    const token = await auth().currentUser.getIdToken(true)
                    const displayName = result.user.displayName
                    const email = result.user.email
                    localStorage.setItem('token', token)
                    localStorage.setItem('displayName', displayName)
                    localStorage.setItem('email', email)
                    userLogged({ token, displayName, email })
                })
                .catch(err => {
                    switch (err.code) {
                        case "auth/wrong-password":
                            err.message = 'A senha é inválida ou usuário não possui senha e a conta é vinculada ao Google'
                            break
                        case "auth/user-not-found":
                            err.message = 'Usuário inválido.'
                            break
                        default:
                            err.message = 'Houve um erro não tratado'
                    }
                    let errorMsg = err.message
                    this.setState({
                        alert: {
                            status: true,
                            error: true,
                            message: `${errorMsg}`,
                            color: 'danger'
                        },
                        user: null,
                        isLogging: false,
                        isNewUser: false,
                        isSocialLogging: false,
                        isRegistering: false
                    })
                })
        } catch (e) {
            this.setState({
                alert: {
                    status: true,
                    error: true,
                    message: `Houve um erro ao tentar logar ${e}`,
                    color: 'danger'
                },
                user: null,
                isLogging: false,
                isNewUser: false,
                isSocialLogging: false,
                isRegistering: false
            })
        }
    }

    socialLogin = async () => {
        let self = this
        const { userLogged } = this.props
        this.setState({
            alert: {
                status: false,
                error: false,
                message: "",
                color: ""
            },
            isNewUser: false,
            isLogging: false,
            isSocialLogging: true,
            isRegistering: false
        })
        try {
            provider.setCustomParameters({ prompt: 'select_account' })
            auth().signInWithPopup(provider).then(async (result) => {
                const token = await auth().currentUser.getIdToken(true)
                const displayName = result.additionalUserInfo.profile.name
                const email = result.additionalUserInfo.profile.email

                if (result.additionalUserInfo.isNewUser) {
                    const { input } = this.state
                    createUser({
                        full_name: displayName,
                        zipcode: input.zipcode,
                        street: input.street,
                        street_number: input.street_number,
                        complement: input.complement,
                        neighborhood: input.neighborhood,
                        city: input.city,
                        state: input.state,
                        email: email,
                        country: input.country,
                        phone: input.phone,
                        birth: input.bith,
                        type_document: input.typeDocument,
                        document: (input.typeDocument === 'cpf' ? input.cpf : input.cnpj),
                        sex: input.sex,
                        company_name: input.companyName,
                        state_registration: input.stateRegistration,
                        authorize: true
                    })
                        .then(response => {
                            if (response.status === 200 && !response.data.status.error) {
                                localStorage.setItem('token', token)
                                localStorage.setItem('displayName', displayName)
                                localStorage.setItem('email', email)
                                self.setState({
                                    alert: {
                                        status: true,
                                        error: false,
                                        message: 'Logando',
                                        color: 'success'
                                    },
                                    isLogging: false,
                                    isNewUser: false,
                                    isSocialLogging: false,
                                    isRegistering: false
                                })
                                userLogged({ token, displayName, email })
                            } else {
                                self.setState({
                                    isRegistering: false,
                                    isNewUser: true,
                                    isLogging: false,
                                    isSocialLogging: false,
                                    alert: {
                                        status: true,
                                        error: true,
                                        message: "Houve um erro ao cadastrar usuário no database, cheque o console",
                                        color: "danger"
                                    }
                                })
                            }
                        })
                        .catch(err => {
                            self.setState({
                                isRegistering: false,
                                isNewUser: true,
                                isLogging: false,
                                isSocialLogging: false,
                                alert: {
                                    status: true,
                                    error: true,
                                    message: "Houve um erro ao cadastrar usuário no database, cheque o console",
                                    color: "danger"
                                }
                            })
                        })
                } else {
                    localStorage.setItem('token', token)
                    localStorage.setItem('displayName', displayName)
                    localStorage.setItem('email', email)
                    self.setState({
                        alert: {
                            status: true,
                            error: false,
                            message: 'Logando',
                            color: 'success'
                        },
                        isLogging: false,
                        isNewUser: false,
                        isSocialLogging: false,
                        isRegistering: false
                    })
                    userLogged({ token, displayName, email })
                }
            })
                .catch(err => {
                    switch (err.code) {
                        case "auth/popup-closed-by-user":
                            err.message = 'A caixa de login foi fechada pelo usuário antes de completar a operação'
                            break
                        default:
                            err.message = 'Houve um erro não tratado'
                    }
                    let errorMsg = err.message
                    this.setState({
                        alert: {
                            status: true,
                            error: true,
                            message: `${errorMsg}`,
                            color: 'danger'
                        },
                        user: null,
                        isLogging: false,
                        isNewUser: false,
                        isSocialLogging: false,
                        isRegistering: false
                    })
                })
        } catch (e) {
            this.setState({
                alert: {
                    status: true,
                    error: true,
                    message: `Houve um erro ao tentar logar ${e}`,
                    color: 'danger'
                },
                user: null,
                isLogging: false,
                isNewUser: false,
                isSocialLogging: false,
                isRegistering: false
            })
        }
    }

    onChange = (e) => {
        this.setState({
            input: {
                ...this.state.input,
                [e.target.name]: e.target.value
            }
        })
    }

    getZipcode = e => {
        const { zipcode } = this.state.input
        let self = this

        if (zipcode === "_____-___") {
            return
        } else {
            getAddress(zipcode)
                .then(response => {
                    self.setState({
                        input: {
                            ...self.state.input,
                            street: response.data.address.street,
                            neighborhood: response.data.address.neighborhood,
                            city: response.data.address.city,
                            state: response.data.address.state,
                            country: response.data.address.country
                        }
                    })
                })
                .catch(err => {
                    return
                })
        }
    }

    handleForgotPass = () => {
        this.setState({
            alert: {
                status: false,
                error: false,
                message: "",
                color: ""
            },
            isNewUser: false,
            isLogging: false,
            isSocialLogging: false,
            isRegistering: false
        })

        const self = this
        const { input } = this.state

        if (input.email === "") {
            this.setState({
                alert: {
                    status: true,
                    error: true,
                    message: "Defina um endereço de e-mail para recuperar a senha",
                    color: "warning"
                },
                isNewUser: false,
                isLogging: false,
                isSocialLogging: false,
                isRegistering: false
            })
        } else {
            auth().sendPasswordResetEmail(input.email).then(function () {
                self.setState({
                    alert: {
                        status: true,
                        error: false,
                        message: "E-mail de recuperação enviado, verifique sua caixa de e-mail",
                        color: "success"
                    },
                    isNewUser: false,
                    isLogging: false,
                    isSocialLogging: false,
                    isRegistering: false
                })
            }).catch(function (error) {
                console.log(error)
                // An error happened.
                self.setState({
                    alert: {
                        status: true,
                        error: true,
                        message: "Houve um erro ao enviar recuperação de senha",
                        color: "danger"
                    },
                    isNewUser: false,
                    isLogging: false,
                    isSocialLogging: false,
                    isRegistering: false
                })
            })
        }

    }

    render() {
        const { alert, input, isNewUser, isLogging, isSocialLogging, isRegistering, provider } = this.state

        return (
            <>
                {
                    alert.status &&
                    <Row>
                        <Col xs="12" className="text-center mt-5 mb-3">
                            <Alert color={alert.color}>{alert.message}</Alert>
                        </Col>
                    </Row>
                }
                <Row>
                    <Col xs="12">
                        <h2>Identificação</h2>
                        <small>Faça o seu login ou crie uma conta caso ainda não possua cadastro</small>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col xs="12" md="6">
                        <div className="d-flex border-bottom mt-3">
                            <i className="fas fa-user m-2" />
                            <h5>Já sou cadastrado</h5>
                        </div>
                    </Col>
                    <Col xs="12" md="6">
                        <div className="d-flex border-bottom mt-3">
                            <i className="fas fa-edit m-2" />
                            <h5>Ainda não possuo cadastro</h5>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" md="6" className="mt-5 mb-5">
                        <Form onSubmit={this.login}>
                            <FormGroup>
                                <Input
                                    autoComplete="off"
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="form-control"
                                    placeholder="Digite o seu e-mail"
                                    value={input.email}
                                    required
                                    onChange={this.onChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Input
                                    autoComplete="off"
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="form-control"
                                    placeholder="Digite a sua senha"
                                    value={input.password}
                                    required
                                    onChange={this.onChange}
                                />
                            </FormGroup>
                            <FormGroup className="mt-1 mb-1 text-right forgotPassword">
                                <small onClick={() => this.handleForgotPass()}><strong>Esqueci minha senha</strong></small>
                            </FormGroup>
                            {
                                isLogging &&
                                <div className="text-center m-2">
                                    <Loading />
                                </div>
                            }
                            {
                                !isLogging &&
                                <div className="text-center m-2">
                                    <Button block color="primary">Prosseguir</Button>
                                </div>
                            }
                        </Form>
                        <div className="text-center mt-4 mb-4">
                            {
                                isSocialLogging &&
                                <Loading />
                            }
                            {
                                !isSocialLogging &&
                                <img width="250px" src={btn_google} alt="Login com Google" className="img-fluid btn-google" onClick={this.socialLogin} />
                            }
                        </div>
                    </Col>
                    <Col sm="12" md="6" className="text-center mt-5 mb-5">
                        <Form onSubmit={this.register}>
                            <FormGroup className="d-flex align-items-center">
                                <Input
                                    autoComplete="off"
                                    type="email"
                                    name="newEmail"
                                    id="newEmail"
                                    className="form-control"
                                    placeholder="Digite o seu e-mail"
                                    value={input.newEmail}
                                    disabled={isRegistering}
                                    required
                                    onChange={this.onChange}
                                />
                                {
                                    !isNewUser &&
                                    <Button className="m-2" color="primary">Cadastrar</Button>
                                }
                            </FormGroup>
                            {
                                isNewUser &&
                                <>
                                    <div className="bg-light border m-2 p-2">
                                        <FormGroup className="mt-3 mb-3">
                                            <Input
                                                autoComplete="off"
                                                type="email"
                                                name="confirmEmail"
                                                id="confirmEmail"
                                                className="form-control"
                                                placeholder="Confirme o seu e-mail"
                                                value={input.confirmEmail}
                                                disabled={isRegistering}
                                                required
                                                onChange={this.onChange}
                                            />
                                        </FormGroup>
                                        {
                                            provider === 'password' &&
                                            <>
                                                <FormGroup className="mt-3 mb-3">
                                                    <Input
                                                        autoComplete="off"
                                                        type="password"
                                                        name="newPassword"
                                                        id="newPassword"
                                                        className="form-control"
                                                        placeholder="Digite a sua senha"
                                                        value={input.newPassword}
                                                        disabled={isRegistering}
                                                        required
                                                        onChange={this.onChange}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="mt-3 mb-3">
                                                    <Input
                                                        autoComplete="off"
                                                        type="password"
                                                        name="confirmPassword"
                                                        id="confirmPassword"
                                                        className="form-control"
                                                        placeholder="Confirme a sua senha"
                                                        value={input.confirmPassword}
                                                        disabled={isRegistering}
                                                        required
                                                        onChange={this.onChange}
                                                    />
                                                </FormGroup>
                                            </>
                                        }
                                    </div>
                                    <div className="bg-light border m-2 p-2">
                                        <FormGroup className="mt-3 mb-3">
                                            <InputMask
                                                mask="99999-999"
                                                autoComplete="off"
                                                type="text"
                                                name="zipcode"
                                                id="zipcode"
                                                className="form-control"
                                                placeholder="Digite seu CEP"
                                                value={input.zipcode}
                                                disabled={isRegistering}
                                                required
                                                onBlur={this.getZipcode}
                                                onChange={this.onChange}
                                            />
                                        </FormGroup>
                                        <FormGroup className="mt-3 mb-3">
                                            <Input
                                                autoComplete="off"
                                                type="text"
                                                name="street"
                                                id="street"
                                                className="form-control"
                                                placeholder="Digite o nome da rua"
                                                value={input.street}
                                                disabled={isRegistering}
                                                required
                                                onChange={this.onChange}
                                            />
                                        </FormGroup>
                                        <FormGroup className="mt-3 mb-3">
                                            <Input
                                                autoComplete="off"
                                                type="text"
                                                name="number"
                                                id="number"
                                                className="form-control"
                                                placeholder="Digite o número da residência"
                                                value={input.number}
                                                disabled={isRegistering}
                                                required
                                                onChange={this.onChange}
                                            />
                                        </FormGroup>
                                        <FormGroup className="mt-3 mb-3">
                                            <Input
                                                autoComplete="off"
                                                type="text"
                                                name="complement"
                                                id="complement"
                                                className="form-control"
                                                placeholder="Digite caso haja algum complemento"
                                                value={input.complement}
                                                disabled={isRegistering}
                                                onChange={this.onChange}
                                            />
                                        </FormGroup>
                                        <FormGroup className="mt-3 mb-3">
                                            <Input
                                                autoComplete="off"
                                                type="text"
                                                name="neighborhood"
                                                id="neighborhood"
                                                className="form-control"
                                                placeholder="Digite o nome do bairro"
                                                value={input.neighborhood}
                                                disabled={isRegistering}
                                                required
                                                onChange={this.onChange}
                                            />
                                        </FormGroup>
                                        <FormGroup className="mt-3 mb-3">
                                            <Input
                                                autoComplete="off"
                                                type="text"
                                                name="city"
                                                id="city"
                                                className="form-control"
                                                placeholder="Digite o nome da cidade"
                                                value={input.city}
                                                disabled={isRegistering}
                                                required
                                                onChange={this.onChange}
                                            />
                                        </FormGroup>
                                        <FormGroup className="mt-3 mb-3">
                                            <Input
                                                autoComplete="off"
                                                type="text"
                                                name="state"
                                                id="state"
                                                className="form-control"
                                                placeholder="Qual é o seu estado?"
                                                value={input.state}
                                                disabled={isRegistering}
                                                required
                                                onChange={this.onChange}
                                            />
                                        </FormGroup>
                                    </div>

                                    <div className="bg-light border m-2 p-2">
                                        <FormGroup className="mt-3 mb-3">
                                            <Input
                                                autoComplete="off"
                                                type="text"
                                                name="fullName"
                                                id="fullName"
                                                className="form-control"
                                                placeholder="Nome completo"
                                                value={input.fullName}
                                                disabled={isRegistering}
                                                required
                                                onChange={this.onChange}
                                            />
                                        </FormGroup>
                                        <div className="d-flex mt-2 mb-2 p-3 pt-3 pl-5">
                                            <div className="flex-shrink-1">
                                                <input
                                                    type="radio"
                                                    name="typeDocument"
                                                    value="cpf"
                                                    disabled={isRegistering}
                                                    checked={input.typeDocument === 'cpf'}
                                                    onChange={this.handleDocumentChange}
                                                    className="form-check-input"
                                                />
                                            </div>
                                            <div className="flex-shrink-1">
                                                <i className="fas fa-user ml-2 mr-2"></i>
                                            </div>
                                            <div>
                                                Pessoa Física
                                            </div>
                                        </div>
                                        <div className="d-flex mt-2 mb-2 p-3 pt-3 pl-5">
                                            <div className="flex-shrink-1">
                                                <input
                                                    type="radio"
                                                    name="typeDocument"
                                                    value="cnpj"
                                                    disabled={isRegistering}
                                                    checked={input.typeDocument === 'cnpj'}
                                                    onChange={this.handleDocumentChange}
                                                    className="form-check-input"
                                                />
                                            </div>
                                            <div className="flex-shrink-1">
                                                <i className="fas fa-building ml-2 mr-2"></i>
                                            </div>
                                            <div>
                                                Pessoa Jurídica
                                            </div>
                                        </div>
                                        {
                                            input.typeDocument === 'cpf' &&
                                            <FormGroup className="mt-3 mb-3">
                                                <InputMask
                                                    mask="999.999.999-99"
                                                    autoComplete="off"
                                                    type="text"
                                                    name="cpf"
                                                    id="cpf"
                                                    className="form-control"
                                                    placeholder="Digite seu CPF"
                                                    value={input.cpf}
                                                    disabled={isRegistering}
                                                    required
                                                    onChange={this.onChange}
                                                />
                                            </FormGroup>
                                        }
                                        {
                                            input.typeDocument === 'cnpj' &&
                                            <FormGroup className="mt-3 mb-3">
                                                <InputMask
                                                    mask="99.999.999/9999-99"
                                                    autoComplete="off"
                                                    type="text"
                                                    name="cnpj"
                                                    id="cnpj"
                                                    className="form-control"
                                                    placeholder="Digite seu CNPJ"
                                                    value={input.cnpj}
                                                    disabled={isRegistering}
                                                    required
                                                    onChange={this.onChange}
                                                />
                                            </FormGroup>
                                        }
                                        <FormGroup className="mt-3 mb-3">
                                            <InputMask
                                                mask="+99 (99) 99999-9999"
                                                autoComplete="off"
                                                type="text"
                                                name="phone"
                                                id="phone"
                                                className="form-control"
                                                placeholder="Digite seu Celular"
                                                value={input.phone}
                                                disabled={isRegistering}
                                                required
                                                onChange={this.onChange}
                                            />
                                        </FormGroup>
                                        {
                                            input.typeDocument === 'cpf' &&
                                            <>
                                                <FormGroup className="mt-3 mb-3">
                                                    <select disabled={isRegistering} className="form-control" value={input.sex} onChange={this.handleSexChange}>
                                                        <option value="masculino">Masculino</option>
                                                        <option value="feminino">Feminino</option>
                                                        <option value="null">Prefiro não dizer</option>
                                                    </select>
                                                </FormGroup>
                                                <FormGroup className="mt-3 mb-3">
                                                    <Input
                                                        autoComplete="off"
                                                        type="date"
                                                        name="birth"
                                                        id="birth"
                                                        className="form-control"
                                                        placeholder="Data de aniversário"
                                                        value={input.birth}
                                                        disabled={isRegistering}
                                                        required
                                                        onChange={this.onChange}
                                                    />
                                                </FormGroup>
                                            </>
                                        }
                                        {
                                            input.typeDocument === 'cnpj' &&
                                            <>
                                                <FormGroup className="mt-3 mb-3">
                                                    <Input
                                                        autoComplete="off"
                                                        type="text"
                                                        name="companyName"
                                                        id="companyName"
                                                        className="form-control"
                                                        placeholder="Nome da empresa"
                                                        value={input.companyName}
                                                        disabled={isRegistering}
                                                        required
                                                        onChange={this.onChange}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="mt-3 mb-3">
                                                    <Input
                                                        autoComplete="off"
                                                        type="text"
                                                        name="stateRegistration"
                                                        id="stateRegistration"
                                                        className="form-control"
                                                        placeholder="Inscrição Estadual"
                                                        value={input.stateRegistration}
                                                        disabled={isRegistering}
                                                        required
                                                        onChange={this.onChange}
                                                    />
                                                </FormGroup>
                                            </>
                                        }
                                        {
                                            (input.newEmail !== input.confirmEmail || input.newPassword !== input.confirmPassword) &&
                                            <Alert color="info">E-mail de confirmação ou senha estão diferentes.</Alert>
                                        }
                                        {
                                            (input.newEmail === input.confirmEmail && input.newPassword === input.confirmPassword) &&
                                            <>
                                                {
                                                    isRegistering &&
                                                    <Loading />
                                                }
                                                {
                                                    !isRegistering &&
                                                    <Button className="m-2" color="primary">Cadastrar</Button>
                                                }
                                            </>
                                        }
                                    </div>
                                </>

                            }
                        </Form>
                    </Col>
                </Row>
            </>
        )
    }
}

export default LoginComponent