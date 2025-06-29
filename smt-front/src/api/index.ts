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

// Export CRUD services
export {
    projectService,
    subprojectService,
    revisionService,
    fileService
} from './Services';

// Export auth service
export { authService } from './AuthService';

// Export types
export type {
    Project,
    ProjectCreate,
    ProjectUpdate,
    Subproject,
    SubprojectCreate,
    SubprojectUpdate,
    Revision,
    RevisionCreate,
    RevisionUpdate,
    File,
    FileUpload
} from './Services';

export type {
    User,
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse,
    LogoutResponse
} from '../types/user';
