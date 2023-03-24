const backEndpoints = {
    url: `http://localhost:3001`,

    register: `/register`,
    login: `/login`,
    refreshToken: `/refresh`,
    me: `/me`,

    article_create: '/article/create',
    article_list: '/article/list',
}

const requests_without_tokens = [
    backEndpoints.url+backEndpoints.login,
    backEndpoints.url+backEndpoints.register
]

export default backEndpoints;
export {requests_without_tokens};