import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/auth/user/cookie") // cookie auto sent
      .then((res) => {
        console.log("User:", res.data.user);
        navigate("/"); // or wherever
      })
      .catch(() => {
        navigate("/");
      });
  }, []); 

  return <h2>Logging you in...</h2>;
}

export default Success;