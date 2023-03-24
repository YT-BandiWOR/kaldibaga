import storageNames from "../assets/constants/storageNames.js";
import backEndpoints, {requests_without_tokens} from "../assets/constants/backEndpoints.js";
import useCookie from "../assets/hooks/useCookie.js";
import cookieNames from "../assets/constants/cookieNames.js";
import useStorage from "../assets/hooks/useStorage.js";
import axios from "axios";
import requestSettings from "../assets/constants/requestSettings.js";
const refreshUrl = backEndpoints.url+backEndpoints.refreshToken;

const getTokens = () => {
    return {
        access: useCookie.get(cookieNames.access_token),
        refresh: useStorage.get(storageNames.refresh_token)
    };
}

const doRefresh = async () => {
    const refreshToken = getTokens().refresh;
    if (!refreshToken) {
        throw Error(requestSettings.emptyRefreshToken);
    }
    const response = await axios.post(refreshUrl, {refreshToken});
    return response.data.accessToken;
}

const sendPostRequest = async (url, body, headers, [isLoaded, setIsLoaded], [response, setResponse], [_, setError]) => {
    try {
        const server_response = await axios.post(url, body, {
            headers:headers
        });
        setIsLoaded(true);
        setResponse(server_response);

    } catch (e) {
        setIsLoaded(true);
        setError(e);
        console.error('er', e);
    }
}

const request = (url, [response, setResponse], [isLoaded, setIsLoaded], [error, setError], body={}, _headers={}) => {
    const request_func = async () => {
        const {access, refresh} = getTokens();

        if (access !== null && (!(requests_without_tokens.includes(url)))) {
            const headers = {
                ..._headers,
                Authorization: `${requestSettings.authorizationFormat} ${access}`,
            }
            await sendPostRequest(url, body, headers,
                [isLoaded, setIsLoaded],
                [response, setResponse],
                [error, setError]);
        } else if (refresh !== null && (!(requests_without_tokens.includes(url)))) {
            try {
                const new_access = await doRefresh();
                const exp_time = useCookie.getExpTime(new_access);
                useCookie.set(cookieNames.access_token, new_access, exp_time);

                const headers = {
                    ..._headers,
                    Authorization: `${requestSettings.authorizationFormat} ${new_access}`,
                }

                await sendPostRequest(url, body, headers,
                    [isLoaded, setIsLoaded],
                    [response, setResponse],
                    [error, setError]);
            } catch (e) {
                setIsLoaded(true);
                setError(request.refreshTokenError);
            }
        } else {
            await sendPostRequest(url, body, {..._headers},
                [isLoaded, setIsLoaded],
                [response, setResponse],
                [error, setError]);
        }
    }

    request_func();
}

export default request;