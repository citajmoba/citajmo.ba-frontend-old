import authHeader from "./auth-header";
import axios from "axios";
const sys = require('../config/sys.config');

const API_URL = sys.BACKEND_SERVER_URL + "/api/access/";

class AccessService {
    getPublicContent() {
        return axios.get(API_URL + "all");
    }

    getUserBoard() {
        return axios.get(API_URL + "user", { headers: authHeader()});
    }

    getContributorBoard() {
        return axios.get(API_URL + "contributor", { headers: authHeader()});
    }

    getAdminBoard() {
        return axios.get(API_URL + "admin", { headers: authHeader()});
    }
}

export default new AccessService();