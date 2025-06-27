import React from "react";
import {
    Autocomplete,
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    Typography
} from "@mui/joy";
import useAuth from "../auth/AuthHook";
import {useLocation, useNavigate} from "react-router";
import { doRegister } from "./registerUtils";

const RegisterPage = () => {
    const {setAuth} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const onSuccess = () => {
        setAuth(true);
        navigate(from, {replace: true});
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-evenly"
                }}
            >
                <Typography level="h4">
                    Регистрация
                </Typography>
                <Box component="form"
                     onSubmit={(event) => doRegister(event, onSuccess, () => console.log("Registration failed"))}
                     sx={{mt: 1, width: '100%'}}>
                    <FormControl required sx={{ width: '100%', mb: 2 }}>
                        <FormLabel>Имя</FormLabel>
                        <Input
                            id="first_name"
                            name="first_name"
                            autoFocus
                        />
                    </FormControl>
                    <FormControl required sx={{ width: '100%', mb: 2 }}>
                        <FormLabel>Фамилия</FormLabel>
                        <Input
                            id="last_name"
                            name="last_name"
                        />
                    </FormControl>
                    <FormControl required sx={{ width: '100%', mb: 2 }}>
                        <FormLabel>Электронная почта</FormLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                        />
                    </FormControl>
                    <FormControl required sx={{ width: '100%', mb: 2 }}>
                        <FormLabel>Пароль</FormLabel>
                        <Input
                            name="password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="solid"
                        sx={{mt: 3, mb: 2}}
                    >
                        Зарегистрироваться
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;