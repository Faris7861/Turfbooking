import "./turf.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/user/navbar/Navbar";
import Footer from "../../../components/common/footer/Footer";
import MailList from "../../../components/user/mailList/MailList";
import SlotModal from "../../../components/user/slotModal/SlotModal";
import useFetch from "../../../hooks/useFetch";

const Turf = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, loading, error } = useFetch(`/api/turfs/${id}`);

  const photos = data?.images || [];

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    const lastIndex = photos.length - 1;

    let newSlideNumber =
      direction === "l"
        ? slideNumber === 0
          ? lastIndex
          : slideNumber - 1
        : slideNumber === lastIndex
        ? 0
        : slideNumber + 1;

    setSlideNumber(newSlideNumber);
  };

  if (loading) return <p>Loading turf...</p>;
  if (error) return <p>Failed to load turf</p>;

  return (
    <div>
      <Navbar />

      <div className="turfContainer">
        {open && photos.length > 0 && (
          <div className="slider">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="close"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="arrow"
              onClick={() => handleMove("l")}
            />
            <div className="sliderWrapper">
              <img
                src={photos[slideNumber]}
                alt=""
                className="sliderImg"
              />
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="arrow"
              onClick={() => handleMove("r")}
            />
          </div>
        )}

        {modalOpen && (
          <SlotModal turfId={id} userId={user?.id} onClose={() => setModalOpen(false)} />
        )}

        <div className="turfWrapper">
          <button className="checkNow" onClick={() => setModalOpen(true)}>
            Check Availability!
          </button>

          <h1 className="turfTitle">{data.name}</h1>

          <div className="turfAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{data.city}</span>
          </div>

          <span className="turfDistance">
            Excellent location
          </span>

          <span className="turfPriceHighlight">
            Book a slot and enjoy the game!
          </span>

          <div className="turfImages">
            {photos.map((img, i) => (
              <div className="turfImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={img}
                  alt=""
                  className="turfImg"
                />
              </div>
            ))}
          </div>

          <div className="turfDetails">
            <div className="turfDetailsTexts">
              <h1>Play Now!</h1>
              <p className="turfDesc">{data.description}</p>
            </div>

            <div className="turfDetailsPrice">
              <h1>Perfect for a 1-hour play!</h1>
              <h2>
                <b>₹{data.price}</b> (1 hour)
              </h2>
              <button onClick={() => setModalOpen(true)}>
                Reserve or Book Now!
              </button>
            </div>
          </div>
        </div>

        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Turf;
