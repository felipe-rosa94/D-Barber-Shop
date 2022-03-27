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
        servicos: [],
        horarios: [],
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
        const {dias} = this.state
        let dia = e.target.value
        let horarios = dias[dia].horarios
        this.setState({dia: dia, horariosLivres: horarios})
    }

    onClickServico = servico => {
        const {horarios} = this.state
        let horariosLivres = []
        horarios.forEach((h, index) => {
            if (servico.qtdHorarios === 1) {
                if (!h.reserva) horariosLivres.push(h)
            } else {
                let reserva = (!horarios[(horarios.length === index + 1) ? horarios.length - 1 : index + 1].reserva && !horarios[(index - 1 !== -1) ? index - 1 : 0].reserva && !h.reserva)
                if (reserva) horariosLivres.push(h)
            }
        })
        this.setState({dialogServico: false, dialogHorario: true, horariosLivres: horariosLivres, servico: servico})
    }

    onClickHorario = horario => {
        this.setState({horario: horario, hora: horario.hora, dialogHorario: false, dialogIdentificacao: true})
    }

    onClickAgendar = () => {
        const {nome, telefone, horario, servico, dia, hora} = this.state
        horario.nome = nome
        horario.telefone = telefone
        horario.servico = servico.servico
        horario.hora = hora
        horario.reserva = true
        horario.data = moment().format('DD/MM/YYYY')
        firebase
            .database()
            .ref('dias/' + dia + '/horarios/' + horario.id)
            .update(horario)
            .then(() => console.log('ok'))
            .catch(e => console.error(e))
        localStorage.setItem('dbarbershop-nome', nome)
        localStorage.setItem('dbarbershop-telefone', telefone)
        let historico = localStorage.getItem('dbarbershop-historico')
        historico = (historico !== null) ? JSON.parse(historico) : []
        historico.push(horario)
        localStorage.setItem('dbarbershop-historico', JSON.stringify(historico))
        this.setState({dialogAgendado: true})
    }

    servicos = () => {
        let servicos = sessionStorage.getItem('dbarbershop-servico')
        this.setState({servicos: (servicos !== null) ? JSON.parse(servicos) : []})
    }

    dias = () => {
        let dias = sessionStorage.getItem('dbarbershop-dias')
        this.setState({dias: (dias !== null) ? JSON.parse(dias) : []})
        dias = (dias !== null) ? JSON.parse(dias) : []
        this.setState({
            horarios: dias[new Date().getDay()].horarios,
            horariosLivres: dias[new Date().getDay()].horarios
        })
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
            dialogServico,
            dialogHorario,
            dialogIdentificacao,
            dialogAgendado,
            servicos,
            horarios,
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
                                         color={'secondary'}>Serviço</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}} color={'white'}>
                                    Escolha o serviço que deseja agendar
                                </DialogContentText>
                                {
                                    servicos.map(s => (
                                        <div id={'div-servico'} key={s.servico} onClick={() => this.onClickServico(s)}>
                                            <FormLabel id={'label-servico'}>{s.servico}</FormLabel>
                                            <FormLabel id={'label-valor'}>{s.valor.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })}</FormLabel>
                                        </div>
                                    ))
                                }
                            </DialogContent>
                        </div>
                    </Dialog>
                    <Dialog open={dialogHorario} fullScreen={true}>
                        <div id={'div-dialog-full-screen'}>
                            <div id={'div-voltar'}>
                                <ArrowBack onClick={() => this.setState({
                                    dialogServico: true,
                                    dialogHorario: false,
                                    horariosLivres: horarios
                                })}/>
                                <FormLabel id={'label-voltar'}>Voltar</FormLabel>
                            </div>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}}
                                         color={'secondary'}>Horário</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}} color={'white'}>
                                    Escolha o horário que deseja agendar
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
                                            dias.map(d => {
                                                if (d.ativado)
                                                    return (<MenuItem key={d.dia} value={d.dia}>{d.nome}</MenuItem>)
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                <Box p={1}/>
                                <div id={'div-horarios'}>
                                    <RadioGroup>
                                        {
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
                                         color={'secondary'}>Identificação</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}} color={'white'}>
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
                                <div id={'div-botao'} onClick={this.onClickAgendar}>
                                    <FormLabel id={'label-botao'}>Marcar Horário</FormLabel>
                                </div>
                            </DialogContent>
                        </div>
                    </Dialog>
                    <Dialog open={dialogAgendado}>
                        <div id={'div-dialog'}>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}}
                                         color={'secondary'}>Marcado</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}} color={'white'}>
                                    Horário marcado com sucesso
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button color={'secondary'} variant={'outlined'}
                                        onClick={() => this.props.history.replace({
                                            pathname: '/',
                                            marcado: 'ok'
                                        })}>OK</Button>
                            </DialogActions>
                        </div>
                    </Dialog>
                </ThemeProvider>
            </div>
        )
    }
}

export default Agendar