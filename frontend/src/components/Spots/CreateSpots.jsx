import { useState } from "react";
import { useDispatch } from "react-redux"
import { createSpot } from "../../store/spots";

const CreateSpot = () => {
    const dispatch = useDispatch();

    const [country, setCountry] = useState("");
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [price, setPrice] = useState('');
    const [previewImg, setPreviewImg] = useState('');
    const [imgOne, setImgOne] = useState("");
    const [imgTwo, setImgTwo] = useState("");
    const [imgThree, setImgThree] = useState("");
    const [imgFour, setImgFour] = useState("");

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
    const updateImgOne = (e) => setImgOne(e.target.value);
    const updateImgTwo = (e) => setImgTwo(e.target.value);
    const updateImgThree = (e) => setImgThree(e.target.value);
    const updateImgFour = (e) => setImgFour(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!lat) setLat(60.000000)
        if (!lng) setLng(-55.000000)

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
        console.log(createdSpot)
        //let spotId = createdSpot.id

        const previewImg = {
            url: previewImg,
            preview: true
        }

        let preview = await dispatch(addImage(previewImg))

    }

    return (
        <section>
            <form className="spot-form" onSubmit={handleSubmit}>
                <section>
                    <h1>Create a New Spot</h1>
                    <h3>Where's your spot located?</h3>
                    <text>Guests will only get your exact address once they've booked a reservation</text>

                    <label for='country'>Country</label>
                    <input
                        id='country'
                        placeholder="Country"
                        type='text'
                        value={country}
                        onChange={updateCountry}
                    />
                    <label for="address">Address</label>
                    <input
                        id='address'
                        placeholder="Address"
                        type='text'
                        value={address}
                        onChange={updateAddress}
                    />
                    <label for="city">City</label>
                    <input
                        id="city"
                        placeholder="City"
                        type='text'
                        value={city}
                        onChange={updateCity}
                    />
                    <label for="state">State</label>
                    <input
                        id="state"
                        placeholder="State"
                        type='text'
                        value={state}
                        onChange={updateState}
                    />
                    <label for="lat">Latitude</label>
                    <input
                        id="lat"
                        placeholder="Latitude"
                        type='text'
                        value={lat}
                        onChange={updateLat}
                    />
                    <label for="lng">Longitude</label>
                    <input
                        id="lng"
                        placeholder="Longitude"
                        type='text'
                        value={lng}
                        onChange={updateLng}
                    />
                </section>


                <section>
                    <h3>Describe your place to guests</h3>
                    <text>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood</text>
                    <input
                        placeholder="Please write at least 30 characters"
                        type='text'
                        value={description}
                        onChange={updateDescription}
                    />
                </section>

                <section>
                    <h3>Create a title for your spot</h3>
                    <text>Catch guests' attention with a spot title that highlights what makes your place special</text>
                    <input
                        placeholder="Name of your spot"
                        type='text'
                        value={name}
                        onChange={updateName}
                    />
                </section>

                <section>
                    <h3>Set a base price for your spot</h3>
                    <text>Competitive pricing can help your listing stand out and rank higher in search results</text>
                    <input
                        placeholder="Price per night (USD)"
                        type='text'
                        value={price}
                        onChange={updatePrice}
                    />
                </section>

                <section>
                    <h3>Liven up your spot with photos</h3>
                    <text>Submit a link to at least one photo to publish your spot</text>
                    <input
                        placeholder="Preview Image URL"
                        type='text'
                        value={previewImg}
                        onChange={updatePreviewImg}
                    />
                    <input
                        placeholder="Image URL"
                        type="text"
                        value={imgOne}
                        onChange={updateImgOne}
                        />
                        <input
                        placeholder="Image URL"
                        type="text"
                        value={imgTwo}
                        onChange={updateImgTwo}
                        />
                        <input
                        placeholder="Image URL"
                        type="text"
                        value={imgThree}
                        onChange={updateImgThree}
                        />
                        <input
                        placeholder="Image URL"
                        type="text"
                        value={imgFour}
                        onChange={updateImgFour}
                        />
                </section>

                <button type="submit">Create Spot</button>
            </form>
        </section>
    )
}

export default CreateSpot