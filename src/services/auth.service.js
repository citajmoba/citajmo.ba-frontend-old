import axios from "axios";
const sys = require('../config/sys.config');

const API_URL = sys.BACKEND_SERVER_URL + "/api/auth/";

class AuthService {
    login(username, password) {
        return axios.post(API_URL + "signin", {
            "username": username,
            "password": password
        })
        
        .then(response => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            
            return response.data;
        });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(username, email, password) {
        return axios.post(API_URL + "signup", {
            "username": username,
            "email": email,
            "password": password
        });
    }
    
    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();