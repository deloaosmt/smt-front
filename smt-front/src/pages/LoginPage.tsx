import {Box, Button, Checkbox, Container, FormControl, FormLabel, Input, Typography} from "@mui/joy";
import { useState } from "react";
import useAuth from "../auth/AuthHook";
import { useLocation, useNavigate } from "react-router";
import { authService } from "../api/AuthService";
import useNotification from "../notifications/hook";
import { getErrorMessage } from "../common/OnError";

const LoginPage = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const { notifyError, notifySuccess } = useNotification();
    
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        
        const data = new FormData(event.currentTarget);
        
        const loginData = {
            email: data.get("email") as string,
            password: data.get("password") as string
        };
        
        try {
            const response = await authService.login(loginData);
            setAuth(true, response.user);
            notifySuccess('Успешный вход в систему');
            navigate(from, { replace: true });
        } catch (error) {
            notifyError(getErrorMessage(error));
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
                }}
            >
                <Typography level="h4">
                    Авторизация
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1, width: '100%'}}>
                    <FormControl required sx={{ width: '100%', mb: 2 }}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            autoFocus
                            disabled={isLoading}
                        />
                    </FormControl>
                    <FormControl required sx={{ width: '100%', mb: 2 }}>
                        <FormLabel>Пароль</FormLabel>
                        <Input
                            name="password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                    </FormControl>
                    <Box sx={{ mb: 2 }}>
                        <Checkbox label="Запомнить меня" disabled={isLoading} />
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="solid"
                        sx={{mt: 3, mb: 2}}
                        disabled={isLoading}
                    >
                        {isLoading ? "Вход..." : "Войти"}
                    </Button>
                    <Button
                        type="button"
                        fullWidth
                        variant="outlined"
                        sx={{mt: 1, mb: 2}}
                        onClick={() => navigate("/register")}
                        disabled={isLoading}
                    >
                        Зарегистрироваться
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;