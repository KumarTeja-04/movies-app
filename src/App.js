import {Route, Redirect, Switch} from 'react-router-dom'
import LoginForm from './components/LoginRoute'
import Home from './components/HomeRoute'
import MovieItemDetails from './components/MovieItemDetailsRoute'
import Popular from './components/PopularRoute'
import ProtectedRoute from './components/ProtectedRoute'
import Account from './components/AccountRoute'
import NotFound from './components/NotFoundRoute'
import Search from './components/SearchRoute'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/popular" component={Popular} />
    <ProtectedRoute exact path="/search" component={Search} />
    <ProtectedRoute exact path="/account" component={Account} />
    <ProtectedRoute exact path="/movies/:id" component={MovieItemDetails} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="not-found" />
  </Switch>
)
export default App
