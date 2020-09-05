import React, { useEffect, createContext, useReducer,useContext } from "react";
import NavBar from "./components/navbar";
import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./components/screens/Home";
import Profile from "./components/screens/profile";
import Login from "./components/screens/Login";
import Signup from "./components/screens/signup";
import Createpost from "./components/screens/Createpost";
import { reducer, initialState } from "./reducers/userReducer";
import UserProfile from './components/screens/UserProfile'
import SubscribersPosts from './components/screens/SubscribesUserPost'
import Reset from './components/screens/Reset'
import Newpassword from './components/screens/Newpassword'

export const UserContext = createContext();
const Routing = () => {
  const history = useHistory();
  const {state,dispatch}=useContext(UserContext)
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"))
    if(user)
    {
      dispatch({type:"USER",payload:user})
    }
    else{
      if(!history.location.pathname.startsWith('/reset'))
      history.push('/signin')
    }
  },[])

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/createpost">
        <Createpost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribersPosts />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <Newpassword />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer,initialState)

  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
