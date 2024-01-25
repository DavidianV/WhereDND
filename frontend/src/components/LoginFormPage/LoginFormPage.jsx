import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


import './LoginForm.css';

const LoginForm = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    let valid

    const updateCredential = (e) => setCredential(e.target.value);
    const updatePassword = (e) => setPassword(e.target.value);

    if (sessionUser) return <Navigate to="/" replace={true} />;

    useEffect(() => {
        valid = false

        if (credential.length >= 4 && password.length >= 6) valid = true
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password })).catch(
            async (res) => {
                const data = await res.json();
                if (data?.errors) setErrors(data.errors);
            }
        );
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder="Username or Email"
                    value={credential}
                    onChange={updateCredential}
                    required
                />
                <input
                    type="text"
                    placeholder="Password"
                    value={password}
                    onChange={updatePassword}
                    required
                />
                {errors.credential && <p>{errors.credential}</p>}
                <button disabled={!valid} type="submit">Login</button>
            </form>
        </>
    )
};

export default LoginForm;