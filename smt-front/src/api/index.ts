// Mock API service to replace the original DefaultService
export const DefaultService = {
    userRegister: async (userData: {
        login: string;
        password: string;
        tg_login: string;
        city: string;
        first_name: string;
        last_name: string;
        email: string;
    }) => {
        // Mock successful registration
        console.log("Mock registration with data:", userData);
        return Promise.resolve({ success: true });
    }
}; 