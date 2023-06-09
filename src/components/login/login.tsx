import classNames from 'classnames';
import styles from './login.module.scss';
import { useEffect, useRef, useState } from 'react';
import { Configuration, FrontendApi } from '@ory/kratos-client';
import { AnchorButton } from '@blueprintjs/core';
export interface LoginProps {
    className?: string;
    children?: React.ReactNode;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const Login = ({ className, children }: LoginProps) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginUrl, setLoginUrl] = useState('');
    const api = useRef(
        new FrontendApi(
            new Configuration({
                basePath: '/.ory',
                baseOptions: { withCredentials: true },
            })
        )
    );

    const login = async () => {
        try {
            const session = await api.current.toSession();

            setLoggedIn(true);
        } catch (err) {
            const res = await api.current.createBrowserLoginFlow({
                returnTo: window.location.href,
            });
            setLoginUrl(res.data.request_url);
            setLoggedIn(false);
        }
    };

    useEffect(() => {
        login();
    }, []);
    return (
        <div className={classNames(styles.root, className)}>
            {loggedIn ? children : <AnchorButton href={loginUrl}>Login</AnchorButton>}
        </div>
    );
};
