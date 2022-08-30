import React from 'react'
import {ArrowBack} from '@mui/icons-material'
import {Box, CardMedia, createTheme, FormLabel, ThemeProvider} from '@mui/material'
import logo from '../images/logo.png'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import {codigoDia} from '../util'

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

class Fidelidade extends React.Component {

    state = {
        fidelidade: []
    }

    verificaFidelidade = () => {
        let fidelidade = localStorage.getItem('dbarbershop-fidelidade')
        fidelidade = (fidelidade !== null) ? JSON.parse(fidelidade) : []
        let codigo = sessionStorage.getItem('dbarbershop-codigo')
        if (codigo === codigoDia()) {
            fidelidade.push(codigo)
            if (fidelidade.length >= 11) {
                fidelidade = []
                fidelidade.push(codigo)
            }
            sessionStorage.removeItem('dbarbershop-codigo')
        }
        localStorage.setItem('dbarbershop-fidelidade', JSON.stringify(fidelidade))
        this.setState({fidelidade: fidelidade})
    }

    componentDidMount() {
        this.verificaFidelidade()
    }

    render() {
        const {fidelidade} = this.state
        return (
            <div id={'fidelidade'}>
                <ThemeProvider theme={theme}>
                    <div id={'div-voltar'}>
                        <ArrowBack id={'icone-voltar'} onClick={() => this.props.history.goBack()}/>
                        <FormLabel id={'label-voltar'}>Voltar</FormLabel>
                    </div>
                    <div id={'div-fidelidade'}>
                        <div className={'div-container'}>
                            <div id={'div-botao'} onClick={() => this.props.history.push('/scan')}>
                                <QrCodeScannerIcon color="primary"/>
                                <Box p={1}/>
                                <FormLabel id={'label-botao'}>Abrir Câmera</FormLabel>
                            </div>
                        </div>
                        <div id={'div-cartao-fidelidade'}>
                            <div id={'div-row-cartao-fidelidade'}>
                                <div id={'div-selo-cartao-fidelidade-esquerda'}>
                                    {
                                        (fidelidade.length >= 1) &&
                                        <CardMedia image={logo} id={'card-media-selo'}/>
                                    }
                                </div>
                                <div id={'div-selo-cartao-fidelidade-direita'}>
                                    {
                                        (fidelidade.length >= 2) &&
                                        <CardMedia image={logo} id={'card-media-selo'}/>
                                    }
                                </div>
                            </div>
                            <div id={'div-row-cartao-fidelidade'}>
                                <div id={'div-selo-cartao-fidelidade-esquerda'}>
                                    {
                                        (fidelidade.length >= 3) &&
                                        <CardMedia image={logo} id={'card-media-selo'}/>
                                    }
                                </div>
                                <div id={'div-selo-cartao-fidelidade-direita'}>
                                    {
                                        (fidelidade.length >= 4) &&
                                        <CardMedia image={logo} id={'card-media-selo'}/>
                                    }
                                </div>
                            </div>
                            <div id={'div-row-cartao-fidelidade'}>
                                <div id={'div-selo-cartao-fidelidade-esquerda'}>
                                    {
                                        (fidelidade.length >= 5) &&
                                        <CardMedia image={logo} id={'card-media-selo'}/>
                                    }
                                </div>
                                <div id={'div-selo-cartao-fidelidade-direita'}>
                                    {
                                        (fidelidade.length >= 6) &&
                                        <CardMedia image={logo} id={'card-media-selo'}/>
                                    }
                                </div>
                            </div>
                            <div id={'div-row-cartao-fidelidade'}>
                                <div id={'div-selo-cartao-fidelidade-esquerda'}>
                                    {
                                        (fidelidade.length >= 7) &&
                                        <CardMedia image={logo} id={'card-media-selo'}/>
                                    }
                                </div>
                                <div id={'div-selo-cartao-fidelidade-direita'}>
                                    {
                                        (fidelidade.length >= 8) &&
                                        <CardMedia image={logo} id={'card-media-selo'}/>
                                    }
                                </div>
                            </div>
                            <div id={'div-row-cartao-fidelidade'}>
                                <div id={'div-selo-cartao-fidelidade-esquerda'}>
                                    {
                                        (fidelidade.length >= 9) &&
                                        <CardMedia image={logo} id={'card-media-selo'}/>
                                    }
                                </div>
                                <div id={'div-selo-cartao-fidelidade-direita'}>
                                    {
                                        (fidelidade.length >= 10) &&
                                        <CardMedia image={logo} id={'card-media-selo'}/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </ThemeProvider>
            </div>
        )
    }
}

export default Fidelidade
