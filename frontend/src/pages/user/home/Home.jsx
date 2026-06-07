import "./home.css";
import Navbar from "../../../components/user/navbar/Navbar";
import Header from "../../../components/user/header/Header";
import RecentTurfs from "../../../components/user/recentTurfs/RecentTurfs";
import Footer from "../../../components/common/footer/Footer";


const Home = () => {
  return (
    <div className="home">
      <Navbar />

      <div className="home-content">
        <Header />

        <section className="home-section">
          <RecentTurfs />
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Home