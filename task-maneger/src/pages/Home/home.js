import Aside from '../Aside/aside';
import { BackEnd_url } from '../../constance';
import useTokenDecoder from '../jwt/useTokenDecoder';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './home.css'
import { Link } from 'react-router-dom';

export default function Home() {
    const userData = useTokenDecoder();
    const role = userData?.role;
    const avatar = userData?.avatar;
    const userid = userData?._id;

    const [tasks, settasks] = useState([]);
    let check = false;

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
    }, [userid , check]);


const handeldelete = (taskid) => {
    axios.delete(`${BackEnd_url}/api/task/${userid}/${taskid}`)
        .then((response) => {
            const updatedTasks = tasks.filter(task => task._id !== taskid);
            settasks(updatedTasks);
            alert("Task deleted successfully");
            check =!check;
        })
        .catch((error) => {
            console.error("Error deleting task:", error);
            alert("Error deleting task");
        });
}


    return (
        <div className="home-container">
            <div className="user-info">
            <Aside />
            </div>
            <div className="content-container">
                <h2>Your Tasks</h2>
                <Link to="/addtask"><button style={{margin:"5px"}} className="btn add-btn">NewTask</button></Link>
                {tasks.length === 0 ? (
                    <p className="error">loding......</p>
                ) : (
                    <div className="task-list">
                    {tasks.map(task => (
                      <div key={task._id} className="task-item mb-3">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title">{task.title}</h5>
                            <p className="card-text">{task.description}</p>
                            <p className="text-muted">Due Date: {task.dueDate}</p>
                            <p className="task-status">
                              <strong>Status:</strong> {task.completed ? 'Completed' : 'Not Completed'}
                            </p>
                            {/* Button to mark task as completed */}
                            {!task.completed && (
                              <button
                                className="btn btn-success"
                                // onClick={() => handleCompleteTask(task._id)}
                              >
                                Mark as Completed
                              </button>
                            )}
                            {/* Button to delete task */}
                            <span style={{padding:"10px"}}><button className="btn px-2 " onClick={()=>handeldelete(task._id)}><i class="fa-solid fa-trash"></i></button></span>
                            {/* Button to edit task */}
                            <button className="btn px-2"><i class="fa-sharp fa-solid fa-pen-to-square"></i></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                )}
        </div>
        </div>
    );
}
