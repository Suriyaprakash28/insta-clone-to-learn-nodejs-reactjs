import React,{useState,useContext} from "react";
import { Link, useHistory ,useParams} from "react-router-dom";


import M from 'materialize-css'
const Newpassword = () => {
  const History = useHistory();
  const [password, setPassword] = useState("");
    const {token}=useParams()
  const PostData = () => {
   
    fetch("/newpassword", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token
      }),
    })
      .then((res) => res.json())
      .then(data => {
          console.log(data);
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
          type="password"
          placeholder="enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={()=>PostData()}>
          update
        </button>
      </div>
    </div>
  );
};

export default Newpassword;
