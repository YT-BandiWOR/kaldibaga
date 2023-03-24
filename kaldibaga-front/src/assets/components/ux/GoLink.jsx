import React from 'react';
import {Link} from "react-router-dom";
import useCookie from "../../hooks/useCookie.js";
import cookieNames from "../../constants/cookieNames.js";


const GoLink = (props) => {
    return (
        <Link
            onClick={() => {
                const last_site_url = window.location.pathname;
                useCookie.set(cookieNames.last_url, last_site_url, 3600 * 24 * 7);
            }}
            {...props}>{props.children}</Link>
    );
};

export default GoLink;