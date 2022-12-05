import React from 'react'
import '../styles/style.css'
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    createTheme,
    Dialog,
    DialogActions,
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
    ThemeProvider,
    Toolbar,
    Typography
} from '@mui/material'
import {
    Add,
    ArrowBack,
    Delete,
    Edit,
    RemoveRedEye
} from '@mui/icons-material'
import {withStyles} from '@mui/styles'
import firebase from '../firebase'
import {codigoDia, liberarTodos, timestamp} from '../util'
import QRCode from 'qrcode.react'

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
        dialogReserva: false,
        dialogDias: false,
        dialogServico: false,
        dialogCadastrarServico: false,
        dialogHorariosLiberados: false,
        dialogLiberarHorarios: false,
        dialogFidelidade: false,
        usuario: '',
        senha: '',
        servicos: [],
        servico: {
            servico: '',
            valor: '',
            qtdHorarios: 1,
        },
        reserva: {
            nome: '',
            telefone: '',
            servico: ''
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
        this.setState({dialogLiberarHorarios: false})
        let agenda = localStorage.getItem('dbarbershop-agenda')
        agenda = (agenda !== null) ? JSON.parse(agenda) : []
        firebase
            .database()
            .ref('historico/' + timestamp())
            .set(agenda)
            .then(() => console.log('ok'))
            .catch(e => console.error(e))
        firebase
            .database()
            .ref('agenda/')
            .remove()
            .then(() => console.log('ok'))
            .catch(e => console.error(e))
        firebase
            .database()
            .ref('dias/')
            .set(liberarTodos)
            .then(() => {
                this.setState({dialogHorariosLiberados: true})
                this.buscaDias()
                this.buscaAgenda()
            })
            .catch(e => console.error(e))
        localStorage.setItem('dbarbershop-agenda', JSON.stringify([]))
    }

    onClickLoja = () =>
        this.props.history.push('/')

    gravarDias = dias =>
        firebase
            .database()
            .ref('dias/')
            .update(dias)
            .then(() => console.log)
            .catch(e => console.error(e))

    onClickVerReserva = reserva => {
        this.setState({dialogReserva: true, reserva: reserva})
    }

    onClickGravar = () => {
        const {servico, servicos} = this.state
        if (servico.servico === '' || servico.valor === '') {
            this.setState({dialogCadastrarServico: false})
            alert('Serviço ou valor inválido!')
            return
        }
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
        this.setState({
            servicos: servicos.sort((a, b) => {
                if (a.servico > b.servico) return 1
                if (a.servico < b.servico) return -1
                return 0
            })
        })
    }

    onClickDeletar = id => firebase
        .database()
        .ref('servicos/' + id)
        .remove()
        .then(() => {
            this.buscaServicos()
        })
        .catch(e => {
            console.error(e)
        })

    onClickDeletarAgenda = agenda =>
        firebase
            .database()
            .ref('agenda/' + agenda.dia + '/horarios/' + agenda.id)
            .remove()
            .then(() => this.buscaAgenda())
            .catch(e => console.error(e))

    onClickLogin = () => {
        const {usuario, senha} = this.state
        firebase
            .auth()
            .signInWithEmailAndPassword(usuario.toLowerCase(), senha)
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

    buscaServicos = () =>
        firebase
            .database()
            .ref('servicos')
            .once('value')
            .then(callback => {
                let servicos = callback.val()
                if (servicos !== null) {
                    servicos = servicos.sort((a, b) => {
                        if (a.servico > b.servico) return 1
                        if (a.servico < b.servico) return -1
                        return 0
                    })
                    this.setState({servicos: servicos})
                } else {
                    this.setState({servicos: []})
                }
            })

    buscaDias = () =>
        firebase
            .database()
            .ref('dias')
            .once('value')
            .then(callback => {
                if (callback.val() !== null) this.setState({dias: callback.val()})
            })

    buscaAgenda = () =>
        firebase
            .database()
            .ref('agenda')
            .once('value')
            .then(callback => {
                if (callback.val() !== null) {
                    let agenda = Object.values(callback.val()[new Date().getDay()].horarios)
                    agenda.sort((a, b) => {
                        if (a.hora > b.hora)
                            return 1
                        if (a.hora < b.hora)
                            return -1
                        return 0
                    })
                    this.setState({agenda: agenda})
                    localStorage.setItem('dbarbershop-agenda', JSON.stringify(Object.values(callback.val())))
                } else {
                    this.setState({agenda: []})
                    localStorage.setItem('dbarbershop-agenda', JSON.stringify([]))
                }
            })

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
            dialogLiberarHorarios,
            dialogReserva,
            dialogDias,
            dialogFidelidade,
            servicos,
            servico,
            reserva,
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
                        <div id={'div-botao'} onClick={() => this.setState({dialogLiberarHorarios: true})}>
                            <FormLabel id={'label-botao'}>Liberar todos os horários</FormLabel>
                        </div>
                    </div>
                    <div className={'div-container'}>
                        <div id={'div-botao'} onClick={this.onClickLoja}>
                            <FormLabel id={'label-botao'}>Area do Cliente</FormLabel>
                        </div>
                    </div>
                    <div className={'div-container'}>
                        <div id={'div-botao'} onClick={() => this.setState({dialogFidelidade: true})}>
                            <FormLabel id={'label-botao'}>Gerar QR Code Fidelidade</FormLabel>
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
                                        <div key={a.nome}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between'
                                                }}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        marginTop: 10
                                                    }}>
                                                    <FormLabel id={'label-servico'}>{a.nome}</FormLabel>
                                                    <FormLabel id={'label-valor'}>{a.telefone}</FormLabel>
                                                    <FormLabel id={'label-valor'}>{a.servico}</FormLabel>
                                                    <FormLabel id={'label-valor'}>{a.hora}</FormLabel>
                                                    <FormLabel id={'label-valor'}>{a.data}</FormLabel>
                                                    <FormLabel
                                                        id={'label-valor'}>{`Versão site: ${a.versao}`}</FormLabel>
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexDirection: 'column',
                                                        marginTop: 10
                                                    }}>
                                                    <Delete onClick={() => this.onClickDeletarAgenda(a)}/>
                                                </div>
                                            </div>
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
                                            key={s.servico}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                flexDirection: 'row',
                                                marginTop: 10,
                                            }}>
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
                                    dias.map(d => (
                                        <div
                                            key={d.nome}
                                            style={{
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
                                                    <div
                                                        key={h.hora}
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                        {
                                                            (h.hora !== undefined) &&
                                                            <div>
                                                                <FormControlLabel
                                                                    key={h.hora}
                                                                    control={<Switch color={'secondary'}
                                                                                     checked={h.reserva}/>}
                                                                    label={`${(h.hora === undefined) ? 'Reserva' : h.hora} - ${h.reserva ? 'Reservado' : 'Livre'}`}
                                                                    style={{
                                                                        color: '#f89e00'
                                                                    }}
                                                                    onChange={(e, checked) => {
                                                                        h.reserva = checked
                                                                        h.nome = checked ? 'Administrador' : ''
                                                                        if (!checked) {
                                                                            delete h['dia']
                                                                            delete h['nome']
                                                                            delete h['servico']
                                                                            delete h['telefone']
                                                                        }
                                                                        this.setState({dias: dias})
                                                                        this.gravarDias(dias)
                                                                    }}
                                                                />
                                                            </div>
                                                        }
                                                        {
                                                            (h.hora !== undefined) &&
                                                            <div>
                                                                {
                                                                    (h.reserva) &&
                                                                    <RemoveRedEye style={{color: 'white'}}
                                                                                  onClick={() => this.onClickVerReserva(h)}/>
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ))
                                }
                            </DialogContent>
                        </div>
                    </Dialog>
                    <Dialog open={dialogLiberarHorarios}>
                        <div id={'div-dialog'}>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}}
                                         color={'secondary'}>Liberar horários</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}} color={'white'}>
                                    {'Deseja liberar todos os horários?\nFazendo isso você remove todas as reserva marcadas.'}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button color={'secondary'} variant={'outlined'}
                                        onClick={() => this.setState({dialogLiberarHorarios: false})}>Cancelar</Button>
                                <Button color={'secondary'} variant={'outlined'}
                                        onClick={this.onClickLiberarTodos}>Confirmar</Button>
                            </DialogActions>
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
                    <Dialog open={dialogReserva}>
                        <div id={'div-dialog'}>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}}
                                         color={'secondary'}>Reserva</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}} color={'white'}>
                                    Detalhes da reserva
                                </DialogContentText>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                    <FormLabel id={'label-servico'}>{`Nome: ${reserva.nome}`}</FormLabel>
                                    {
                                        (reserva.telefone !== undefined) &&
                                        <FormLabel id={'label-valor'}>{`Telefone: ${reserva.telefone}`}</FormLabel>
                                    }
                                    {
                                        (reserva.servico !== undefined) &&
                                        <FormLabel id={'label-valor'}>{`Serviço: ${reserva.servico}`}</FormLabel>
                                    }
                                    {
                                        (reserva.versao !== undefined) &&
                                        <FormLabel id={'label-valor'}>{`Versão site: ${reserva.versao}`}</FormLabel>
                                    }
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button color={'secondary'} variant={'outlined'}
                                        onClick={() => this.setState({dialogReserva: false})}>OK</Button>
                            </DialogActions>
                        </div>
                    </Dialog>
                    <Dialog open={dialogFidelidade}>
                        <div id={'div-dialog'}>
                            <DialogTitle
                                style={{
                                    fontFamily: 'Nunito',
                                    paddingTop: 10
                                }}
                                color={'secondary'}>
                                Qr Code Fidelidade
                            </DialogTitle>
                            <DialogContent>
                                <Card>
                                    <CardContent style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 20
                                    }}>
                                        <QRCode id="qrcode" value={codigoDia()}/>
                                    </CardContent>
                                </Card>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    color={'secondary'}
                                    variant={'outlined'}
                                    fullWidth={true}
                                    onClick={() => this.setState({dialogFidelidade: false})}>
                                    Fechar
                                </Button>
                            </DialogActions>
                        </div>
                    </Dialog>
                </ThemeProvider>
            </div>
        )
    }
}

export default Dashbord
