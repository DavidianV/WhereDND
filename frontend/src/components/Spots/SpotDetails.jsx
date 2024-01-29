import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotDetails } from "../../store/spots";
import { getSpotReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import NewReviewModal from "../Reviews/NewReviewModal";
import DeleteReviewModal from "../Reviews/DeleteReviewModal"
import './LandingPage.css';

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    //const state = useSelector((state) => state)

    const spot = useSelector((state) => state.spots[spotId]);
    const session = useSelector((state) => state.session)
    let userId
    if (session.user) {
        userId = session.user.id
    }
    
    const reviews = useSelector((state) => state.reviews);
    const reviewsList = Object.values(reviews);

    const [canReview, setCanReview] = useState(false);

    

    useEffect(() => {

        const runDispatches = async (spotId) => {
            await dispatch(getSpotDetails(spotId));
            await dispatch(getSpotReviews(spotId));
        }
        runDispatches(spotId)
    }, [ dispatch, spotId, canReview]);

    const refreshContent = async () => {
        await dispatch(getSpotDetails(spotId));
        await dispatch(getSpotReviews(spotId));
    }

    useEffect(() => {

        let hasReview = reviewsList.some(review => review.User.id === userId && review.spotId === spotId);
        setCanReview(!hasReview);
    }, [dispatch, reviewsList, userId, spotId, reviews]);
    //console.log('###spot###', spot)
    // const reviews = useSelector((state) => state.reviews)
    // const reviewsList = Object.values(reviews)
    //console.log(reviewsList);
    let mainImage;
    let images
    let owner

    // if (spot) {
    //     mainImage = spot.SpotImages.find(image => image.preview === true);
    //     images = spot.SpotImages.filter(image => image.preview === false);
    // }
    // console.log('SPOT', spot)
    // console.log('OWNER', spot.Owner)
    // console.log('IMAGES', spot.SpotImages)
    if (!spot || !spot.Owner) {
        return (
            <>
                <h1>
                    Loading...
                </h1>
            </>
        )
    }

    if (spot.SpotImages) {
        mainImage = spot.SpotImages.find(image => image.preview === true);
        images = spot.SpotImages.filter(image => image.preview === false);
    }

    owner = spot.Owner
    //console.log('___', spot)



    const handleReserve = () => {
        alert('Feature Coming Soon...')
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    };

    const noReviews = <h2>★ New</h2>
    const hasReviews = <h2>
        ★{spot.numReviews ? spot.avgStarRating.toFixed(2) : 'New'} &middot; {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}
    </h2>

    //console.log('---', reviews)
    // console.log('spotId', spotId)

    const filteredReviews = Object.values(reviews).filter(review => {

        review.spotId === spotId
    })

    console.log('filteredReviews', filteredReviews);

    const firstReview = <p>
        Be the first to post a review!
    </p>

    const reviewsGrid = Object.values(reviewsList).map((review, index) => (


        <div key={index} className="review">
            <h3>{review.User.firstName}</h3>
            <p>{formatDate(review.createdAt)}</p>
            <p>{review.review}</p>
            {review.User.id === userId &&
                <OpenModalButton
                    buttonText="Delete"
                    modalComponent={
                        <DeleteReviewModal
                            state={{
                                reviewId: review.id,
                                spotId
                            }}
                            onModalClose={() => refreshContent}
                        />}
                />}


        </div>
    ))

    if (spotId === userId) {
        setCanReview(false)
    }



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
                <p className="stars">{spot.numReviews ? hasReviews : noReviews}</p>
                <button onClick={handleReserve}>Reserve</button>
            </div>

            <div className="reviews-wrapper">
                {spot.numReviews ? hasReviews : noReviews}
                {canReview && <OpenModalButton
                    buttonText="Post Your Review"
                    modalComponent={<NewReviewModal spotId={spot.id} />}
                    onModalClose={() => refreshContent}
                />}
                <div className="reviews-container">
                    {spot.numReviews === 0 ? firstReview : reviewsGrid}
                </div>
            </div>



        </div >
    )
}

export default SpotDetails