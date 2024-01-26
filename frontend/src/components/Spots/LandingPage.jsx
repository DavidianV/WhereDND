import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import { Link } from 'react-router-dom';
import './LandingPage.css'
const LandingPage = () => {
    const dispatch = useDispatch()
    const allSpots = useSelector(state => state.spots);
    const spotsList = Object.values(allSpots);

    useEffect(() => {
        //console.log('dispatching')
        dispatch(getSpots())

    }, [dispatch])

    return (
        <div className="spot-tiles">
            {spotsList.map((spot) => {
                //console.log('###', spot)
                // return (
                //     <div className="tile">
                //         <Link to={`spots/${spot.id}`} className='spot-tile'>
                //             <img className='spot-img' src={spot.previewImage} />
                //             <div className='spot-info'>
                //                 <text>{spot.city}, {spot.state}</text>
                //                 <text className="rating">★{spot.avgRating >= 0 ? spot.avgRating : 'New'}</text>
                //             </div>
                //             <div>
                //                 <text>${spot.price} night</text>
                //             </div>
                //         </Link>
                //     </div>

                // );

                return (
                    <div className="landing-page">
                        <section className="spots-grid">
                            {spotsList.map((spot) => (
                                <Link
                                    key={spot.id}
                                    className="single-spot"
                                    to={`/spots/${spot.id}`}
                                >
                                    <div className="spot-data">
                                        <div className="image">
                                            <img
                                                className="spot-image"
                                                src={spot.previewImage}
                                                alt=""

                                            />
                                        </div>

                                        <div className="location-rating">
                                            <p id="city-state">
                                                {spot.city}, {spot.state}
                                            </p>
                                            <p id="star-rating">★ {spot.avgRating >= 0 ? spot.avgRating : 'New'}</p>
                                        </div>

                                        <p id="price">${spot.price} night</p>
                                    </div>
                                </Link>
                            ))}
                        </section>
                    </div>
                )
            })}
        </div>)
}

export default LandingPage;