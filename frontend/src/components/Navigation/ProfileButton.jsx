import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './Navigation.css'
import { NavLink, useNavigate } from 'react-router-dom';
import { getSpots } from '../../store/spots';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const navigate = useNavigate()
    const allSpots = useSelector(state => state.spots);
    const spotsList = Object.values(allSpots)
    console.log('###', spotsList)



    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
        const dropdown = ulRef.current;
        dropdown.classList.toggle('active');
    };

    useEffect(() => {
        dispatch(getSpots())

        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu, dispatch]);

    const closeMenu = () => setShowMenu(false);

    const manageButton = <button onClick={() => { navigate('/spots/current') }}>Manage Spots</button>
    const newSpotButton = <button onClick={() => { navigate('/spots/new') }}>Create a New Spot</button>


    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu()
        navigate('/')
    };
    let hasSpot
    useEffect(() => {
        hasSpot = false
    }, []);
    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    console.log(spotsList)
    {
        if (user) {
        spotsList.forEach((spot) => {
            if(spot.ownerId === user.id)
            hasSpot = true
        })
        
    }}

    return (
        <div>
            <button className='profile-button' onClick={toggleMenu}>
                <i className="fa-solid fa-bars" />
                <i className="fas fa-user-circle" />
            </button>
            <ul className={ulClassName} ref={ulRef} hidden={!showMenu}>
                {user ? (
                    <div className='dropdown'>
                        <li>Hello, {user.firstName}</li>
                        <li>{user.email}</li>
                        <li>
                            {manageButton}
                        </li>
                        <li>
                            <button onClick={logout}>Log Out</button>
                        </li>
                    </div>
                ) : (
                    <div className='dropdown'>
                        <li>
                            <OpenModalButton
                                buttonText="Log In"
                                onButtonClick={closeMenu}
                                modalComponent={<LoginFormModal />}
                                className='dropdown-button'
                            />
                        </li>
                        <li>
                            <OpenModalButton
                                buttonText="Sign Up"
                                onButtonClick={closeMenu}
                                modalComponent={<SignupFormModal />}
                                className='dropdown-button'
                            />
                        </li>
                        <li className='manage-spots'>
                            <NavLink exact to='/spots/current' />
                        </li>
                    </div>
                )}
            </ul>
        </div>
    );
}

export default ProfileButton;
