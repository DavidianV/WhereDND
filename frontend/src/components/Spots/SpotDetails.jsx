import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { getSpotDetails, getSpots } from "../../store/spots";
import './LandingPage.css'
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import NewReviewModal from "../Reviews/NewReviewModal";

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();

    const spot = useSelector((state) => state.spots[spotId]);

    //console.log(spot, '###')

    useEffect(() => {
        dispatch(getSpotDetails(spotId));
    }, [dispatch, spotId]);
    //console.log('###spot###', spot)

    let mainImage
    let images
    let owner

    // if (spot) {
    //     mainImage = spot.SpotImages.find(image => image.preview === true);
    //     images = spot.SpotImages.filter(image => image.preview === false);
    // }
    if (!spot || !spot.Owner || !spot.SpotImages) {
        return (
            <>
                <h1>
                    Loading...
                </h1>
            </>
        )
    } else if (spot.SpotImages) {
        mainImage = spot.SpotImages.find(image => image.preview === true);
        images = spot.SpotImages.filter(image => image.preview === false);
        owner = spot.Owner
        console.log('___', spot)
    }

    const handleReserve = () => {
        alert('Feature Coming Soon...')
    }

    const handleReview = () => {

    }
    const noReviews = <h2>★ New</h2>
    const hasReviews = <h2>
        ★{spot.numReviews ? spot.avgStarRating : 'New'} &middot; {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}
    </h2>

    //console.log('---', spot)
    return (
        <div className="details-wrapper">
            <h1>{spot.name}</h1>
            <div className="location">{spot.city}, {spot.state}, {spot.country}</div>
            <div className="main-image-wrapper">
                {mainImage && <img className='main-image' src={mainImage.url} alt='Spot Photo' />}
            </div>

            <div className="images-wrapper">
                {images && images[0] && <img className="image-1" src={images[0].url} alt='Spot Photo 1' />}
                {images && images[1] && <img className="image-2" src={images[1].url} alt='Spot Photo 2' />}
                {images && images[2] && <img className="image-3" src={images[2].url} alt='Spot Photo 3' />}
                {images && images[3] && <img className="image-4" src={images[3].url} alt='Spot Photo 4' />}
            </div>


            <div className="info-wrapper">
                <h1>Hosted by {owner.firstName} {owner.lastName}</h1>
                <p>{spot.description}</p>
            </div>

            <div className="callout-info">
                <h2 className="price">${spot.price}/night</h2>
                <text className="stars">{spot.numReviews ? hasReviews : noReviews}</text>
                <button onClick={handleReserve}>Reserve</button>
            </div>

            <div className="reviews-wrapper">
                {spot.numReviews ? hasReviews : noReviews}
                <OpenModalButton
                    buttonText="Post Your Review"
                    modalComponent={<NewReviewModal spotId={spot.id} />}
                />
                {spot.numReviews === 0 && <text>Be the first to post a review!</text>}
            </div>



        </div>
    )
}

export default SpotDetails