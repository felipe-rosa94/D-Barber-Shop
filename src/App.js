import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from './pages/Home'
import Agendar from './pages/Agendar'
import Dashbord from './pages/Dashbord'
import Fidelidade from './pages/Fidelidade'
import Relatorios from './pages/Relatorios'
import Scan from './pages/Scan'

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/agendar' component={Agendar}/>
                <Route exact path='/dashbord' component={Dashbord}/>
                <Route exact path='/fidelidade' component={Fidelidade}/>
                <Route exact path='/relatorios' component={Relatorios}/>
                <Route exact path='/scan' component={Scan}/>
            </Switch>
        </BrowserRouter>
    )
}

export default App
