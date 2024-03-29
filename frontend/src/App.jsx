import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import LandingPage from './components/Spots/LandingPage';
import SpotDetails from './components/Spots/SpotDetails'
import CreateSpot from './components/Spots/CreateSpots';
import UserSpots from './components/Spots/UserSpots';
import UpdateSpot from './components/Spots/UpdateSpot';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage/>
      }, {
        path: '/spots/:spotId',
        element: <SpotDetails />
      }, {
        path: '/spots/new',
        element: <CreateSpot />
      }, {
        path: '/spots/current',
        element: <UserSpots />
      }, {
        path: '/spots/:id/edit',
        element: <UpdateSpot />
      }
    ]
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
