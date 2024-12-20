import Aside from '../Aside/aside';
import { BackEnd_url } from '../../constance';
import useTokenDecoder from '../jwt/useTokenDecoder';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './home.css'
import { Link } from 'react-router-dom';

export default function Completed() {
    const userData = useTokenDecoder();
    const role = userData?.role;
    const avatar = userData?.avatar;
    const userid = userData?._id;

    const [tasks, settasks] = useState([]);
    const [check, setCheck] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || 'light'); 

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme); 
    };
    useEffect(() => {
        document.body.className = theme; 
    }, [theme]);
    
    useEffect(() => {
        if (userid) {
            fetch(`${BackEnd_url}/api/task/${userid}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data.tasks);
                    settasks(data.tasks);
                })
                .catch(err =>
                    console.error(err)
                );
        }
    }, [userid ]);


const handeldelete = (taskid) => {
    axios.delete(`${BackEnd_url}/api/task/${userid}/${taskid}`)
        .then((response) => {
            const updatedTasks = tasks.filter(task => task._id !== taskid);
            settasks(updatedTasks);
            alert("Task deleted successfully");
            setCheck(!check);
        })
        .catch((error) => {
            console.error("Error deleting task:", error);
            alert("Error deleting task");
        });
}

    return (
        <div style={{ backgroundColor: theme === 'light' ? '#f0f0f0' : '#333', minHeight: '100vh' }}>
        <div className="home-container">
            <div className="user-info">
            <Aside />
            </div>
            <div className="content-container">
                <h2>Your Completed Tasks</h2>
                <button className='btn ' onClick={()=>toggleTheme()}><i class="fa-solid fa-circle-half-stroke"></i></button>
                {tasks.length === 0 ? (
                    <p className="error">loding......</p>
                ) : (
                    <div className="task-list">
                    {tasks.map(task => (
                       !task.completed ? (
                        null)
                        :(
                      <div key={task._id} className="task-item mb-3">
                        <div className="card" style={{ backgroundColor: theme === 'light' ? '#f0f0f0' : '#333' }}>
                          <div className="card-body">
                            <h5 className="card-title">{task.title}</h5>
                            <p className="card-text">{task.description}</p>
                            <p className="text-muted">Due Date: {task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : ''}</p>
                            <p className="task-status">
                              <strong>Status:</strong> {task.completed ? 'Completed' : 'Not Completed'}
                            </p>
                            {/* Button to delete task */}
                            <span style={{padding:"10px"}}><button className="btn px-2 " onClick={()=>handeldelete(task._id)}><i class="fa-solid fa-trash"></i></button></span>
                            {/* Button to edit task */}
                            <Link to={`/updatetask/${userid}/${task._id}`}><button className="btn px-2"><i class="fa-sharp fa-solid fa-pen-to-square"></i></button></Link>
                          </div>
                        </div>
                      </div>
                            )
                    ))}
                  </div>
                  
                )}
        </div>
        </div>
        </div>
    );
}
