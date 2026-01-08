export const BASE_URL = 'https://api.fotosfolio.com';

 export const API_PATHS = {
    AUTH: {
        LOGIN: `${BASE_URL}/user/login`,
        REGISTER: `${BASE_URL}/user/register`,
    },
    TASKS: {
        GET_ALL: `${BASE_URL}/tasks`,
        GET_BY_ID: (id: string) => `${BASE_URL}/tasks/${id}`,
        CREATE: `${BASE_URL}/tasks`,
        UPDATE:  (id: string) => `${BASE_URL}/tasks/${id}`  ,
        DELETE:  (id: string) => `${BASE_URL}/tasks/${id}`  ,  
    },
 };