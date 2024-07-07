import {Link} from 'react-router-dom'
import './index.css'

const MoviesItem = props => {
  const {movieDetails} = props
  const {posterPath, title, id} = movieDetails
  return (
    <Link to={`/movies/${id}`}>
      <li>
        <img className="poster" alt={title} src={posterPath} />
      </li>
    </Link>
  )
}

export default MoviesItem
