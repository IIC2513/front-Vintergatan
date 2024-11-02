import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserCreate from '../profile/UserCreate'
import Rules from './Rules'
import MainPage from './MainPage'
import Room from '../game/Room'
import Board from '../game/Board'

export default function Routing() {
    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<MainPage/>}/>
                <Route path={'/register'} element={<UserCreate/>}/>
                <Route path={'/rules'} element={<Rules/>}/>
                <Route path={'/room'} element={<Room/>}/>
                <Route path={'/room/board'} element={<Board/>}/>
            </Routes>
        </BrowserRouter>
        </>
    )
}