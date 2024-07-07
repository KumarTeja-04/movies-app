import {FaTwitter, FaGoogle, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <>
    <div className="end-container">
      <button type="button" className="btn">
        <FaGoogle className="icon" />
      </button>
      <button type="button" className="btn">
        <FaTwitter className="icon" />
      </button>
      <button type="button" className="btn">
        <FaInstagram className="icon" />
      </button>
      <button type="button" className="btn">
        <FaYoutube className="icon" />
      </button>
    </div>
    <p className="footer-para">Contact Us</p>
  </>
)

export default Footer
