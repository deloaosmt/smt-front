import {Box, Button, Checkbox, Container, FormControl, FormLabel, Input, Typography, Alert} from "@mui/joy";
import { useState } from "react";
import useAuth from "../auth/AuthHook";
import { useLocation, useNavigate } from "react-router";
import { authService } from "../api/AuthService";

const LoginPage = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);
        
        const data = new FormData(event.currentTarget);
        
        const loginData = {
            email: data.get("email") as string,
            password: data.get("password") as string
        };
        
        try {
            const response = await authService.login(loginData);
            setAuth(true, response.user);
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Login error:", error);
            setError(error instanceof Error ? error.message : "Ошибка входа. Проверьте логин и пароль.");
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
                
                {error && (
                    <Alert color="danger" sx={{ width: '100%', mt: 2 }}>
                        {error}
                    </Alert>
                )}
                
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