import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Mycontext } from "../Auth/context";
import "./auth.css"
import {BackEnd_url}  from '../../constance';

export default function Show() {
    const { value, setValue } = useContext(Mycontext);
    const [user, setUser] = useState([]);
    const id = window.location.pathname.split('/')[2];
    console.log(id)
    useEffect(() => {
        axios.get(`${BackEnd_url}/api/authentication/${id}`,{
            headers: {
                'Authorization': ` ${value}`
            }
        })
        .then(response => {
            setUser(response.data);
        })
        .catch(error => {
            console.log(error);
        });
        
    }, [value ,id]);
    console.log(user)

    const remove = (id) => {
        axios.delete(`${BackEnd_url}/api/authentication/${id}`,{
            headers: {
                'Authorization': ` ${value}`
            }
        })
        .then(response => {
            setUser(user.filter(u => u._id!== id));
        })
        .catch(error => {
            console.log(error);
        });
    }


    return (
        <div className="auth-container">
            <h1 className="top">Auth Page</h1>
            {user ? (
                    <div className="user-card" key={user._id}>
                        <hr className="divider" />
                        <h2 className="user-id">{user._id}</h2>
                        <img className="user-image" src={`${BackEnd_url}/images/${user.avatar}`} style={{ width: "200px", height: "250px", objectFit: "cover" }} alt="User Avatar" />
                        <p className="user-name">{user.name}</p>
                        <p className="user-email">{user.email}</p>
                        <div className="button-group">
                            <button className="btn"><Link to={`/auth/${user._id}`}>Show</Link></button>
                            <button className="btn"><Link to={`/updates/${user._id}`}>Update Auth</Link></button>
                            <button className="btn delete-btn" onClick={() => remove(user._id)}>Delete</button>
                        </div>
                    </div>
                )
             : (
                <p>No users found</p>
            )}
        </div>
    );
}
