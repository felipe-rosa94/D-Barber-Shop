import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from './pages/Home'
import Agendar from './pages/Agendar'
import Dashbord from './pages/Dashbord'

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/agendar' component={Agendar}/>
                <Route exact path='/dashbord' component={Dashbord}/>
            </Switch>
        </BrowserRouter>
    )
}

export default App