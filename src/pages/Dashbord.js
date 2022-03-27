import React from 'react'
import '../styles/style.css'
import {
    AppBar,
    Box,
    Button,
    createTheme,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Switch,
    TextField,
    ThemeProvider, Toolbar, Typography
} from '@mui/material'
import firebase from '../firebase'
import {Add, ArrowBack, Delete, Edit} from '@mui/icons-material'
import {withStyles} from '@mui/styles'
import {liberarTodos} from '../util'

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

const CheckButton = withStyles({
    checked: {},
})(props => <Radio color="secondary" {...props} />)

class Dashbord extends React.Component {

    state = {
        dialogLogin: true,
        dialogAgenda: false,
        dialogDias: false,
        dialogServico: false,
        dialogCadastrarServico: false,
        dialogHorariosLiberados: false,
        usuario: '',
        senha: '',
        servicos: [],
        servico: {
            servico: '',
            valor: '',
            qtdHorarios: 1,
        },
        dias: [],
        agenda: []
    }

    handleInput = e => this.setState({[e.target.name]: e.target.value})

    handleInputServico = e => {
        const {servico} = this.state
        if (e.target.name === 'valor') {
            servico.valor = parseInt(e.target.value)
            this.setState({servico: servico})
        } else {
            servico.servico = e.target.value
            this.setState({servico: servico})
        }
    }

    onClickLiberarTodos = () => {
        firebase
            .database()
            .ref('dias/')
            .set(liberarTodos)
            .then(() => {
                this.setState({dialogHorariosLiberados: true})
                this.buscaDias()
            })
            .catch(e => console.error(e))
    }

    gravarDias = dias => {
        firebase
            .database()
            .ref('dias/')
            .update(dias)
            .then(() => console.log)
            .catch(e => console.error(e))
    }

    onClickGravar = () => {
        const {servico, servicos} = this.state
        if (servico.id === undefined) {
            servico.id = servicos.length.toString()
            firebase
                .database()
                .ref('servicos/' + servico.id)
                .set(servico)
                .then(() => {
                    this.setState({
                        dialogCadastrarServico: false,
                        servico: {
                            servico: '',
                            valor: '',
                            qtdHorarios: 1,
                        }
                    })
                    this.buscaServicos()
                })
                .catch(e => console.error(e))
        } else {
            firebase
                .database()
                .ref('servicos/' + servico.id)
                .update(servico)
                .then(() => {
                    this.setState({
                        dialogCadastrarServico: false,
                        servico: {
                            servico: '',
                            valor: '',
                            qtdHorarios: 1,
                        }
                    })
                    this.buscaServicos()
                })
                .catch(e => console.error(e))
        }
    }

    onClickDeletar = id => {
        firebase
            .database()
            .ref('servicos/' + id)
            .remove()
            .then(() => this.buscaServicos())
            .catch(e => console.error(e))
    }

    onClickLogin = () => {
        const {usuario, senha} = this.state
        firebase
            .auth()
            .signInWithEmailAndPassword(usuario, senha)
            .then((data) => {
                localStorage.setItem('dbarbershop-login', 'ok')
                this.setState({dialogLogin: false})
            })
            .catch((e) => console.log(e))
    }

