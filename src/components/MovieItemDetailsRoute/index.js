import {Component} from 'react'
import {format} from 'date-fns'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import MoviesItem from '../MoviesItem'
import './index.css'

const failureViewImg =
  'https://res.cloudinary.com/drqsxn51c/image/upload/v1703851844/Background-Complete_vt7j9m.png'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MovieItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    movieDataDetails: [],
    genresList: [],
    similarMoviesData: [],
    spokenLanguagesList: [],
  }

  componentDidMount() {
    this.getMovieDataDetails()
  }

  getMovieDataDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const movieItemDetailsApiUrl = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(movieItemDetailsApiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = [data.movie_details].map(eachMovie => ({
        id: eachMovie.id,
        adult: eachMovie.adult,
        backdropPath: eachMovie.backdrop_path,
        budget: eachMovie.budget,
        overview: eachMovie.overview,
        posterPath: eachMovie.poster_path,
        releaseDate: eachMovie.release_date,
        runtime: eachMovie.runtime,
        title: eachMovie.title,
        ratingAverage: eachMovie.vote_average,
        ratingCount: eachMovie.vote_count,
      }))
      const genresData = data.movie_details.genres.map(eachGenre => ({
        id: eachGenre.id,
        name: eachGenre.name,
      }))
      const similarMoviesList = data.movie_details.similar_movies.map(
        eachSimilar => ({
          id: eachSimilar.id,
          posterPath: eachSimilar.poster_path,
          title: eachSimilar.title,
        }),
      )
      const spokenLanguagesData = data.movie_details.spoken_languages.map(
        eachLanguage => ({
          id: eachLanguage.id,
          language: eachLanguage.english_name,
        }),
      )
      this.setState({
        apiStatus: apiStatusConstants.success,
        movieDataDetails: updatedData,
        similarMoviesData: similarMoviesList,
        genresList: genresData,
        spokenLanguagesList: spokenLanguagesData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickRetry = () => {
    this.getMovieDataDetails()
  }

  renderMovieItemFailureView = () => (
    <div>
      <img src={failureViewImg} alt="failure view" />
      <h1>Something went wrong. Please try again</h1>
      <div>
        <button type="button" onClick={this.onClickRetry}>
          Try Again
        </button>
      </div>
    </div>
  )

  renderMovieItemLoadingView = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {
      movieDataDetails,
      similarMoviesData,
      genresList,
      spokenLanguagesList,
    } = this.state
    const randomMovie = {...movieDataDetails[0]}
    const {
      adult,
      backdropPath,
      budget,
      overview,
      releaseDate,
      runtime,
      title,
      ratingAverage,
      ratingCount,
    } = randomMovie

    const hours = Math.floor(runtime / 60)
    const minutes = runtime % 60
    const movieRuntime = `${hours}h ${minutes}m `
    const censorCertificate = adult ? 'A' : 'U/A'
    const releaseYear = format(new Date(releaseDate), 'yyyy')
    const movieReleaseDate = format(new Date(releaseDate), 'do MMMM Y')
    return (
      <>
        <div
          className="movie-details-container"
          style={{backgroundImage: `url(${backdropPath})`}}
        >
          <Header />
          <div className="details-top-container">
            <h1 className="title">{title}</h1>
            <div className="details">
              <p className="para">{movieRuntime}</p>
              <p className="censor">{censorCertificate}</p>
              <p className="year">{releaseYear}</p>
            </div>
            <p className="over-view">{overview}</p>
            <button type="button" className="play-btn">
              Play
            </button>
          </div>
          <div className="details-container">
            <div className="movie-details">
              <div className="information">
                <h1 className="topic-heading">Genres</h1>
                <ul className="items">
                  {genresList.map(eachGenre => (
                    <li className="list" key={eachGenre.id}>
                      <p>{eachGenre.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="information">
                <h1 className="topic-heading">Audio Available</h1>
                <ul className="items">
                  {spokenLanguagesList.map(eachLanguage => (
                    <li className="list" key={eachLanguage.id}>
                      <p>{eachLanguage.language}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="information">
                <h1 className="topic-heading">Rating Count</h1>
                <p className="list">{ratingCount}</p>
                <h1 className="topic-heading">Rating Average</h1>
                <p className="list">{ratingAverage}</p>
              </div>
              <div className="information">
                <h1 className="topic-heading">Budget</h1>
                <h1 className="list">{budget}</h1>
                <h1 className="topic-heading">Release Date</h1>
                <h1 className="list">{movieReleaseDate}</h1>
              </div>
            </div>
            <div className="details-bottom-container">
              <h1 className="second-heading">More like this</h1>
              <div className="similar-list">
                {similarMoviesData.map(eachMovie => (
                  <MoviesItem movieDetails={eachMovie} key={eachMovie.id} />
                ))}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </>
    )
  }

  renderMovieItemDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderMovieItemFailureView()
      case apiStatusConstants.inProgress:
        return this.renderMovieItemLoadingView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderMovieItemDetails()}</>
  }
}

export default MovieItemDetails
