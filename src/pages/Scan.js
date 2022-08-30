import React from 'react'
import '../styles/scan.css'
import {QrReader} from 'react-qr-reader'
import {createTheme, FormLabel, ThemeProvider} from '@mui/material'
import {mobile} from '../util'

export default function Scan(props) {

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

    const handleQrCode = value => {
        if (value !== null && value !== undefined) {
            sessionStorage.setItem('dbarbershop-codigo', value.text)
            props.history.goBack()
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <div id={'scan'}>
                <div id={'div-scan'}>
                    <div id={'div-QrReader'}>
                        <QrReader
                            delay={100}
                            constraints={mobile() ? {facingMode: 'environment'} : {facingMode: 'user'}}
                            onResult={handleQrCode}/>
                    </div>
                    <div className={'div-container'} style={{width: '90%'}}>
                        <div id={'div-botao'} onClick={() => props.history.goBack()}>
                            <FormLabel id={'label-botao'}>Cancelar</FormLabel>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}
