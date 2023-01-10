import React from 'react'
import '../styles/style.css'
import {
    Box,
    createTheme,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormLabel, IconButton,
    ThemeProvider
} from '@mui/material'
import firebase from '../firebase'
import {ArrowBack, Delete} from '@mui/icons-material'
import Lottie from 'react-lottie'
import loading from '../images/loading.json'

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

const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
}

export default class Relatorios extends React.Component {

    state = {
        valores: [],
        segunda: [],
        terca: [],
        quarta: [],
        quinta: [],
        sexta: [],
        sabado: [],
        total_semana: 0,
        total_segunda: 0,
        total_terca: 0,
        total_quarta: 0,
        total_quinta: 0,
        total_sexta: 0,
        total_sabado: 0,
        dialogAgendamentos: false,
        dia: '',
        agendamentos: []
    }

    buscaValores = () => {
        const barbeiro = sessionStorage.getItem('dbarbershop-barbeiro')
        this.setState({dialogLoading: true, mensagemLoading: 'Buscando relatórios...'})
        firebase
            .database()
            .ref('valores/' + barbeiro)
            .once('value')
            .then(callback => {
                let valores = callback.val()
                if (valores !== null) {
                    valores = Object.values(valores)
                    let total_semana = 0
                    valores.forEach(v => total_semana += v.valor)
                    const segunda = valores.filter(v => v.dia === 'segunda')
                    let total_segunda = 0
                    segunda.forEach(s => total_segunda += s.valor)
                    let total_terca = 0
                    const terca = valores.filter(v => v.dia === 'terça')
                    terca.forEach(t => total_terca += t.valor)
                    let total_quarta = 0
                    const quarta = valores.filter(v => v.dia === 'quarta')
                    quarta.forEach(q => total_quarta += q.valor)
                    let total_quinta = 0
                    const quinta = valores.filter(v => v.dia === 'quinta')
                    quinta.forEach(q => total_quinta += q.valor)
                    let total_sexta = 0
                    const sexta = valores.filter(v => v.dia === 'sexta')
                    sexta.forEach(s => total_sexta += s.valor)
                    let total_sabado = 0
                    const sabado = valores.filter(v => v.dia === 'sábado')
                    sabado.forEach(s => total_sabado += s.valor)
                    this.setState({
                        valores: valores,
                        segunda: segunda,
                        terca: terca,
                        quarta: quarta,
                        quinta: quinta,
                        sexta: sexta,
                        sabado: sabado,
                        total_semana: total_semana,
                        total_segunda: total_segunda,
                        total_terca: total_terca,
                        total_quarta: total_quarta,
                        total_quinta: total_quinta,
                        total_sexta: total_sexta,
                        total_sabado: total_sabado
                    })
                }
                this.setState({dialogLoading: false})
            })
    }

    onClickDelete = codigo => {
        const barbeiro = sessionStorage.getItem('dbarbershop-barbeiro')
        firebase
            .database()
            .ref(`valores/${barbeiro}/${codigo}`)
            .remove()
            .then(() => {
                console.log('valor deletado')
                this.buscaValores()
                this.setState({dialogAgendamentos: false})
            })
            .catch(e => console.error(e))
    }

    componentDidMount() {
        this.buscaValores()
    }

