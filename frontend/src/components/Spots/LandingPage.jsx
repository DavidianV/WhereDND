import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import { Link } from 'react-router-dom';
import './LandingPage.css'
const LandingPage = () => {
    const dispatch = useDispatch()
    const allSpots = useSelector(state => state.spots);
    console.log(allSpots)
    const spotsList = Object.values(allSpots);

    useEffect(() => {
        console.log('dispatching')
        dispatch(getSpots())

    }, [dispatch])

    return (
        <div className="spot-tiles">
            {spotsList.map((spot) => {
                return (
                    <div className="tile">
                        <Link to={`spots/${spot.id}`} className='spot-tile'>
                            <img className='spot-img' src={spot.previewImage} />
                            <div className='spot-info'>
                                <text>{spot.city}, {spot.state}</text>
                                <text className="rating">★{spot.avgRating}</text>
                            </div>
                            <div>
                                <text>${spot.price} night</text>
                            </div>
                        </Link>
                    </div>

                );


            })}
        </div>)
}

export default LandingPage;