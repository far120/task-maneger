import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; 
import './updates.css';
import { Mycontext } from '../Auth/context';
import {BackEnd_url}  from '../../constance';
import useTokenDecoder from '../jwt/useTokenDecoder';

export default function Update() {
    const id = window.location.pathname.split('/')[2];
    const userdata = useTokenDecoder();
    const role = userdata?.role;
    const { value } = useContext(Mycontext);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [show, setShow] = useState("");
    const [Role, setRole] = useState();
    const [accept, setAccept] = useState(false);

    useEffect(() => {
        axios.get(`${BackEnd_url}/api/authentication/${id}`, {
            headers: {
                'Authorization': ` ${value}`
            }
        })
        .then(response => {
            if (response.data) { // Check if response.data is defined
                const userData = response.data;
                setName(userData.name);
                setEmail(userData.email);
                setShow(userData.avatar);
                setRole(userData.role);
            } else {
                console.error('No data found in response');
                alert('No user data found');
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            const errorMessage = error.response?.data || 'An error occurred while fetching data';
            alert(errorMessage); 
        });
    }, [id, value]);

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handleRoleChange(e) {
        setRole(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setAccept(true);

        if (name === "" || email === "") {
            alert("Name and Email are required fields.");
            return; 
        }

        axios.put(`${BackEnd_url}/api/authentication/${id}`, {
            name,
            email,
            role: Role
        }, {
            headers: {
                'Authorization': ` ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            alert('User updated successfully');
            navigate('/profile');
        })
        .catch(error => {
            console.error('Error updating user:', error);
            const errorMessage = error.response?.data || 'An error occurred while updating user';
            alert(errorMessage);
        });
    }

    return (
        <div className="back-image">
            <img 
                className="user-image" 
                src={`${BackEnd_url}/images/${show}`} 
                style={{ width: "200px", height: "250px", objectFit: "cover" }} 
                alt="User Avatar" 
            />

            <div className="pa">
                <form className="forms" onSubmit={handleSubmit}>
                    <h2>Update User</h2>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        id="name"
                        onChange={handleNameChange}
                    />
                    <br />
                    {accept && name === "" && <p className="error">Name is required</p>}

                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        id="email"
                        onChange={handleEmailChange}
                    />
                    <br />
                    {accept && email === "" && <p className="error">Email is required</p>}

                    <input type="submit" value="Update" />
                </form>
            </div>
        </div>
    );
}
