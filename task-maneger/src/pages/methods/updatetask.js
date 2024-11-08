import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BackEnd_url } from "../../constance";
import useTokenDecoder from "../jwt/useTokenDecoder";
import './methods.css'; 

export default function UpdateTask() {
    const [taskid] = useState(window.location.pathname.split('/')[3]);
    const userData = useTokenDecoder();
    const userid = userData?._id;
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date().toISOString().substring(0, 10));

    useEffect(() => {
        axios.get(`${BackEnd_url}/api/task/${userid}/${taskid}`)
            .then(response => {
                const task = response.data;
                setTitle(task.title);
                setDescription(task.description);
                setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : '');
            })
            .catch(error => {
                console.error("Error fetching task:", error);
            });
    }, [userid, taskid]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title === "" || description === "") {
            return false;
        }

        axios.put(`${BackEnd_url}/api/task/${userid}/${taskid}`, {
            title: title,
            description: description,
            dueDate,
        })
        .then(response => {
            alert('Task updated successfully!');
            navigate('/alltasks');  
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.response?.data);
        });
    };

    return (
        <div className="addtask-container">
            <form className="addtask-form" onSubmit={handleSubmit}>
                <h2>Update Task</h2>
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
                <button type="submit" className="submit-button">Update Task</button>
            </form>
        </div>
    );
}