    login = () => {
        let login = localStorage.getItem('dbarbershop-login')
        this.setState({dialogLogin: (login !== 'ok')})
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
                if (callback.val() !== null) {
                    this.setState({dias: callback.val()})
                    sessionStorage.setItem('dbarbershop-dias', JSON.stringify(callback.val()))
                }
            })
    }

    buscaAgenda = () => {
        firebase
            .database()
            .ref('agenda')
            .once('value')
            .then(callback => {
                if (callback.val() !== null) {
                    this.setState({agenda: Object.values(callback.val()[new Date().getDay()].horarios)})
                    sessionStorage.setItem('dbarbershop-agenda', JSON.stringify(callback.val()))
                }
            })
    }

    componentDidMount() {
        this.login()
        this.buscaDias()
        this.buscaServicos()
        this.buscaAgenda()
    }

    render() {
        const {
            dialogLogin,
            dialogAgenda,
            dialogServico,
            dialogCadastrarServico,
            dialogHorariosLiberados,
            dialogDias,
            servicos,
            servico,
            dias,
            agenda
        } = this.state
        return (
            <div>
                <ThemeProvider theme={theme}>
                    <AppBar position="static" color={'primary'}>
                        <Toolbar>
                            <Typography variant="h6" component="div" color={'secondary'}>
                                Dashbord
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <div className={'div-container'}>
                        <div id={'div-botao'} onClick={() => this.setState({dialogAgenda: true})}>
                            <FormLabel id={'label-botao'}>Agenda do dia</FormLabel>
                        </div>
                    </div>
                    <div className={'div-container'}>
                        <div id={'div-botao'} onClick={() => this.setState({dialogServico: true})}>
                            <FormLabel id={'label-botao'}>Serviços</FormLabel>
                        </div>
                    </div>
                    <div className={'div-container'}>
                        <div id={'div-botao'} onClick={() => this.setState({dialogDias: true})}>
                            <FormLabel id={'label-botao'}>Horários</FormLabel>
                        </div>
                    </div>
                    <div className={'div-container'}>
                        <div id={'div-botao'} onClick={this.onClickLiberarTodos}>
                            <FormLabel id={'label-botao'}>Liberar todos os horários</FormLabel>
                        </div>
                    </div>
                    <Dialog open={dialogLogin} fullScreen={true}>
                        <div id={'div-dialog-full-screen'}>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}} color={'secondary'}>
                                Login
                            </DialogTitle>
                            <DialogContent>
                                <Box p={1}/>
                                <TextField
                                    id={'input'}
                                    name={'usuario'}
                                    color={'secondary'}
                                    variant={'outlined'}
                                    label={'Usuário'}
                                    placeholder={'Usuário'}
                                    focused={true}
                                    autoFocus={true}
                                    fullWidth={true}
                                    onChange={this.handleInput}
                                />
                                <Box p={1}/>
                                <TextField
                                    id={'input'}
                                    name={'senha'}
                                    color={'secondary'}
                                    variant={'outlined'}
                                    label={'Senha'}
                                    placeholder={'Senha'}
                                    type={'password'}
                                    focused={true}
                                    fullWidth={true}
                                    onChange={this.handleInput}
                                />
                                <Box p={1}/>
                                <Button variant={'outlined'} color={'secondary'} fullWidth={true}
                                        onClick={this.onClickLogin}>
                                    Entrar
                                </Button>
                            </DialogContent>
                        </div>
                    </Dialog>
                    <Dialog open={dialogAgenda} fullScreen={true}>
                        <div id={'div-dialog-full-screen'}>
                            <div id={'div-voltar'}>
                                <ArrowBack onClick={() => this.setState({dialogAgenda: false})}/>
                                <FormLabel id={'label-voltar'}>Voltar</FormLabel>
                            </div>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}} color={'secondary'}>
                                Agenda
                            </DialogTitle>
                            <DialogContent>
                                {
                                    agenda.map(a => (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                marginTop: 10
                                            }}
                                            key={a.nome}>
                                            <FormLabel id={'label-servico'}>{a.nome}</FormLabel>
                                            <FormLabel id={'label-valor'}>{a.telefone}</FormLabel>
                                            <FormLabel id={'label-valor'}>{a.servico}</FormLabel>
                                            <FormLabel id={'label-valor'}>{a.hora}</FormLabel>
                                            <FormLabel id={'label-valor'}>{a.data}</FormLabel>
                                        </div>
                                    ))
                                }
                            </DialogContent>
                        </div>
                    </Dialog>
                    <Dialog open={dialogServico} fullScreen={true}>
                        <div id={'div-dialog-full-screen'}>
                            <div id={'div-voltar'}>
                                <ArrowBack onClick={() => this.setState({dialogServico: false})}/>
                                <FormLabel id={'label-voltar'}>Voltar</FormLabel>
                            </div>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}} color={'secondary'}>
                                Serviços
                            </DialogTitle>
                            <DialogContent>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row'
                                    }}>
                                    <DialogContentText style={{
                                        fontFamily: 'Nunito',
                                        fontSize: 'medium'
                                    }} color={'white'}>
                                        Serviços cadastrados
                                    </DialogContentText>
                                    <Fab color="secondary"
                                         onClick={() => this.setState({dialogCadastrarServico: true})}>
                                        <Add/>
                                    </Fab>
                                </div>
                                {
                                    servicos.map(s => (
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                flexDirection: 'row',
                                                marginTop: 10,
                                            }}
                                            key={s.servico}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    marginTop: 10
                                                }}>
                                                <FormLabel id={'label-servico'}>{s.servico}</FormLabel>
                                                <FormLabel id={'label-valor'}>{s.valor.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                })}
                                                </FormLabel>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexDirection: 'row',
                                                    marginTop: 10
                                                }}>
                                                <Edit onClick={() => this.setState({
                                                    servico: s,
                                                    dialogCadastrarServico: true
                                                })}/>
                                                <Box p={1}/>
                                                <Delete onClick={() => this.onClickDeletar(s.id)}/>
                                            </div>
                                        </div>
                                    ))
                                }
                            </DialogContent>
                        </div>
                    </Dialog>
                    <Dialog open={dialogCadastrarServico}
                            onClose={() => this.setState({dialogCadastrarServico: false})}>
                        <div id={'div-dialog'}>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}} color={'secondary'}>
                                Serviço
                            </DialogTitle>
                            <DialogContent>
                                <Box p={1}/>
                                <TextField
                                    value={servico.servico}
                                    name={'servico'}
                                    id={'input'}
                                    color={'secondary'}
                                    variant={'outlined'}
                                    label={'Servico'}
                                    placeholder={'Servico'}
                                    focused={true}
                                    autoFocus={true}
                                    fullWidth={true}
                                    onChange={this.handleInputServico}/>
                                <Box p={1}/>
                                <TextField
                                    value={servico.valor}
                                    name={'valor'}
                                    id={'input'}
                                    type={'number'}
                                    color={'secondary'}
                                    variant={'outlined'}
                                    label={'Valor'}
                                    placeholder={'Valor'}
                                    focused={true}
                                    fullWidth={true}
                                    onChange={this.handleInputServico}/>
                                <Box p={1}/>
                                <RadioGroup>
                                    <FormControlLabel
                                        checked={(servico.qtdHorarios === 1)}
                                        style={{color: '#f89e00'}}
                                        control={<CheckButton/>}
                                        label={'Um horário'}
                                        onChange={() => {
                                            servico.qtdHorarios = 1
                                            this.setState({servico: servico})
                                        }}
                                    />
                                    <FormControlLabel
                                        checked={(servico.qtdHorarios === 2)}
                                        style={{color: '#f89e00'}}
                                        control={<CheckButton/>}
                                        label={'Dois horários'}
                                        onChange={() => {
                                            servico.qtdHorarios = 2
                                            this.setState({servico: servico})
                                        }}
                                    />
                                </RadioGroup>
                                <Box p={1}/>
                                <Button variant={'outlined'} color={'secondary'} fullWidth={true}
                                        onClick={this.onClickGravar}>Gravar</Button>
                            </DialogContent>
                        </div>
                    </Dialog>
                    <Dialog open={dialogDias} fullScreen={true}>
                        <div id={'div-dialog'}>
                            <div id={'div-voltar'}>
                                <ArrowBack onClick={() => this.setState({dialogDias: false})}/>
                                <FormLabel id={'label-voltar'}>Voltar</FormLabel>
                            </div>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}} color={'secondary'}>
                                Dias
                            </DialogTitle>
                            <DialogContent>
                                {
                                    dias.map((d, index) => (
                                        <div key={d.nome} style={{
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <FormControlLabel
                                                control={<Switch color={'secondary'} checked={d.ativado}/>}
                                                label={`${d.nome} - ${d.ativado ? 'Liberado' : 'Bloqueado'}`}
                                                style={{
                                                    color: 'white'
                                                }}
                                                onChange={(e, checked) => {
                                                    d.ativado = checked
                                                    this.setState({dias: dias})
                                                    this.gravarDias(dias)
                                                }}
                                            />
                                            {
                                                d.horarios.map(h => (
                                                    <FormControlLabel
                                                        key={h.hora}
                                                        control={<Switch color={'secondary'} checked={h.reserva}/>}
                                                        label={`${h.hora} - ${h.reserva ? 'Reservado' : 'Livre'}`}
                                                        style={{
                                                            color: '#f89e00'
                                                        }}
                                                        onChange={(e, checked) => {
                                                            h.reserva = checked
                                                            this.setState({dias: dias})
                                                            this.gravarDias(dias)
                                                        }}
                                                    />
                                                ))
                                            }
                                        </div>
                                    ))
                                }
                            </DialogContent>
                        </div>
                    </Dialog>
                    <Dialog open={dialogHorariosLiberados}>
                        <div id={'div-dialog'}>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}}
                                         color={'secondary'}>Horários</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}} color={'white'}>
                                    Todos os horários foram liberados
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button color={'secondary'} variant={'outlined'}
                                        onClick={() => this.setState({dialogHorariosLiberados: false})}>OK</Button>
                            </DialogActions>
                        </div>
                    </Dialog>
                </ThemeProvider>
            </div>
        )
    }
}

export default Dashbord