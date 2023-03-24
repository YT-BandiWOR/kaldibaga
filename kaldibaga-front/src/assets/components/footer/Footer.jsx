import React from 'react';
import cls from './Footer.module.scss';
import footerSettings from "../../constants/footerSettings.js";
import GoLink from "../ux/GoLink.jsx";

const Footer = () => {
    const {footerText, moreText} = footerSettings;

    return (
        <div className={cls.footer}>
            <br/>
            <p>{footerText}</p>
            <GoLink to={'/more'}>{moreText}</GoLink>
        </div>
    );
};

export default Footer;