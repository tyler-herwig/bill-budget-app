// Helper function to handle 401 errors
export const handleUnauthorizedError = (response) => {
    if (response.status === 401) {
        return true;
    }
    return false;
};