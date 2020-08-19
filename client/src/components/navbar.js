/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { Link,useHistory } from "react-router-dom";
import { UserContext } from "../App";

const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history=useHistory()
  const renderList = () => {
    if (state) {
      
      return [
        <li>
          <Link to="/profile">Profile</Link>
        </li>,
        <li>
          <Link to="/createpost">Createpost</Link>
        </li>,
        <li>
          <Link to="/myfollowingpost">My following post</Link>
        </li>,
        <li>
        <button className="btn red" onClick={()=>{
          localStorage.clear();
          dispatch({type:"CLEAR"})
          history.push('/signin')
        }}>
          Logout
        </button>
        </li>
      ];
    } else {
      return [
        <li>
          <Link to="/signin">Login</Link>
        </li>,
        <li>
          <Link to="/signup">Sign up</Link>
        </li>,
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state?"/":"/signin"} className="brand-logo">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
            {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
