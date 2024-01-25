import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <ul className='nav-bar'>
            <li>
                <NavLink to="/">
                    <i className="fa-solid fa-dice-d20"></i>
                    <h2>WhereD&D?</h2>
                </NavLink>
            </li>
            {isLoaded && (
                <div className='navbar-right'>
                    <NavLink exact to='/spots/new' style={{textDecoration: 'none'}}>
                        Create a New Spot
                    </NavLink>
                    <li>
                        <ProfileButton user={sessionUser} />
                    </li>
                </div>
            )}
        </ul>
    );
}

export default Navigation;