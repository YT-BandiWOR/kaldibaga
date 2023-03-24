import getResponse from "./getResponse.js";
import backEndpoints from "../assets/constants/backEndpoints.js";

const list = (responseState, loadedState, errorState, page, limit) => {
    getResponse(backEndpoints.url+backEndpoints.article_list, responseState, loadedState, errorState, {
        page, limit
    });
}

const create = (responseState, loadedState, errorState, title, content) => {
    getResponse(backEndpoints.url+backEndpoints.article_create, responseState, loadedState, errorState, {
        title, content
    })
}


const article = {
    list,
    create
}

export default article;