import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {BackEnd_url}  from '../../constance';

export default function Dashboard() {
    const id = window.location.pathname.split('/')[2];
    console.log(id);
   const [name , setname] = useState();
    const [dashboard, setDashboard] = useState({}); // Keep this as an object to hold more data if needed
    const [error, setError] = useState(null); 

    useEffect(() => {
        if (id) {
            axios.get(`${BackEnd_url}/api/authentication/${id}`, {
                headers: {
                    'Authorization': `${window.localStorage.getItem('token')}`
                }
            })
            .then((response) => {
               
                setname(response.data.name);  
                setDashboard(response.data.tasks.reverse()); // Set the entire response data
            })
            .catch((error) => {
                console.log(error);
                setError("Failed to fetch user data."); 
            });
        }
    }, [id]);
  



    return (
        <div className="container mt-4">
            <h1>Dashboard</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            
            {dashboard && dashboard.length > 0 && (
                <div className="mt-4">
                    <h2>Your Tasks:</h2>
                    <div className="table-responsive">
        <table className="table table-bordered table-hover mt-4">
          <thead className="thead-light">
                            <tr>
                                <th>Date</th>
                                <th>User ID</th>
                                <th>User Name</th>
                                <th>ID</th>
                                <th>Task_ID</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboard.map(item => (
                                <tr key={item._id}>
                                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                                    <td>{id}</td>
                                    <td>{name}</td>
                                    <td>{item._id}</td>
                                    <td>{item.task_id}</td>
                                    <td>{item.actions}</td> 
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
            )}
        </div>
    );
}
