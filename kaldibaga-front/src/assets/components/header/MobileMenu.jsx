import cls from './Header.module.scss';
import GoLink from "../ux/GoLink.jsx";
import LoginLink from "../ux/LoginLink.jsx";
import {useMemo} from "react";

const MobileMenu = ({
                        account=null,
                        menuState,
                        loginText,
                        elements
                    }) => {
    const authorized = useMemo(()=>account !== null, [account]);
    const [opened, setOpened] = menuState;

    if (opened) return  (
        <div className={cls.mobile_menu}>
            {
                elements.map((el, id)=>(
                    <GoLink
                        key={id}
                        to={el[1]}
                    >{el[0]}</GoLink>
                ))
            }
            <br/>
            {
                authorized?
                    (
                        <div className={cls.authorized}>
                            <GoLink to="/account">{account.username}</GoLink>
                        </div>
                    ) : (
                        <div className={cls.non_authorized}>
                            <LoginLink to="/login">{loginText}</LoginLink>
                        </div>
                    )
            }
            <h1 onClick={()=>setOpened(false)}>Скрыть</h1>
        </div>
    )
}

export default MobileMenu;