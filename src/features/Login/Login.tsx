import FormLabel from "@mui/material/FormLabel/FormLabel"
import React from "react"
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, TextField} from "@mui/material";
import {useFormik} from 'formik';
import {useDispatch} from "react-redux";
import {loginTC} from "../../app/auth-reducer";
import {useAppSelector} from "../../app/store";
import {Navigate} from "react-router-dom";
import {LoginParamsType} from "../../api/todolist-api";

export const Login = () => {

    const isLogin = useAppSelector<boolean>(state => state.auth.isLogin)

    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            rememberMe: false
        },
        validate: (values) => {
            const errors: Partial<Omit<LoginParamsType, "captcha">> = {};

            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            if (!values.password) {
                errors.password = 'Required';
            } else if (values.password.length < 4) {
                errors.password = 'Password shall be more then 3 characters';
            }

            return errors;
        },
        onSubmit: values => {
            dispatch(loginTC(values))
            formik.resetForm()
        },
    });

    if (isLogin) return <Navigate to="/"/>

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'} rel="noreferrer"> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <form onSubmit={formik.handleSubmit}>
                    <FormGroup>
                        <TextField label="Email" margin="normal"
                                   {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email &&
                            <div style={{color: "red"}}>{formik.errors.email}</div>}
                        <TextField type="password"
                                   label="Password"
                                   margin="normal"
                                   {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password &&
                            <div style={{color: "red"}}>{formik.errors.password}</div>}
                        <FormControlLabel label={'Remember me'}
                                          control={<Checkbox
                                              {...formik.getFieldProps('rememberMe')}/>}/>
                        <Button type={'submit'}
                                variant={'contained'}
                                color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </form>
            </FormControl>
        </Grid>
    </Grid>
}
