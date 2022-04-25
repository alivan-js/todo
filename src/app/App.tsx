import React, {useEffect} from 'react';
import './App.css';
import {Login} from '../features/Login/Login';
import {Route, Routes, Navigate} from 'react-router-dom';
import TodoLists from '../features/Todolists/TodoLists';
import {AppBar, Button, CircularProgress, IconButton, LinearProgress, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {useAppSelector} from "./store";
import {initializeAppTC, RequestStatusType} from "./app-reducer";
import {useDispatch} from "react-redux";
import {logoutTC} from "./auth-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";

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
                    <IconButton edge={"start"} color={"inherit"} arial-label={"menu"}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant={"h6"}>
                        Todolists
                    </Typography>
                    {isLogin && <Button color={"inherit"} variant={"outlined"} onClick={onClickHandler}>Logout</Button>
                    }
                </Toolbar>
            </AppBar>
            {status === "loading" && <LinearProgress/>}
            <Routes>
                <Route path={"/"} element={<TodoLists/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="404" element={<div>404</div>}/>
                <Route path="*" element={<Navigate to="/404"/>}/>
            </Routes>
            <ErrorSnackbar/>
        </>
    )
}

export default App;
