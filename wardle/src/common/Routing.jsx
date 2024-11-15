import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserCreate from '../profile/UserCreate'
/*import UserInfo from '../profile/UserInfo'*/
import Rules from '../about_game/Rules'
import About from '../about_game/About' 
import MainPage from './MainPage'
import Room from '../game/Room'
import Board from '../game/Board'
import Login from '../profile/Login'

export default function Routing() {
    return (
        <>
        <Router>
            <Routes>
                <Route path={'/'} element={<MainPage/>}/>
                <Route path={'/rules'} element={<Rules/>}/>
                <Route path={'/room'} element={<Room/>}/>
                <Route path={'/room/board'} element={<Board/>}/>
                <Route path={'/register'} element={<UserCreate/>}/>
                <Route path={'/about'} element={<About/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path="/sala/:salaId/:playerId/adivinar-palabra" element={<Board />} />
            </Routes>
        </Router>
        </>
    )
}

/*
<Route path={'/register'} element={<UserCreate/>}/>
<Route path={'/user/:id'} element={<UserInfo/>}/>
*/