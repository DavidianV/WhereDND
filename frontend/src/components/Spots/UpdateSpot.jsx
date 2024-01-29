import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { createSpot, getSpotDetails } from "../../store/spots";
import { useNavigate, useParams } from "react-router-dom";
import { postImage } from "../../store/images";
import './LandingPage.css'

const UpdateSpot = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id} = useParams()

    

    useEffect(() => {

    const dispatcher = async () => {
            await dispatch(getSpotDetails(id))
        }

        dispatcher()
    }, [dispatch, id])
    const spot = useSelector((state) => state.spots[id]);
    

    console.log(spot)

    const [country, setCountry] = useState(`${spot.country}`);
    const [address, setAddress] = useState(`${spot.address}`);
    const [city, setCity] = useState(`${spot.city}`);
    const [state, setState] = useState(`${spot.state}`);
    const [description, setDescription] = useState(`${spot.description}`);
    const [name, setName] = useState(`${spot.name}`);
    const [lat, setLat] = useState(`${spot.lat}`);
    const [lng, setLng] = useState(`${spot.lng}`);
    const [price, setPrice] = useState(`${spot.price}`);
    const [previewImg, setPreviewImg] = useState(`${spot.preview}`);
    const [imgOne, setImgOne] = useState(``);
    const [imgTwo, setImgTwo] = useState(``);
    const [imgThree, setImgThree] = useState(``);
    const [imgFour, setImgFour] = useState(``);

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

        const payload = {
            address,
            city,
            state,
            country,
            lat: lat ? lat : 60.000000,
            lng: lng ? lng : -55.000000,
            name,
            description,
            price
        }



        let createdSpot

        createdSpot = await dispatch(createSpot(payload))

        const imageDispatcher = async (image) => {
            const payload = {
                spotId: createdSpot.id,
                image
            }
            dispatch(postImage(payload))
        }

        const mainImg = {
            url: previewImg,
            preview: true
        }
        imageDispatcher(mainImg)

        const subImages = [imgOne, imgTwo, imgThree, imgFour]
        subImages.forEach(subImg => {
            const image = {
                url: subImg,
                preview: false
            }
            imageDispatcher(image)
        })







        navigate(`/spots/${createdSpot.id}`)
        //let spotId = createdSpot.id

        //let preview = await dispatch(addImage(previewImg))

    }

    return (
        <section>
            <form className="spot-form" onSubmit={handleSubmit}>
                <h1>Update Your Spot</h1>
                <section>
                    
                    <h3>Where&apos;s your spot located?</h3>
                    <p>Guests will only get your exact address once they&apos;ve booked a reservation</p>

                    <label htmlFor='country'>Country</label>
                    <input
                        id='country'
                        placeholder="Country"
                        type='text'
                        value={country}
                        onChange={updateCountry}
                    />
                    <label htmlFor="address">Address</label>
                    <input
                        id='address'
                        placeholder="Address"
                        type='text'
                        value={address}
                        onChange={updateAddress}
                    />
                    <label htmlFor="city">City</label>
                    <input
                        id="city"
                        placeholder="City"
                        type='text'
                        value={city}
                        onChange={updateCity}
                    />
                    <label htmlFor="state">State</label>
                    <input
                        id="state"
                        placeholder="State"
                        type='text'
                        value={state}
                        onChange={updateState}
                    />
                    <label htmlFor="lat">Latitude</label>
                    <input
                        id="lat"
                        placeholder="Latitude"
                        type='text'
                        value={lat}
                        onChange={updateLat}
                    />
                    <label htmlFor="lng">Longitude</label>
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
                    <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood</p>
                    <input
                        placeholder="Please write at least 30 characters"
                        type='text'
                        value={description}
                        onChange={updateDescription}
                    />
                </section>

                <section>
                    <h3>Create a title for your spot</h3>
                    <p>Catch guests&apos; attention with a spot title that highlights what makes your place special</p>
                    <input
                        placeholder="Name of your spot"
                        type='text'
                        value={name}
                        onChange={updateName}
                    />
                </section>

                <section>
                    <h3>Set a base price for your spot</h3>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
                    <input
                        placeholder="Price per night (USD)"
                        type='text'
                        value={price}
                        onChange={updatePrice}
                    />
                </section>

                <section>
                    <h3>Liven up your spot with photos</h3>
                    <p>Submit a link to at least one photo to publish your spot</p>
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

                <button type="submit">Update Spot</button>
            </form>
        </section>
    )
}

export default UpdateSpot