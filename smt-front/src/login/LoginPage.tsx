import {Box, Button, Checkbox, Container, FormControl, FormLabel, Input, Typography} from "@mui/joy";
import useAuth from "../auth/AuthHook";
import {useLocation, useNavigate} from "react-router";

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, onSuccess: VoidFunction, onError: VoidFunction) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    // Mock login API call
    const loginData = {
        login: data.get("email") as string,
        password: data.get("password") as string
    };
    
    console.log("Mock login attempt with:", loginData);
    
    // Simulate API call delay
    setTimeout(() => {
        // Mock successful login (you can change this logic)
        if (loginData.login && loginData.password) {
            onSuccess();
        } else {
            onError();
        }
    }, 500);
};

const LoginPage = () => {
    const {setAuth} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

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
                <Box component="form" onSubmit={
                    (event) => handleSubmit(
                        event,
                        () => {
                            setAuth(true);
                            navigate(from, {replace: true});
                        },
                        () => {
                            console.log("Ошибка");
                        },
                    )
                } noValidate sx={{mt: 1, width: '100%'}}>
                    <FormControl required sx={{ width: '100%', mb: 2 }}>
                        <FormLabel>Логин или почта</FormLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            autoFocus
                        />
                    </FormControl>
                    <FormControl required sx={{ width: '100%', mb: 2 }}>
                        <FormLabel>Пароль</FormLabel>
                        <Input
                            name="password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                    </FormControl>
                    <Box sx={{ mb: 2 }}>
                        <Checkbox label="Запомнить меня" />
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="solid"
                        sx={{mt: 3, mb: 2}}
                    >
                        Войти
                    </Button>
                    <Button
                        type="button"
                        fullWidth
                        variant="outlined"
                        sx={{mt: 1, mb: 2}}
                        onClick={() => navigate("/register")}
                    >
                        Зарегистрироваться
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;