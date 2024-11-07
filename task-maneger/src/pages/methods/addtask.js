import { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { BackEnd_url } from "../../constance";
import useTokenDecoder from "../jwt/useTokenDecoder";
// import './Addtask.css'; 

export default function Addtask() {
    const userData = useTokenDecoder();
    const role = userData?.role;
    const avatar = userData?.avatar;
    const userid = userData?._id;
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title === "" || description === "") {
            return false;
        }

        axios.post(`${BackEnd_url}/api/task/${userid}`, {
            title: title,
            description: description,
            dueDate,
        })
        .then(response => {
            alert('Task added successfully!');
            navigate('/');  // After successful submission, navigate to home page
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.response?.data);
        })
    };

    return (
        <div className="addtask-container">
            <form className="addtask-form" onSubmit={handleSubmit}>
                <h2>Add New Task</h2>
                <input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="input-field"
                />
                <input
                    type="text"
                    placeholder="Task Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="input-field"
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="input-field"
                />
                <button type="submit" className="submit-button">Add Task</button>
            </form>
        </div>
    );
}
