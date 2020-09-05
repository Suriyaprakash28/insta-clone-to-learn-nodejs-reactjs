import React,{useState,useContext} from "react";
import { Link, useHistory } from "react-router-dom";


import M from 'materialize-css'
const Reset = () => {
  const History = useHistory();
  const [email, setEmail] = useState("");

  const PostData = () => {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      M.toast({
        html: "Invalid Email",
        classes: "#e53935 red darken-1",
      });
      return
    }
    fetch("/resetpassword", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email
      }),
    })
      .then((res) => res.json())
      .then(data => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
        } else {
          M.toast({ html: data.message, classes: "#43a047 green darken-1" });
          History.push("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={()=>PostData()}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Reset;
