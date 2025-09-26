const API_BASE_URL = import.meta.env.VITE_API_BACKEND;
const userId = localStorage.getItem('user').id;

const fetchNotifications = async () => {
    if (!userId) {
        return [];
    }

    const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}`);

    if (response.status === 401) return [];
    
    if (!response.ok) {
        throw new Error(`Failed to fetch notifications history: ${response.statusText}`);
    }

    return response.json(); 
};

export default fetchNotifications;