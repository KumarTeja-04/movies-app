import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const Account = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <>
      <div className="account-header">
        <Header />
      </div>
      <div className="account-container">
        <div className="heading-container">
          <h1 className="account-heading">Account</h1>
        </div>
        <hr className="line" />
        <div className="membership">
          <p className="member-para">Member ship</p>
          <div>
            <p className="username">rahul@gmail.com</p>
            <p className="password">Password : ************</p>
          </div>
        </div>
        <hr className="line" />
        <div className="plan-details">
          <p className="member-para">Plan details</p>
          <p className="username">Premium</p>
          <p className="box">Ultra HD</p>
        </div>
        <hr className="line" />
        <button type="button" className="button" onClick={onClickLogout}>
          Logout
        </button>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </>
  )
}
export default Account
