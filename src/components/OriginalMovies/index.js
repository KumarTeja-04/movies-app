import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import SlickSlider from '../SlickSlider'
import './index.css'

const failureViewImg =
  'https://res.cloudinary.com/drqsxn51c/image/upload/v1703851844/Background-Complete_vt7j9m.png'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class OriginalMovies extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    originals: [],
  }

  componentDidMount = () => {
    this.onGetOriginalsDetails()
  }

  onGetOriginalsDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const ApiUrl = 'https://apis.ccbp.in/movies-app/originals'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(ApiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        overview: eachMovie.overview,
        id: eachMovie.id,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))
      this.setState({
        originals: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderOriginalsSlider = () => {
    const {originals} = this.state
    return (
      <>
        <SlickSlider movies={originals} />
      </>
    )
  }

  renderOriginalsFailureView = () => (
    <div>
      <img src={failureViewImg} alt="failure view" />
      <p>Something went wrong. Please try again</p>
      <div>
        <button type="button" onClick={this.onRetryOriginals}>
          Try Again
        </button>
      </div>
    </div>
  )

  renderOriginalsView = () => (
    <div className="slider-container">
      <div className="slick-container">{this.renderOriginalsSlider()}</div>
    </div>
  )

  renderOriginalsItems = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderOriginalsView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderOriginalsFailureView()
      default:
        return null
    }
  }

  onRetryOriginals = () => {
    this.onGetOriginalsDetails()
  }

  render() {
    return <div className="slick-container">{this.renderOriginalsItems()}</div>
  }
}

export default OriginalMovies
