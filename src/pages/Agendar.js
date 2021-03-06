import React from 'react'
import '../styles/style.css'
import {
    Box,
    Button,
    createTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    ThemeProvider
} from '@mui/material'
import {withStyles} from '@mui/styles'
import {ArrowBack} from '@mui/icons-material'
import firebase from '../firebase'
import moment from "moment";
import {isDebug} from "../util";

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

class Agendar extends React.Component {

    state = {
        dialogServico: true,
        dialogAgendado: false,
        dialogHorario: false,
        dialogIdentificacao: false,
        dialogAviso: false,
        dialogAvisoMensagem: '',
        servicos: [],
        horariosLivres: [],
        dias: [],
        dia: new Date().getDay(),
        hora: '',
        nome: '',
        telefone: ''
    }

    handleInput = e => {
        if (e.target.name === 'nome')
            this.setState({nome: e.target.value.toUpperCase()})
        else
            this.setState({telefone: this.mascaraTelefone(e.target.value)})
    }

    mascaraTelefone = telefone => {
        if (telefone !== '') {
            telefone = telefone.substring(0, 14)
            return telefone.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2')
        }
    }

    handleChange = e => {
        const {dias, servico} = this.state
        let dia = e.target.value
        let horarios = dias[dia].horarios
        this.setState({
            dia: dia,
            horariosLivres: this.verificaHorarios(horarios, servico)
        })
    }

    onClickServico = servico => {
        const {dias, dia} = this.state
        let horarios = dias[dia].horarios
        this.setState({
            dialogServico: false,
            dialogHorario: true,
            horariosLivres: this.verificaHorarios(horarios, servico),
            servico: servico
        })
    }

    verificaHorarios = (horarios, servico) => {
        let horariosLivres = []
        horarios.forEach((h, index) => {
            if (servico.qtdHorarios === 1) {
                if (!h.reserva) horariosLivres.push(h)
            } else {
                let a = !horarios[(horarios.length === index + 1) ? horarios.length - 1 : index + 1].reserva
                let b = !h.reserva
                if ((a && b)) horariosLivres.push(h)
            }
        })
        return horariosLivres
    }

    onClickHorario = horario => {
        const {dias, dia} = this.state
        let dataSelecionada = this.converterStringEmData(horario.hora.replace('h', ''))
        if ((new Date().getDay() === dia) && (new Date() > dataSelecionada)) return this.setState({
            dialogAviso: true,
            dialogAvisoMensagem: 'Voc?? est?? tentanto marcar um hor??rio inferior ao atual.'
        })
        let ativo = true
        for (let i = 0; i < dias.length; i++) {
            if (dia === dias[i].dia && !dias[i].ativado) {
                ativo = false
                break
            }
        }
        if (ativo)
            this.setState({horario: horario, hora: horario.hora, dialogHorario: false, dialogIdentificacao: true})
        else
            this.setState({
                dialogAviso: true,
                dialogAvisoMensagem: 'Infelizmento n??o estamos marcando hor??rio para essa data, se poss??vel escolha outro dia.'
            })
    }

