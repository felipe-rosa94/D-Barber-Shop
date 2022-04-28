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
import logo from '../images/logo.png'
import firebase from '../firebase'
import {ArrowBack} from '@mui/icons-material'

const versao = '1.3'
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
        dialogLogo: true,
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

    logo = () => {
        if (this.props.location.marcado === 'ok')
            this.setState({dialogLogo: false})
        else
            setTimeout(() => this.setState({dialogLogo: false}), 1200)
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
                    this.setState({servicos: callback.val()})
                    sessionStorage.setItem('dbarbershop-servico', JSON.stringify(callback.val()))
                }
            })
    }

    buscaDias = () => {
        firebase
            .database()
            .ref('dias')
            .once('value')
            .then(callback => {
                if (callback.val() !== null)
                    sessionStorage.setItem('dbarbershop-dias', JSON.stringify(callback.val()))
            })
    }

    meusHorarios = () => {
        let historico = localStorage.getItem('dbarbershop-historico')
        historico = (historico !== null) ? JSON.parse(historico) : []
        this.setState({historico: historico})
    }

    componentDidMount() {
        this.logo()
        this.servicos()
        this.buscaServicos()
        this.buscaDias()
        this.meusHorarios()
    }

    render() {
        const {dialogLogo, dialogMeusHorario, servicos, historico} = this.state
        return (
            <div id={'home'}>
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
                                <FormLabel class={'label-titulo-container'}>Horário de atendimento</FormLabel>
                                <FormLabel class={'label-descricao-horario'}>Seg a Sáb</FormLabel>
                                <FormLabel class={'label-descricao-horario'}>
                                    09:00 ás 12:00 e das 14:00 ás 21:00
                                </FormLabel>
                            </div>
                            <div class={'div-container'}>
                                <FormLabel class={'label-titulo-container'}>Serviços</FormLabel>
                                {
                                    servicos.map(s => (
                                        <div id={'div-servico'} key={s.servico}>
                                            <FormLabel id={'label-servico'}>{s.servico}</FormLabel>
                                            <FormLabel id={'label-valor'}>{s.valor.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })}</FormLabel>
                                        </div>
                                    ))
                                }
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
                            <Box p={1}/>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <FormLabel id={'label-versao'}
                                           onClick={this.onClickDashbord}>{`Versão: ${versao}`}</FormLabel>
                            </div>
                        </div>
                    </div>
                    <Dialog open={dialogLogo} fullScreen={true}>
                        <div id={'div-dialog-logo'}>
                            <CardMedia id={'card-media-logo'} image={logo}/>
                            <Box p={2}/>
                            <CircularProgress color={'secondary'} size={50}/>
                        </div>
                    </Dialog>
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
                                            <FormLabel id={'label-servico'}>{h.servico}</FormLabel>
                                            <FormLabel id={'label-valor'}>{h.hora}</FormLabel>
                                            <FormLabel id={'label-valor'}>{h.dia}</FormLabel>
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
