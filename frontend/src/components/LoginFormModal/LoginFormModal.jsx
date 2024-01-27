import {useState} from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                
                if (data) {
                    setErrors({data});
                } else setErrors({})
            });
            console.log('ERRRORSRORS', errors)
    };

    const handleDemo = () => {
        return dispatch(sessionActions.login({
            credential: 'demo@user.io',
            password: 'password'
        }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    }


    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                {errors.data && (
                    <p className="error-message">
                        The provided credentials were invalid.
                    </p>
                )}
                <label>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                {errors.credential && (
                    <p>{errors.credential}</p>
                )}
                <button type="submit" disabled={password.length < 6 || credential.length < 4}>Log In</button>
            </form>
            <button onClick={handleDemo}>Log in as Demo User</button>
        </>
    );
}

export default LoginFormModal;
