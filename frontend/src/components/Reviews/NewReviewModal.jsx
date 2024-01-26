import { useEffect, useState } from "react"
import { useModal } from "../../context/Modal"
import { newReview } from "../../store/reviews"
import './Reviews.css'


const NewReviewModal = ({ spotId }) => {


    const [review, setReview] = useState("")
    const [rating, setRating] = useState("")
    const [errors, setErrors] = useState("")

    const { closeModal } = useModal()


    const updateReview = (e) => setReview(e.target.value)
    const updateRating = (e) => setRating(e.target.value)
    let submitted
    let canReview

    useEffect(() => {
        submitted = false
        canReview = false
    }, []);

    const handleSubmit = (e) => {
        console.log("Submitting")
        e.preventDefault()
        submitted = true
        closeModal()
    }

    const handleStarHover = (hoveredRating) => {
        setRating(hoveredRating);
    };

    const handleStarClick = (clickedRating) => {
        setRating(clickedRating);
    };

    return (
        <>
            <h1>How was your stay?</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="text"
                        value={review}
                        onChange={updateReview}
                        placeholder="Leave your review here..."
                        required
                    />
                </label>
                {review.length < 10 && submitted && (
                    <p className="error-message">
                        {"Review must be at least 10 characters"}
                    </p>
                )}
                <label>
                    Stars
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= rating ? 'filled' : ''}`}
                                onMouseEnter={() => handleStarHover(star)}
                                onClick={() => handleStarClick(star)}
                            >
                                &#9733; {/* Unicode star character */}
                            </span>
                        ))}
                    </div>
                </label>
                {(rating === "" || rating === null) && submitted && (
                    <p className="error-message">
                        {"Please leave a rating"}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={review.length < 10 || rating === "" || rating === null}
                >
                    Submit your Review
                </button>
            </form>
        </>
    )
}

export default NewReviewModal