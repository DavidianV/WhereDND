import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"
import { getSpots } from "../../store/spots";


const UserSpots = () => {
    const navigate = useNavigate()
    const allSpots = useSelector(state => state.spots);
    const spotsList = Object.values(allSpots)
    const dispatch = useDispatch()

    const userId = useSelector
    const userSpots = spotsList.filter(spot => spot.ownerId === userId)

    const dispatcher = async () => {
        await dispatch(getSpots())
    }


    useEffect(() => {
        //console.log('dispatching')
        dispatcher()

    }, [dispatcher])


    const newSpotButton = <button onClick={() => { navigate('/spots/new') }}>Create a New Spot</button>

    let userSpotsGrid
    console.log(userSpots)
    
        if (userSpots) {
            return (
                <div className="landing-page">
                    <section className="spots-grid">
                        {userSpots.map((spot) => (
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
        
    } else {userSpotsGrid = <h1>No Spots Found</h1>}

    return (
        <>
            <h1>
                Manage Spots
            </h1>
            {userSpots ? userSpotsGrid : newSpotButton}
        </>

    )
}

export default UserSpots