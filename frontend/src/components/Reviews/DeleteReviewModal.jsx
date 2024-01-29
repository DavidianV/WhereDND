import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { getSpotReviews, removeReview } from "../../store/reviews";
import { getSpotDetails } from "../../store/spots";

const DeleteReviewModal = (data) => {
    const dispatch = useDispatch()
    const { closeModal } = useModal()


    const handleDelete = async (e) => {
        //console.log(data.state, 'is here')
        e.preventDefault()
        const res = await dispatch(removeReview(data.state.reviewId))

        dispatch(getSpotDetails(data.state.spotId)).then(() => dispatch(getSpotReviews(data.state.spotId)).then(closeModal()))

        console.log('res', res)
    
    
    
    
    
    }

    return (
        <>
            <h1>Confirm Delete</h1>
            <h3 className="confirm-delete-text">Are you sure you want to delete this review?</h3>

            <div className="buttons" >
                <button className="confirm-delete" onClick={handleDelete}>Yes (Delete Review)</button>
                <button className="cancel-delete" onClick={closeModal}>No (Keep Review)</button>
            </div>

        </>
    )
}
export default DeleteReviewModal