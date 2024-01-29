import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"
import { getSpots } from "../../store/spots";
import './LandingPage.css'
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpotModal from "./DeleteSpotModal";


const UserSpots = () => {
    console.log('checkpoint')
    const navigate = useNavigate()
    const allSpots = useSelector(state => state.spots);
    const spotsList = Object.values(allSpots)
    const dispatch = useDispatch()

    const userId = useSelector((state) => state.session.user.id)
    const userSpots = spotsList.filter(spot => spot.ownerId === userId)



    useEffect(() => {
        //console.log('dispatching')


        const dispatcher = async () => {
            await dispatch(getSpots())
        }

        dispatcher()

    }, [dispatch,])


    //const newSpotButton = <button onClick={() => { navigate('/spots/new') }}>Create a New Spot</button>

    let content
    console.log('good day', userSpots)

    if (userSpots.length) {
        content = <div className="landing-page">
            <section className="spots-grid">
                {userSpots.map((spot) => (
                    <>
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
                                <p id="star-rating">★ {spot.avgRating >= 0 ? spot.avgRating.toFixed(2) : 'New'}</p>
                            </div>

                            <p id="price">${spot.price} night</p>
                        </div>
                    </Link>
                    <OpenModalButton
                    buttonText='Delete'
                    modalComponent={
                        <DeleteSpotModal
                        state={{
                            spotId: spot.id
                        }}
                        />
                    }
                    />
                        <button onClick={() => { navigate(`/spots/${spot.id}/edit`) }}>Update</button>
                    
                    </>
                ))}
            </section>
        </div>
    } else {
        content = <button onClick={() => { navigate('/spots/new') }}>Create a New Spot</button>
    }
console.log('made it here')
return (
    <div className="manage-spots">
        <h1>
            Manage Spots
        </h1>
        {content}
    </div>

)
}

export default UserSpots