    converterStringEmData = hora => {
        hora = hora.split(':')
        const dt = new Date()
        return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), hora[0], hora[1])
    }

    onClickAgendar = () => {
        const {nome, telefone, horario, servico, dia, hora} = this.state
        if (nome === '') return alert('Nome inv??lido')
        horario.reserva = true
        horario.nome = nome
        horario.telefone = telefone
        horario.servico = servico.servico
        horario.hora = hora
        horario.dia = this.diasSemana(dia)
        let agenda = {
            nome: nome,
            telefone: telefone,
            servico: servico.servico,
            hora: hora,
            dia: dia,
            data: moment().format('DD/MM/YYYY'),
            id: new Date().getTime()
        }
        if (servico.qtdHorarios === 1) {
            this.gravaHorario(dia, horario)
            this.gravaAgenda(dia, agenda)
        } else {
            this.gravaHorario(dia, horario)
            this.gravaHorario(dia, {
                id: (horario.id + 1),
                nome: horario.nome,
                telefone: horario.telefone,
                reserva: true
            })
            this.gravaAgenda(dia, agenda)
        }
        localStorage.setItem('dbarbershop-nome', nome)
        localStorage.setItem('dbarbershop-telefone', telefone)
        let historico = localStorage.getItem('dbarbershop-historico')
        historico = (historico !== null) ? JSON.parse(historico) : []
        historico.push(horario)
        localStorage.setItem('dbarbershop-historico', JSON.stringify(historico))
        this.setState({dialogAgendado: true})
        let mensagem = `Bom dia ?? o *${nome}*.\nMarquei um hor??rio ${(dia === new Date().getDay()) ? 'hoje' : this.diasSemana(dia)}, ??s ${hora} para fazer *${servico.servico}.*\n\nMeu telefone pra contato: *${telefone}*`
        mensagem = window.encodeURIComponent(mensagem)
        if (!isDebug())
            window.open(`https://api.whatsapp.com/send?phone=5551${isDebug() ? '993031434' : '984266928'}&text=${mensagem}`, '_blank')
        this.props.history.replace({
            pathname: '/',
            marcado: 'ok'
        })
    }

    diasSemana = dia => {
        switch (dia) {
            case 0:
                return 'domingo'
            case 1:
                return 'segunda'
            case 2:
                return 'ter??a'
            case 3:
                return 'quarta'
            case 4:
                return 'quinta'
            case 5:
                return 'sexta'
            default:
                return 's??bado'
        }
    }

    gravaHorario = (dia, horario) => {
        firebase
            .database()
            .ref('dias/' + dia + '/horarios/' + horario.id)
            .update(horario)
            .then(() => console.log('ok'))
            .catch(e => console.error(e))
    }

    gravaAgenda = (dia, agenda) => {
        firebase
            .database()
            .ref('agenda/' + dia + '/horarios/' + agenda.id)
            .update(agenda)
            .then(() => console.log('ok'))
            .catch(e => console.error(e))
    }

    servicos = () => {
        let servicos = sessionStorage.getItem('dbarbershop-servico')
        this.setState({servicos: (servicos !== null) ? JSON.parse(servicos) : []})
    }

    dias = () => {
        let dias = sessionStorage.getItem('dbarbershop-dias')
        this.setState({dias: (dias !== null) ? JSON.parse(dias) : []})
        dias = (dias !== null) ? JSON.parse(dias) : []
        this.setState({horariosLivres: dias[new Date().getDay()].horarios})
    }

    identificacao = () => {
        let nome = localStorage.getItem('dbarbershop-nome')
        let telefone = localStorage.getItem('dbarbershop-telefone')
        this.setState({nome: (nome !== null) ? nome : '', telefone: (telefone !== null) ? telefone : ''})
    }

    componentDidMount() {
        this.dias()
        this.servicos()
        this.identificacao()
    }

    render() {
        const {
            dialogAviso,
            dialogAvisoMensagem,
            dialogServico,
            dialogHorario,
            dialogIdentificacao,
            dialogAgendado,
            servicos,
            horariosLivres,
            dias,
            dia,
            hora,
            nome,
            telefone
        } = this.state
        return (
            <div id={'agendar'}>
                <ThemeProvider theme={theme}>
                    <Dialog open={dialogServico} fullScreen={true}>
                        <div id={'div-dialog-full-screen'}>
                            <div id={'div-voltar'}>
                                <ArrowBack onClick={() => this.props.history.goBack()}/>
                                <FormLabel id={'label-voltar'}>Voltar</FormLabel>
                            </div>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}}
                                         color={'secondary'}>Servi??o</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}}
                                                   color={'white'}>
                                    Escolha o servi??o que deseja agendar
                                </DialogContentText>
                                {
                                    servicos.map(s => (
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            marginTop: 8
                                        }}
                                             key={s.servico}>
                                            <div id={'div-servico'} style={{flex: 1}}>
                                                <FormLabel id={'label-servico'}>{s.servico}</FormLabel>
                                                <FormLabel id={'label-valor'}>{s.valor.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                })}</FormLabel>
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "flex-end",
                                                flex: 1
                                            }}>
                                                <Button variant={'outlined'} color={'secondary'} style={{height: 50}}
                                                        onClick={() => this.onClickServico(s)}>Selecionar</Button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </DialogContent>
                        </div>
                    </Dialog>
                    <Dialog open={dialogHorario} fullScreen={true}>
                        <div id={'div-dialog-full-screen'}>
                            <div id={'div-voltar'}>
                                <ArrowBack onClick={() => {
                                    this.setState({
                                        dialogServico: true,
                                        dialogHorario: false
                                    })
                                }}/>
                                <FormLabel id={'label-voltar'}>Voltar</FormLabel>
                            </div>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}}
                                         color={'secondary'}>Hor??rio</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}}
                                                   color={'white'}>
                                    Escolha o hor??rio que deseja agendar
                                </DialogContentText>
                                <Box p={1}/>
                                <FormControl fullWidth={true} color={'secondary'} focused={true}>
                                    <InputLabel>Dia</InputLabel>
                                    <Select
                                        value={dia}
                                        label="Dia"
                                        color={'secondary'}
                                        style={{color: '#f89e00'}}
                                        onChange={this.handleChange}
                                    >
                                        {
                                            dias.map(d => (
                                                <MenuItem key={d.dia} value={d.dia}>{d.nome}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <Box p={1}/>
                                <div id={'div-horarios'}>
                                    <RadioGroup>
                                        {
                                            // eslint-disable-next-line array-callback-return
                                            horariosLivres.map(h => {
                                                if (!h.reserva)
                                                    return (<FormControlLabel
                                                        checked={hora === h.hora}
                                                        key={h.hora}
                                                        style={{color: '#f89e00'}}
                                                        control={<CheckButton/>}
                                                        label={h.hora}
                                                        onChange={() => this.onClickHorario(h)}/>)
                                            })
                                        }
                                    </RadioGroup>
                                </div>
                            </DialogContent>
                        </div>
                    </Dialog>
                    <Dialog open={dialogIdentificacao} fullScreen={true}>
                        <div id={'div-dialog-full-screen'}>
                            <div id={'div-voltar'}>
                                <ArrowBack onClick={() => this.setState({
                                    dialogServico: false,
                                    dialogHorario: true,
                                    dialogIdentificacao: false
                                })}/>
                                <FormLabel id={'label-voltar'}>Voltar</FormLabel>
                            </div>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}}
                                         color={'secondary'}>Identifica????o</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}}
                                                   color={'white'}>
                                    Digite seu nome e telefone
                                </DialogContentText>
                                <Box p={1}/>
                                <TextField
                                    value={nome}
                                    name={'nome'}
                                    id={'input'}
                                    color={'secondary'}
                                    variant={'outlined'}
                                    label={'Nome'}
                                    placeholder={'Nome'}
                                    focused={true}
                                    autoFocus={true}
                                    fullWidth={true}
                                    onChange={this.handleInput}/>
                                <Box p={1}/>
                                <TextField
                                    value={telefone}
                                    name={'telefone'}
                                    id={'input'}
                                    color={'secondary'}
                                    variant={'outlined'}
                                    label={'Telefone'}
                                    placeholder={'Telefone'}
                                    focused={true}
                                    fullWidth={true}
                                    onChange={this.handleInput}/>
                                <Box p={1}/>
                                <div id={'div-botao'} onClick={() => this.setState({dialogAgendado: true})}>
                                    <FormLabel id={'label-botao'}>Marcar Hor??rio</FormLabel>
                                </div>
                            </DialogContent>
                        </div>
                    </Dialog>
                    <Dialog open={dialogAgendado}>
                        <div id={'div-dialog'}>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}}
                                         color={'secondary'}>Marcar hor??rio</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}}
                                                   color={'white'}>
                                    Voc?? ser?? redirecionado para o WhatsApp, envie a mensagem para confirmar o
                                    agendamento.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button color={'secondary'} variant={'outlined'}
                                        onClick={this.onClickAgendar}>OK, Confirmar</Button>
                            </DialogActions>
                        </div>
                    </Dialog>
                    <Dialog open={dialogAviso}>
                        <div id={'div-dialog'}>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}}
                                         color={'secondary'}>Opa!!!</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}}
                                                   color={'white'}>
                                    {dialogAvisoMensagem}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button color={'secondary'} variant={'outlined'}
                                        onClick={() => this.setState({dialogAviso: false})}>OK</Button>
                            </DialogActions>
                        </div>
                    </Dialog>
                </ThemeProvider>
            </div>
        )
    }
}

export default Agendar
