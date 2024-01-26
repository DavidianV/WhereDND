import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { getSpots } from "../../store/spots";


const UserSpots = () => {
    const navigate = useNavigate()
    const allSpots = useSelector(state => state.spots);
    const spotsList = Object.values(allSpots)
    const dispatch = useDispatch()

    const userId = useSelector
    const userSpots = spotsList.filter(spot => spot.ownerId === userId)



    useEffect(() => {
        //console.log('dispatching')
        dispatch(getSpots())

    }, [dispatch])



    return (
        <>
        <h1>
            Manage Spots
        </h1>
        <button onClick={() => {navigate('/spots/new')}}>Create a New Spot</button>
        </>
        
    )
}

export default UserSpots