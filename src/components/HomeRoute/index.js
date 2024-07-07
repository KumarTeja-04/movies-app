import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import OriginalMovies from '../OriginalMovies'
import TrendingMovies from '../TrendingMovies'
import TopRatedMovies from '../TopRatedMovies'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const failureViewImg =
  'https://res.cloudinary.com/drqsxn51c/image/upload/v1703851844/Background-Complete_vt7j9m.png'

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.onGetRandomHomePagePoster()
  }

  onGetRandomHomePagePoster = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const homeApi = 'https://apis.ccbp.in/movies-app/trending-movies'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(homeApi, options)

    if (response.ok === true) {
      const Data = await response.json()
      const fetchedData = Data.results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        overview: eachMovie.overview,
        id: eachMovie.id,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))
      const randomNumber = Math.floor(Math.random() * fetchedData.length)
      const randomMovie = fetchedData[randomNumber]
      this.setState({
        randomHomePagePoster: randomMovie,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickRetry = () => {
    this.onGetRandomHomePagePoster()
  }

  renderHomePosterFailureView = () => (
    <div>
      <img src={failureViewImg} alt="failure view" />
      <p>Something went wrong. Please try again</p>
      <div>
        <button type="button" onClick={this.onClickRetry}>
          Try Again
        </button>
      </div>
    </div>
  )

  renderSuccessView = () => {
    const {randomHomePagePoster} = this.state
    const {title, backdropPath, overview} = randomHomePagePoster
    return (
      <div
        style={{
          backgroundImage: `url(${backdropPath})`,
        }}
        className="container"
      >
        <Header />
        <div className="top-container">
          <h1 className="main-heading">{title}</h1>
          <h1 className="over-view-container">{overview}</h1>
          <button type="button" className="play-btn">
            Play
          </button>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderHomePage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderHomePosterFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className="home-container">
          <div>{this.renderHomePage()}</div>
          <div className="heading-container">
            <h1 className="bottom-heading">Trending Now</h1>
          </div>
          <div>
            <TrendingMovies />
          </div>
          <div className="heading-container">
            <h1 className="bottom-heading">Top Rated</h1>
          </div>
          <div>
            <TopRatedMovies />
          </div>
          <div className="heading-container">
            <h1 className="bottom-heading">Originals</h1>
          </div>
          <div>
            <OriginalMovies />
          </div>
          <Footer />
        </div>
      </>
    )
  }
}

export default Home