    render() {
        const {
            segunda,
            terca,
            quarta,
            quinta,
            sexta,
            sabado,
            total_semana,
            total_segunda,
            total_terca,
            total_quarta,
            total_quinta,
            total_sexta,
            total_sabado,
            dialogAgendamentos,
            dia,
            agendamentos,
            dialogLoading,
            mensagemLoading
        } = this.state
        return (
            <div id={'relatorio'}>
                <ThemeProvider theme={theme}>
                    <div>
                        <div id={'div-voltar'}>
                            <ArrowBack onClick={() => this.props.history.goBack()}/>
                            <FormLabel id={'label-voltar'}>Voltar</FormLabel>
                        </div>
                        <div id={'div-titulo-pagina'}>
                            <FormLabel id={'form-label-relatorio'}>
                                Relatórios
                            </FormLabel>
                        </div>
                    </div>
                    <div id={'div-container-relatorios'}>
                        <div id={'div-totais-relatorios'} onClick={() => this.setState({
                            dialogAgendamentos: true,
                            dia: 'Segunda',
                            agendamentos: segunda
                        })}>
                            <FormLabel id={'form-label-relatorio'}>
                                Segunda:
                            </FormLabel>
                            <Box p={1}/>
                            <FormLabel id={'form-label-total-semana'}>
                                {total_segunda.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                            </FormLabel>
                        </div>
                        <div id={'div-totais-relatorios'} onClick={() => this.setState({
                            dialogAgendamentos: true,
                            dia: 'Terça',
                            agendamentos: terca
                        })}>
                            <FormLabel id={'form-label-relatorio'}>
                                Terça:
                            </FormLabel>
                            <Box p={1}/>
                            <FormLabel id={'form-label-total-semana'}>
                                {total_terca.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                            </FormLabel>
                        </div>
                        <div id={'div-totais-relatorios'} onClick={() => this.setState({
                            dialogAgendamentos: true,
                            dia: 'Quarta',
                            agendamentos: quarta
                        })}>
                            <FormLabel id={'form-label-relatorio'}>
                                Quarta:
                            </FormLabel>
                            <Box p={1}/>
                            <FormLabel id={'form-label-total-semana'}>
                                {total_quarta.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                            </FormLabel>
                        </div>
                        <div id={'div-totais-relatorios'} onClick={() => this.setState({
                            dialogAgendamentos: true,
                            dia: 'Quinta',
                            agendamentos: quinta
                        })}>
                            <FormLabel id={'form-label-relatorio'}>
                                Quinta:
                            </FormLabel>
                            <Box p={1}/>
                            <FormLabel id={'form-label-total-semana'}>
                                {total_quinta.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                            </FormLabel>
                        </div>
                        <div id={'div-totais-relatorios'} onClick={() => this.setState({
                            dialogAgendamentos: true,
                            dia: 'Sexta',
                            agendamentos: sexta
                        })}>
                            <FormLabel id={'form-label-relatorio'}>
                                Sexta:
                            </FormLabel>
                            <Box p={1}/>
                            <FormLabel id={'form-label-total-semana'}>
                                {total_sexta.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                            </FormLabel>
                        </div>
                        <div id={'div-totais-relatorios'} onClick={() => this.setState({
                            dialogAgendamentos: true,
                            dia: 'Sábado',
                            agendamentos: sabado
                        })}>
                            <FormLabel id={'form-label-relatorio'}>
                                Sábado:
                            </FormLabel>
                            <Box p={1}/>
                            <FormLabel id={'form-label-total-semana'}>
                                {total_sabado.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                            </FormLabel>
                        </div>
                        <Box p={1}/>
                        <Divider id={'divider-total'}/>
                        <Box p={1}/>
                        <div id={'div-totais-relatorios'}>
                            <FormLabel id={'form-label-relatorio'}>
                                Total da semana:
                            </FormLabel>
                            <Box p={1}/>
                            <FormLabel id={'form-label-total-semana'}>
                                {total_semana.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                            </FormLabel>
                        </div>
                        <Box p={2}/>
                        <div id={'div-aviso-ralatorio'}>
                            <FormLabel id={'form-label-aviso-relatorio'}>
                                Obs: Isso é uma previsão baseada nos agendamento da semana, não garanti que o cliente
                                realizou o atendimento.
                            </FormLabel>
                        </div>
                        <Dialog open={dialogAgendamentos} fullScreen={true}>
                            <div id={'div-dialog-full-screen'}>
                                <div id={'div-voltar'}>
                                    <ArrowBack onClick={() => this.setState({dialogAgendamentos: false})}/>
                                    <FormLabel id={'label-voltar'}>Voltar</FormLabel>
                                </div>
                                <DialogTitle
                                    style={{fontFamily: 'Nunito', paddingTop: 10}}
                                    color={'secondary'}>
                                    {dia}
                                </DialogTitle>
                                <DialogContent>
                                    {
                                        agendamentos.map((a, i) => (
                                            <div key={i} style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    marginTop: 10
                                                }}>
                                                    <FormLabel id={'label-servico'}>
                                                        {a.nome}
                                                    </FormLabel>
                                                    <FormLabel id={'label-valor'}>
                                                        {a.servico}
                                                    </FormLabel>
                                                    <FormLabel id={'label-valor'}>
                                                        {a.valor.toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL'
                                                        })}
                                                    </FormLabel>
                                                    <FormLabel id={'label-valor'}>
                                                        {a.hora}
                                                    </FormLabel>
                                                </div>
                                                <IconButton onClick={() => this.onClickDelete(a.codigo)}>
                                                    <Delete/>
                                                </IconButton>
                                            </div>
                                        ))
                                    }
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
                    </div>
                </ThemeProvider>
            </div>
        )
    }
}
