import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h3 className="footer-brand">TurfBook</h3>
          <p className="footer-text">Book football turfs easily and quickly.</p>
        </div>

        <div className="footer-links">
          <a href="#">Home</a>
          <a href="#">Search</a>
          <a href="#">My Bookings</a>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} TurfBook. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
