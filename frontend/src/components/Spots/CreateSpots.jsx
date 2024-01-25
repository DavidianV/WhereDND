import { useState } from "react";
import { useDispatch } from "react-redux"
import { createSpot } from "../../store/spots";

const CreateSpot = () => {
    const dispatch = useDispatch();

    const [country , setCountry ] = useState("");
    const [address , setAddress ] = useState('');
    const [city , setCity ] = useState('');
    const [state , setState ] = useState('');
    const [description , setDescription ] = useState('');
    const [name , setName ] = useState('');
    const [lat , setLat ] = useState('');
    const [lng , setLng ] = useState('');
    const [price , setPrice ] = useState('');
    const [previewImg, setPreviewImg ] = useState('');
    
    const updateCountry = (e) => setCountry(e.target.value)
    const updateAddress = (e) => setAddress(e.target.value)
    const updateCity = (e) => setCity(e.target.value)
    const updateState = (e) => setState(e.target.value)
    const updateDescription = (e) => setDescription(e.target.value)
    const updateName = (e) => setName(e.target.value)
    const updateLat = (e) => setLat(e.target.value)
    const updateLng = (e) => setLng(e.target.value)
    const updatePrice = (e) => setPrice(e.target.value)
    const updatePreviewImg = (e) => setPreviewImg(e.target.value)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }

        let createdSpot = await dispatch(createSpot(payload))
        let spotId = createdSpot.id

        if (previewImg) {
            const imagePayload = {
                url: previewImg,
                preview: true
            }

            await dispatch(addImage(previewImg))
        }
    }

    return (
        <section>
            <form className="spot-form" onSubmit={handleSubmit}>
                <input
                placeholder="Country"
                type='text'
                value={country}
                onChange={updateCountry}
                />
                <input
                placeholder="Address"
                type='text'
                value={address}
                onChange={updateAddress}
                />
                <input
                placeholder="City"
                type='text'
                value={city}
                onChange={updateCity}
                />
                <input
                placeholder="State"
                type='text'
                value={state}
                onChange={updateState}
                />
                <input
                placeholder="Latitude"
                type='text'
                value={lat}
                onChange={updateLat}
                />
                <input
                placeholder="Longitude"
                type='text'
                value={lng}
                onChange={updateLng}
                />
                <input
                placeholder="Please write at least 30 characters"
                type='text'
                value={description}
                onChange={updateDescription}
                />
                <input
                placeholder="Name of your spot"
                type='text'
                value={name}
                onChange={updateName}
                />
                <input
                placeholder="Price per night (USD)"
                type='text'
                value={price}
                onChange={updatePrice}
                />
                <input
                placeholder="Preview Image URL"
                type='text'
                value={previewImg}
                onChange={updatePreviewImg}
                />
                <button type="submit">Create Spot</button>
            </form>
        </section>
    )
}

export default CreateSpot