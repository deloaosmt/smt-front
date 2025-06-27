// Mock host configuration for development
export const absoluteUrl = (path: string): string => {
    // For now, return a mock URL - you can replace this with your actual API base URL
    return `http://localhost:3000${path}`;
}; 