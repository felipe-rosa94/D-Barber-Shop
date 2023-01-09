import React from 'react'
import '../styles/style.css'
import {
    AppBar,
    Box,
    CardMedia,
    CircularProgress,
    createTheme,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormLabel,
    ThemeProvider,
    Toolbar,
    Typography
} from '@mui/material'
import logo from '../images/logo.jpeg'
import firebase from '../firebase'
import {ArrowBack} from '@mui/icons-material'
import moment from 'moment'

let dashbord = 0

const theme = createTheme({
    palette: {
        primary: {
            main: '#191919'
        },
        secondary: {
            main: '#f89e00'
        },
        inherit: {
            main: '#ffffff'
        }
    }
})

class Home extends React.Component {

    state = {
        dialogMeusHorario: false,
        servicos: [],
        historico: []
    }

    onClickDashbord = () => {
        if (dashbord >= 2) {
            this.props.history.push('/dashbord')
            dashbord = 0
        }
        dashbord++
    }

    servicos = () => {
        let servicos = sessionStorage.getItem('dbarbershop-servico')
        this.setState({servicos: (servicos !== null) ? JSON.parse(servicos) : []})
    }

    buscaServicos = () => {
        firebase
            .database()
            .ref('servicos')
            .once('value')
            .then(callback => {
                if (callback.val() !== null) {
                    const servicos = callback.val().sort((a, b) => {
                        if (a.servico > b.servico) return 1
                        if (a.servico < b.servico) return -1
                        return 0
                    })
                    this.setState({servicos: servicos})
                    sessionStorage.setItem('dbarbershop-servico', JSON.stringify(servicos))
                }
            })
    }

    meusHorarios = () => {
        let historico = localStorage.getItem('dbarbershop-historico')
        historico = (historico !== null) ? JSON.parse(historico) : []
        this.setState({historico: historico})
    }

    dataAlteracao = () => {
        return moment().format('DD/MM/YYYY')
    }

    componentDidMount() {
        this.meusHorarios()
    }

    render() {
        const {dialogMeusHorario, servicos, historico} = this.state
        return (
            <div id={'home'}>
                {((parseInt(process.env.REACT_APP_VERSION_CODE) % 2 === 0)) && <div id={'div-update'}/>}
                <ThemeProvider theme={theme}>
                    <div>
                        <AppBar position="static" color={'primary'}>
                            <Toolbar>
                                <Typography variant="h6" component="div" color={'secondary'}>
                                    D'Barber Shop
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <div>
                            <div class={'div-container'}>
                                <FormLabel class={'label-titulo-container'}>
                                    Horário de atendimento
                                </FormLabel>
                                <FormLabel class={'label-descricao-horario'}>
                                    Seg a Sáb
                                </FormLabel>
                                <FormLabel class={'label-descricao-horario'}>
                                    09:00 ás 12:00 e das 14:00 ás 21:00
                                </FormLabel>
                            </div>
                            <div className={'div-container'}>
                                <CardMedia id={'card-media-logo'} image={logo}/>
                            </div>
                            <div className={'div-container'}>
                                <div id={'div-botao'} onClick={() => this.props.history.push('/agendar')}>
                                    <FormLabel id={'label-botao'}>Marcar Horário</FormLabel>
                                </div>
                            </div>
                            <div className={'div-container'}>
                                <div id={'div-botao'} onClick={() => this.setState({dialogMeusHorario: true})}>
                                    <FormLabel id={'label-botao'}>Meus Horários</FormLabel>
                                </div>
                            </div>
                            <div className={'div-container'}>
                                <div id={'div-botao'} onClick={() => this.props.history.push('/fidelidade')}>
                                    <FormLabel id={'label-botao'}>Fidelidade</FormLabel>
                                </div>
                            </div>
                            <Box p={1}/>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <FormLabel id={'label-versao'}
                                           onClick={this.onClickDashbord}>{`Versão: ${process.env.REACT_APP_VERSAO}`}</FormLabel>
                            </div>
                            <div id={this.dataAlteracao()}/>
                        </div>
                    </div>
                    <Dialog open={dialogMeusHorario} fullScreen={true}>
                        <div id={'div-dialog-full-screen'}>
                            <div id={'div-voltar'}>
                                <ArrowBack onClick={() => this.setState({dialogMeusHorario: false})}/>
                                <FormLabel id={'label-voltar'}>Voltar</FormLabel>
                            </div>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}}
                                         color={'secondary'}>Meus Horário</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}} color={'white'}>
                                    Horários agendados
                                </DialogContentText>
                                {
                                    historico.map((h, index) => (
                                        <div id={'div-servico'} key={index}>
                                            <FormLabel id={'label-servico'}>
                                                {`Serviço: ${h.servico}`}
                                            </FormLabel>
                                            <FormLabel id={'label-valor'}>
                                                {`Hora do atendimento: ${h.hora}`}
                                            </FormLabel>
                                            <FormLabel id={'label-valor'}>
                                                {`Dia da semana: ${h.dia}`}
                                            </FormLabel>
                                            {
                                                (!!h.barbeiro) &&
                                                <FormLabel id={'label-valor'}>
                                                    {`Barbeiro: ${h.barbeiro.nome}`}
                                                </FormLabel>
                                            }
                                            {
                                                (!!h.agendamento) &&
                                                <FormLabel id={'label-valor'}>
                                                    {`Agendamento: ${h.agendamento}`}
                                                </FormLabel>
                                            }
                                        </div>
                                    ))
                                }
                            </DialogContent>
                        </div>
                    </Dialog>
                </ThemeProvider>
            </div>
        )
    }
}

export default Home
