import React from 'react'
import '../styles/style.css'
import {
    Box,
    Button, CardMedia,
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
    Select, Snackbar,
    TextField,
    ThemeProvider
} from '@mui/material'
import {withStyles} from '@mui/styles'
import {ArrowBack, ContentCopy} from '@mui/icons-material'
import QRCode from 'qrcode.react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import firebase from '../firebase'
import moment from 'moment'
import {isDebug, verificaHorarios} from '../util'
import Lottie from 'react-lottie'
import loading from '../images/loading.json'

const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
}

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

const codigo_pix = '00020101021226900014BR.GOV.BCB.PIX2568pix-qr.mercadopago.com/instore/p/v2/0b586c698ba043d89e704fc8dfd4887043530016com.mercadolibre0129https://mpago.la/pos/313292225204000053039865802BR5909UNDEFINED6009SAO PAULO62070503***6304F870'

const CheckButton = withStyles({
    checked: {},
})(props => <Radio color="secondary" {...props} />)

class Agendar extends React.Component {

    state = {
        openSnackbar: false,
        snackbar: '',
        dialogServico: false,
        dialogBarbeiro: true,
        dialogAgendado: false,
        dialogHorario: false,
        dialogPix: false,
        dialogIdentificacao: false,
        dialogAviso: false,
        dialogAvisoMensagem: '',
        servicos: [],
        horariosLivres: [],
        dias: [],
        dia: new Date().getDay(),
        hora: '',
        nome: '',
        telefone: '',
        barbeiros: [],
        dialogLoading: false,
        mensagemLoading: 'Carregando...'
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

    onClickBarbeiro = (id) => {
        this.setState({
            dialogBarbeiro: false,
            dialogServico: true
        })
        sessionStorage.setItem('dbarbershop-barbeiro', id)
        this.buscaServicos()
        this.buscaDias()
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
                if (h.hora !== '20:30h') {
                    if ((a && b)) {
                        horariosLivres.push(h)
                    }
                }
            }
        })
        return horariosLivres
    }

    onClickHorario = async horario => {
        try {
            const {dias, dia} = this.state
            let dataSelecionada = this.converterStringEmData(horario.hora.replace('h', ''))
            if ((new Date().getDay() === dia) && (new Date() > dataSelecionada)) return this.setState({
                dialogAviso: true,
                dialogAvisoMensagem: 'Você está tentanto marcar um horário inferior ao atual.'
            })
            let ativo = true
            for (let i = 0; i < dias.length; i++) {
                if (dia === dias[i].dia && !dias[i].ativado) {
                    ativo = false
                    break
                }
            }
            try {
                const {reserva} = await verificaHorarios(dia, horario.id)
                if (reserva) {
                    alert('Demorou mano! alguém já marcou esse horário, selecione outro horário')
                    window.location.reload()
                    return
                }
            } catch (e) {

            }
            if (ativo)
                this.setState({horario: horario, hora: horario.hora, dialogHorario: false, dialogIdentificacao: true})
            else
                this.setState({
                    dialogAviso: true,
                    dialogAvisoMensagem: 'Infelizmento não estamos marcando horário para essa data, se possível escolha outro dia.'
                })
        } catch (e) {
            alert(e.message)
        }
    }

    converterStringEmData = hora => {
        hora = hora.split(':')
        const dt = new Date()
        return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), hora[0], hora[1])
    }

    onClickAgendar = async () => {
        const barbeiro = sessionStorage.getItem('dbarbershop-barbeiro')
        const {nome, telefone, horario, servico, dia, hora, barbeiros} = this.state
        if (nome === '') {
            this.setState({dialogAgendado: false})
            alert('Nome inválido')
            return
        }
        horario.reserva = true
        horario.nome = nome
        horario.telefone = telefone
        horario.servico = servico.servico
        horario.valor = servico.valor
        horario.hora = hora
        horario.dia = this.diasSemana(dia)
        horario.versao = process.env.REACT_APP_VERSAO
        horario[new Date().getTime()] = `${horario.nome} - ${moment().format('DD/MM/YYYY HH:mm:ss')}`
        horario.barbeiro = barbeiros[parseInt(barbeiro)]
        horario.agendamento = moment().format('DD/MM/YY HH:mm')
        horario.codigo = new Date().getTime()
        try {
            delete horario.barbeiro.foto
        } catch (e) {

        }
        try {
            const {reserva} = await verificaHorarios(dia, horario.id)
            if (reserva) {
                alert('Demorou mano! alguém já marcou esse horário, selecione outro horário')
                window.location.reload()
                return
            }
        } catch (e) {

        }
        let agenda = {
            nome: nome,
            telefone: telefone,
            servico: servico.servico,
            hora: hora,
            dia: dia,
            data: moment().format('DD/MM/YYYY'),
            id: new Date().getTime(),
            versao: process.env.REACT_APP_VERSAO,
            barbeiro: barbeiros[parseInt(barbeiro)].nome
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
                reserva: true,
                versao: process.env.REACT_APP_VERSAO,
                [new Date().getTime()]: `${horario.nome} - ${moment().format('DD/MM/YYYY HH:mm:ss')}`
            })
            this.gravaAgenda(dia, agenda)
        }
        this.gravaValores(horario)
        localStorage.setItem('dbarbershop-nome', nome)
        localStorage.setItem('dbarbershop-telefone', telefone)
        let historico = localStorage.getItem('dbarbershop-historico')
        historico = (historico !== null) ? JSON.parse(historico) : []
        historico.push(horario)
        localStorage.setItem('dbarbershop-historico', JSON.stringify(historico))
        this.setState({dialogAgendado: true})
        let mensagem = `Bom dia é o *${nome}*.\nMarquei com ${barbeiros[parseInt(barbeiro)].nome} um horário ${(dia === new Date().getDay()) ? 'hoje' : this.diasSemana(dia)}, às ${hora} para fazer *${servico.servico}.*\n\nMeu telefone pra contato: *${telefone}*`
        mensagem = window.encodeURIComponent(mensagem)
        if (!isDebug())
            window.location.assign(`https://api.whatsapp.com/send?phone=5551984266928&text=${mensagem}`)
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
                return 'terça'
            case 3:
                return 'quarta'
            case 4:
                return 'quinta'
            case 5:
                return 'sexta'
            default:
                return 'sábado'
        }
    }

    filtraHorarios = (dia, {hora, reserva}) => {
        const date = new Date()
        if (dia === date.getDay()) {
            hora = hora.replace('h', '')
            return (moment(hora, 'HH:mm').toDate().getTime() >= date.getTime()) && !reserva
        } else {
            return !reserva
        }
    }

    gravaHorario = (dia, horario) => {
        const barbeiro = sessionStorage.getItem('dbarbershop-barbeiro')
        firebase
            .database()
            .ref(`dias/${barbeiro}/${dia}/horarios/${horario.id}`)
            .update(horario)
            .then(() => console.log('ok'))
            .catch(e => console.error(e))
    }

    gravaAgenda = (dia, agenda) => {
        const barbeiro = sessionStorage.getItem('dbarbershop-barbeiro')
        firebase
            .database()
            .ref(`agenda/${barbeiro}/${dia}/horarios/${agenda.id}`)
            .update(agenda)
            .then(() => console.log('ok'))
            .catch(e => console.error(e))
    }

    gravaValores = (horario) => {
        const barbeiro = sessionStorage.getItem('dbarbershop-barbeiro')
        firebase
            .database()
            .ref(`valores/${barbeiro}/${horario.codigo}`)
            .set(horario)
            .then(() => console.log('ok'))
            .catch(e => console.error(e))
    }

    servicos = () => {
        let servicos = sessionStorage.getItem('dbarbershop-servico')
        const barbeiro = sessionStorage.getItem('dbarbershop-barbeiro')
        this.setState({servicos: (servicos !== null) ? JSON.parse(servicos) : []})
    }

    buscaBarbeiros = () => {
        this.setState({dialogLoading: true, mensagemLoading: 'Buscando barbeiros...'})
        firebase
            .database()
            .ref('barbeiros')
            .once('value')
            .then(callback => {
                const barbeiros = callback.val()
                this.setState({
                    barbeiros: (!!barbeiros) ? barbeiros : []
                })
                this.setState({dialogLoading: false})
            })
    }

    buscaDias = () => {
        const barbeiro = sessionStorage.getItem('dbarbershop-barbeiro')
        this.setState({dialogLoading: true, mensagemLoading: 'Buscando horários...'})
        firebase
            .database()
            .ref('dias/' + barbeiro)
            .on('value', callback => {
                let dias = callback.val()
                if (dias !== null) {
                    this.setState({
                        dias: dias,
                        horariosLivres: dias[new Date().getDay()].horarios
                    })
                } else {
                    this.setState({
                        dias: [],
                        horariosLivres: []
                    })
                }
                this.setState({dialogLoading: false})
            })
    }

    buscaServicos = () => {
        const barbeiro = sessionStorage.getItem('dbarbershop-barbeiro')
        this.setState({dialogLoading: true, mensagemLoading: 'Buscando serviços...'})
        firebase
            .database()
            .ref('servicos/' + barbeiro)
            .once('value')
            .then(callback => {
                let servicos = callback.val()
                if (servicos !== null) {
                    servicos = Object.values(servicos)
                    servicos = servicos.sort((a, b) => {
                        if (a.servico > b.servico) return 1
                        if (a.servico < b.servico) return -1
                        return 0
                    })
                    this.setState({servicos: servicos})
                    sessionStorage.setItem('dbarbershop-servico', JSON.stringify(servicos))
                }
                this.setState({dialogLoading: false})
            })
    }

    identificacao = () => {
        let nome = localStorage.getItem('dbarbershop-nome')
        let telefone = localStorage.getItem('dbarbershop-telefone')
        this.setState({nome: (nome !== null) ? nome : '', telefone: (telefone !== null) ? telefone : ''})
    }

    componentDidMount() {
        this.buscaBarbeiros()
        this.identificacao()
    }

    render() {
        const {
            dialogAviso,
            dialogAvisoMensagem,
            dialogServico,
            dialogHorario,
            dialogBarbeiro,
            dialogIdentificacao,
            dialogAgendado,
            dialogPix,
            servicos,
            horariosLivres,
            dias,
            dia,
            hora,
            nome,
            telefone,
            openSnackbar,
            snackbar,
            barbeiros,
            dialogLoading,
            mensagemLoading
        } = this.state
        return (
            <div id={'agendar'}>
                <ThemeProvider theme={theme}>
                    <Dialog open={dialogBarbeiro} fullScreen={true}>
                        <div id={'div-dialog-full-screen'}>
                            <div id={'div-voltar'}>
                                <ArrowBack onClick={() => this.props.history.goBack()}/>
                                <FormLabel id={'label-voltar'}>Voltar</FormLabel>
                            </div>
                            <DialogTitle
                                style={{fontFamily: 'Nunito', paddingTop: 10}}
                                color={'secondary'}>
                                Barbeiro
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText
                                    style={{fontFamily: 'Nunito', fontSize: 'medium'}}
                                    color={'white'}>
                                    Selecione o barbeiro
                                </DialogContentText>
                                {
                                    barbeiros.map(b => (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                                marginTop: 8,
                                                cursor: 'pointer'
                                            }}
                                            key={b.nome}
                                            onClick={() => this.onClickBarbeiro(b.id)}>
                                            <div id={'div-barbeiro'}>
                                                <CardMedia image={b.foto} id={'card-media-barbeiro'}/>
                                            </div>
                                            <Box p={1}/>
                                            <FormLabel style={{cursor: 'pointer'}} id={'label-servico'}>
                                                {b.nome}
                                            </FormLabel>
                                        </div>
                                    ))
                                }
                            </DialogContent>
                        </div>
                    </Dialog>
                    <Dialog open={dialogServico} fullScreen={true}>
                        <div id={'div-dialog-full-screen'}>
                            <div id={'div-voltar'}>
                                <ArrowBack onClick={() => this.setState({
                                    dialogServico: false,
                                    dialogBarbeiro: true
                                })}/>
                                <FormLabel id={'label-voltar'}>Voltar</FormLabel>
                            </div>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}}
                                         color={'secondary'}>Serviço</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}}
                                                   color={'white'}>
                                    Escolha o serviço que deseja agendar
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
                                                <Button
                                                    variant={'outlined'}
                                                    color={'secondary'}
                                                    style={{height: 50}}
                                                    onClick={() => this.onClickServico(s)}>
                                                    Selecionar
                                                </Button>
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
                                         color={'secondary'}>Horário</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}}
                                                   color={'white'}>
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
                                            // eslint-disable-next-line array-callback-return
                                            dias.map(d => {
                                                const dia = new Date().getDay()
                                                if (d.dia >= dia || true) {
                                                    return (
                                                        <MenuItem key={d.dia} value={d.dia}>{d.nome}</MenuItem>
                                                    )
                                                }
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                <Box p={1}/>
                                <div id={'div-horarios'}>
                                    <RadioGroup>
                                        {
                                            // eslint-disable-next-line array-callback-return
                                            horariosLivres.map(h => {
                                                if (this.filtraHorarios(dia, h))
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
                                <div className={'div-container'}>
                                    <div id={'div-botao'} onClick={() => {
                                        this.setState({dialogAgendado: true})
                                    }}>
                                        <FormLabel id={'label-botao'}>Marcar Horário</FormLabel>
                                    </div>
                                </div>
                                <div className={'div-container'}>
                                    <div id={'div-botao'} onClick={() => this.setState({dialogPix: true})}>
                                        <FormLabel id={'label-botao'}>Pagar com PIX</FormLabel>
                                    </div>
                                </div>
                            </DialogContent>
                        </div>
                    </Dialog>
                    <Dialog open={dialogAgendado}>
                        <div id={'div-dialog'}>
                            <DialogTitle style={{fontFamily: 'Nunito', paddingTop: 10}}
                                         color={'secondary'}>Marcar horário</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontFamily: 'Nunito', fontSize: 'medium'}}
                                                   color={'white'}>
                                    Você será redirecionado para o WhatsApp, envie a mensagem para confirmar o
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
                    <Dialog open={dialogPix} onClose={() => this.setState({dialogPix: false})}>
                        <div id={'div-dialog'}>
                            <DialogTitle
                                style={{fontFamily: 'Nunito', paddingTop: 10}}
                                color={'secondary'}>Pagar com PIX</DialogTitle>
                            <DialogContent style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <DialogContentText
                                    style={{fontFamily: 'Nunito', fontSize: 'medium'}}
                                    color={'white'}>
                                    Faça a leitura do Qr Code, ou copie o código PIX. Em seu banco confira as
                                    informações do recebedor e insira o valor que
                                    deseja pagar. Após pagar envie o comprovante de pagamento!
                                </DialogContentText>
                                <Box p={1}/>
                                <div style={{padding: 10, backgroundColor: 'white', borderRadius: 8}}>
                                    <QRCode id={'qr-code-pix'} value={codigo_pix}/>
                                </div>
                                <div className={'div-container'}>
                                    <div id={'div-botao'} onClick={() => this.setState({dialogPix: false})}>
                                        <ContentCopy/>
                                        <CopyToClipboard
                                            text={codigo_pix}
                                            onCopy={() => this.setState({
                                                openSnackbar: true,
                                                snackbar: 'Código PIX copiado !'
                                            })}>
                                            <span style={{
                                                color: '#ffffff',
                                                margin: 4
                                            }}>Copiar PIX</span>
                                        </CopyToClipboard>
                                    </div>
                                </div>
                            </DialogContent>
                        </div>
                    </Dialog>
                    <Dialog open={dialogLoading}>
                        <DialogContent id={'dialog-content-loading'}>
                            <Lottie
                                options={loadingOptions}
                                width={100}
                                height={100}
                            />
                            <Box p={1}/>
                            <DialogContentText id={'dialog-content-text-loading'}>
                                {mensagemLoading}
                            </DialogContentText>
                        </DialogContent>
                    </Dialog>
                    <Snackbar
                        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                        open={openSnackbar}
                        autoHideDuration={700}
                        onClose={() => this.setState({openSnackbar: false})}
                        message={snackbar}
                    />
                </ThemeProvider>
            </div>
        )
    }
}

export default Agendar
