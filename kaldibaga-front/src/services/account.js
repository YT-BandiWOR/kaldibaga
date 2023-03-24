import getResponse from "./getResponse.js";
import backEndpoints from "../assets/constants/backEndpoints.js";

const get = (responseState, loadedState, errorState) => {
    getResponse(backEndpoints.url+backEndpoints.me, responseState, loadedState, errorState, {});
}

const login = (responseState, loadedState, errorState, username, password) => {
    getResponse(backEndpoints.url+backEndpoints.login, responseState, loadedState, errorState, {username, password});
}

const register = (responseState, loadedState, errorState, email, username, password) => {
    getResponse(backEndpoints.url+backEndpoints.register, responseState, loadedState, errorState, {email, username, password});
}

const account = {
    get,
    login,
    register
}

export default account;