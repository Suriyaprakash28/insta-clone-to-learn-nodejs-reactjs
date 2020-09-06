/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";

const NavBar = () => {
  const searchModal = useRef(null);
  const dott = useRef(null);
  const [search, setSearch] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState([]);
  const history = useHistory();
  useEffect(() => {
    M.Modal.init(searchModal.current);
    M.Modal.init(dott.current)
  }, []);
  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <i
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{ color: "black" }}
          >
            search
          </i>
        </li>,
        
          <li key="2" className="something">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3" className="something">
          <Link to="/createpost">Createpost</Link>
        </li>,
        <li key="4" className="something">
          <Link to="/myfollowingpost">My following post</Link>
        </li>,
          <li className="something">
          <button
            className="btn red"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
              
            }}
          >
            Logout
          </button>
          </li>,
        <li key="5">
          <i
            data-target="modal2"
            id="vertical"
            className="material-icons modal-trigger"
            style={{ color: "black" }}
          >
            more_vert
          </i>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/signin">Login</Link>
        </li>,
        <li key="7">
          <Link to="/signup">Sign up</Link>
        </li>,
      ];
    }
  };
  const fetchUsers = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setUserDetails(results.user);
      });
  };

  return (
    <nav>
      
      <div className="nav-wrapper white">

        <div className="brand-logo">
        <Link to={state ? "/" : "/signin"}>
          Instagram
        </Link>
        </div>
        <div className="right">
        <ul id="nav-mobile" >
          {renderList()}
        </ul>
        </div>
      </div>
      <div id="modal2" className="modal" ref={dott} style={{color:"black"}}>
        <div className="modal-content" onClick={()=>{
              M.Modal.getInstance(dott.current).close();}}>
        <ul>
          
        <li key="2">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/createpost">Createpost</Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingpost">My following post</Link>
        </li>,
          <li>
          <button
            className="btn red"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
              
            }}
          >
            Logout
          </button>
          </li>
        </ul>
        </div>
      </div>

      <div
        id="modal1"
        className="modal"
        ref={searchModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <ul className="collection">
            {userDetails.map((item) => {
              return (
                <Link
                  to={
                    item._id !== state._id ? "/profile/" + item._id : "/profile"
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch("");
                  }}
                >
                  <li className="collection-item">{item.email}</li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => {
              setSearch("");
            }}
          >
            close
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
