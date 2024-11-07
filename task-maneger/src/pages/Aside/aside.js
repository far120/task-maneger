import { useContext } from "react";
import { Mycontext } from "../Auth/context";
import useTokenDecoder from "../jwt/useTokenDecoder";
import { BackEnd_url } from "../../constance";
import { Link, useNavigate } from "react-router-dom";
import './aside.css'
export default function Aside() {
  const userData = useTokenDecoder();
  const role = userData?.role;
  const avatar = userData?.avatar;
  const userid = userData?._id;
  const username = userData?.name;

  const navigate = useNavigate();
  
  const { value, setValue } = useContext(Mycontext);

  
  if (!localStorage.getItem('token') && value !== "default value") {
    localStorage.setItem('token', value);
  }
  
  if (localStorage.getItem('token') && value === "default value") {
    setValue(localStorage.getItem("token"));
  }
  function logout(){
    console.log(1)
    localStorage.removeItem('token');
    setValue("default value");
    navigate('/login');
  }
  
  return (
    <aside className="aside">
      <div className="aside-header">
        <img
          src={`${BackEnd_url}/images/${avatar}`}
          alt="User Avatar"
          className="avatar"
        />
        <h4>{username}</h4>
      </div>
      <div className="aside-nav">
        <h5>Tasks</h5>
        <ul>
          <li><Link to="/">All Tasks</Link></li>
          <li><Link to="/completed">Completed</Link></li>
          <li><Link to="/today">Today</Link></li>
          <li><Link to="/profile">Myprofile</Link></li>
          { role === "adminserver" ?(
            <li><Link to="/auth">Auth</Link></li>
          ):(
            null
          )}
        </ul>
      </div>
      <div className="aside-footer">
        {localStorage.getItem("token") ? (
          <>
          <button className="logout-btn" onClick={() =>logout()}>Logout</button>
        </>
        ) : (
          <button className="login-btn">
            <Link to="/login">Login</Link>
          </button>
        )}
      </div>
    </aside>
  );
}
