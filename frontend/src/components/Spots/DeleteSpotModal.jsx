import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { removeSpot } from "../../store/spots"

const DeleteSpotModal = (data) => {
    const dispatch = useDispatch()
    const {closeModal} = useModal()

    const handleDelete = async (e) => {
        e.preventDefault()
        const res = await dispatch(removeSpot(data.state.spotId)).then(closeModal)
        return res
    }

    return (
        <>
            <h1>Confirm Delete</h1>
            <h3 className="confirm-delete-text">Are you sure you want to delete this spot?</h3>

            <div className="buttons" >
                <button className="confirm-delete" onClick={handleDelete}>Yes (Delete Spot)</button>
                <button className="cancel-delete" onClick={closeModal}>No (Keep Spot)</button>
            </div>

        </>
    )
}

export default DeleteSpotModal