import React, {useEffect} from 'react';
import './App.css';
import {Login} from '../features/Login/Login';
import {Route, Routes, Navigate, Link} from 'react-router-dom';
import TodoLists from '../features/Todolists/TodoLists';
import {AppBar, Button, CircularProgress, LinearProgress, Toolbar, Typography} from "@mui/material";
import {useAppSelector} from "./store";
import {initializeAppTC, RequestStatusType} from "./app-reducer";
import {useDispatch} from "react-redux";
import {logoutTC} from "./auth-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {NotFound} from "../features/NotFound/NotFound";

function App() {

    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)
    const isLogin = useAppSelector<boolean>(state => state.auth.isLogin)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])


    const onClickHandler = () => {
        dispatch(logoutTC())
    }


    if (!isInitialized) return (<div style={{position: "fixed", top: "30px", textAlign: "center", width: "100%"}}>
        <CircularProgress/>
    </div>)

    return (
        <>
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <Link to={"/"} style={{ textDecoration: 'none', color: 'unset' }}><Typography variant={"h6"}>Todolists</Typography></Link>
                    {isLogin && <Button color={"inherit"} variant={"outlined"} onClick={onClickHandler}>Logout</Button>
                    }
                </Toolbar>
            </AppBar>
            <div style={{height: "10px"}}>
                {status === "loading" && <LinearProgress/>}
            </div>
            <Routes>
                <Route path={"/"} element={<TodoLists/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="404" element={<NotFound/>}/>
                <Route path="*" element={<Navigate to="/404"/>}/>
            </Routes>
            <ErrorSnackbar/>
        </>
    )
}

export default App;
