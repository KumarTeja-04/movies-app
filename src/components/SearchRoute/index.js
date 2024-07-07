import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import MoviesItem from '../MoviesItem'
import Header from '../Header'
import './index.css'

const failureViewImg =
  'https://res.cloudinary.com/drqsxn51c/image/upload/v1703851844/Background-Complete_vt7j9m.png'

const searchNotFoundImg =
  'https://res.cloudinary.com/drqsxn51c/image/upload/v1704614771/Group_7394_kmw3us.png'

const search = true

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Search extends Component {
  state = {
    postersData: [],
    apiStatus: apiStatusConstants.initial,
    searchValue: '',
  }

  componentDidMount = () => {
    this.onGetPostersDetails()
  }

  onGetPostersDetails = async searchValue => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const postersApiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchValue}`
    const optionsPosters = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const responsePosters = await fetch(postersApiUrl, optionsPosters)

    if (responsePosters.ok === true) {
      const fetchedDataPosters = await responsePosters.json()
      const updatedDataPosters = fetchedDataPosters.results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        id: eachMovie.id,
        overview: eachMovie.overview,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))
      this.setState({
        postersData: updatedDataPosters,
        apiStatus: apiStatusConstants.success,
        searchValue,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  onRetryPosters = () => {
    this.onGetPostersDetails()
  }

  onGetPostersFailureView = () => (
    <div>
      <img src={failureViewImg} alt="failure view" />
      <h1>Something went wrong. Please try again</h1>
      <div>
        <button type="button" onClick={this.onRetryPosters}>
          Try Again
        </button>
      </div>
    </div>
  )

  onGetPostersView = () => {
    const {postersData, searchValue} = this.state
    return postersData.length > 0 ? (
      <ul className="ul-search">
        {postersData.map(eachMovie => (
          <MoviesItem movieDetails={eachMovie} key={eachMovie.id} />
        ))}
      </ul>
    ) : (
      <div>{searchValue ? this.renderNoSearchResult() : null}</div>
    )
  }

  renderNoSearchResult = () => {
    const {searchValue} = this.state
    return (
      <div className="no-results">
        <img src={searchNotFoundImg} className="failure-img" alt="no-movies" />
        <p className="no-results-para">
          Your search for {searchValue} did not find any matches.
        </p>
      </div>
    )
  }

  renderPosterItems = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onGetPostersView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.onGetPostersFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="search-main-container">
        <Header
          search={search}
          onGetPostersDetails={this.onGetPostersDetails}
        />
        <div className="search-result-container">
          {this.renderPosterItems()}
        </div>
      </div>
    )
  }
}

export default Search
