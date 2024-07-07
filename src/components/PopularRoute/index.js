import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import MoviesItem from '../MoviesItem'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const failureViewImg =
  'https://res.cloudinary.com/drqsxn51c/image/upload/v1703851844/Background-Complete_vt7j9m.png'

class Popular extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    popularMovies: [],
  }

  componentDidMount = () => {
    this.getPopularMovies()
  }

  getPopularMovies = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/movies-app/popular-movies'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: `GET`,
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        id: eachMovie.id,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))
      this.setState({
        popularMovies: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderPopularMovies = () => {
    const {popularMovies} = this.state
    return (
      <ul className="popular-movies-container">
        {popularMovies.map(eachMovie => (
          <MoviesItem movieDetails={eachMovie} key={eachMovie.id} />
        ))}
      </ul>
    )
  }

  onRetryPage = () => {
    this.getPopularMovies()
  }

  renderFailureView = () => (
    <div>
      <img src={failureViewImg} alt="failure view" />
      <h1>Something went wrong. Please try again</h1>
      <div>
        <button type="button" onClick={this.onRetryPage}>
          Try Again
        </button>
      </div>
    </div>
  )

  renderAllMovies = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPopularMovies()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="popular-container">
        <Header />
        <div>
          {this.renderAllMovies()}
          <Footer />
        </div>
      </div>
    )
  }
}

export default Popular
