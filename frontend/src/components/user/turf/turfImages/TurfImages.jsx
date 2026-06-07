import "./turfImages.css";

const TurfImages = ({ images }) => {
  return (
    <div className="turf-images">
      <img src={images[0]} alt="main" className="turf-main-img" />
      <div className="turf-thumbnails">
        {images.slice(1).map((img, i) => (
          <img key={i} src={img} alt="thumb" className="turf-thumb-img" />
        ))}
      </div>
    </div>
  );
};

export default TurfImages;
