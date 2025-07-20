import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    Typography,
    Alert
} from "@mui/joy";
import useAuth from "../auth/AuthHook";
import { useLocation, useNavigate } from "react-router";
import { authService } from "../api/AuthService";
import useNotification from "../notifications/hook";
import { getErrorMessage } from "../common/OnError";

const RegisterPage = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const { notifyError, notifySuccess } = useNotification();
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);
        
        const data = new FormData(event.currentTarget);
        
        const registerData = {
            email: data.get("email") as string,
            password: data.get("password") as string,
            full_name: `${data.get("first_name")} ${data.get("last_name")}`.trim() || null,
            code: data.get("code") as string || null,
        };
        
        try {
            const response = await authService.register(registerData);
            setAuth(true, response.user);
            notifySuccess('Регистрация прошла успешно');
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Registration error:", error);
            const errorMessage = getErrorMessage(error);
            setError(errorMessage);
            notifyError(errorMessage);
        } finally {
            setIsLoading(false);
        }
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
                
                {error && (
                    <Alert color="danger" sx={{ width: '100%', mt: 2 }}>
                        {error}
                    </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit} sx={{mt: 1, width: '100%'}}>
                    <FormControl required sx={{ width: '100%', mb: 2 }}>
                        <FormLabel>Имя</FormLabel>
                        <Input
                            id="first_name"
                            name="first_name"
                            autoFocus
                            disabled={isLoading}
                        />
                    </FormControl>
                    <FormControl required sx={{ width: '100%', mb: 2 }}>
                        <FormLabel>Фамилия</FormLabel>
                        <Input
                            id="last_name"
                            name="last_name"
                            disabled={isLoading}
                        />
                    </FormControl>
                    <FormControl required sx={{ width: '100%', mb: 2 }}>
                        <FormLabel>Электронная почта</FormLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            disabled={isLoading}
                        />
                    </FormControl>
                    <FormControl required sx={{ width: '100%', mb: 2 }}>
                        <FormLabel>Пароль</FormLabel>
                        <Input
                            name="password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            disabled={isLoading}
                        />
                    </FormControl>
                    <FormControl required sx={{ width: '100%', mb: 2 }}>
                        <FormLabel>Код регистрации</FormLabel>
                        <Input
                            name="code"
                            type="text"
                            id="code"
                            disabled={isLoading}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="solid"
                        sx={{mt: 3, mb: 2}}
                        disabled={isLoading}
                    >
                        {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                    </Button>
                    <Button
                        type="button"
                        fullWidth
                        variant="outlined"
                        sx={{mt: 1, mb: 2}}
                        onClick={() => navigate("/login")}
                        disabled={isLoading}
                    >
                        Уже есть аккаунт? Войти
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;