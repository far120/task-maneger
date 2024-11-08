import Aside from '../Aside/aside';
import { BackEnd_url } from '../../constance';
import useTokenDecoder from '../jwt/useTokenDecoder';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './home.css'
import { Link } from 'react-router-dom';

export default function Today() {
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

const handleCompleteTask = (taskid) => {
    const taskcomplete = tasks.find(task => task._id === taskid);
    axios.put(`${BackEnd_url}/api/task/${userid}/${taskid}`, { completed : !taskcomplete.completed  })
       .then((response) => {
            const updatedTasks = tasks.map(task => 
                task._id === taskid ? { ...task, completed: !taskcomplete.completed } : task
            );
            settasks(updatedTasks);
            alert("Task marked as completed successfully");

            setCheck(prevCheck => !prevCheck);
        })
       .catch((error) => {
            console.error("Error marking task as completed:", error);
            alert("Error marking task as completed");
        });
}


return (
  <div style={{ backgroundColor: theme === 'light' ? '#f0f0f0' : '#333', minHeight: '100vh' }}>
    <div className="home-container">
      <div className="user-info">
        <Aside />
      </div>
      <div className="content-container">
        <h2>Your Today Tasks</h2>
        <button className='btn ' onClick={()=>toggleTheme()}><i class="fa-solid fa-circle-half-stroke"></i></button>
        {tasks.length === 0 ? (
          <p className="error">loading......</p>
        ) : (
          <div className="task-list">
            {tasks.filter(task => {
              const taskDate = task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : null;
              const today = new Date().toISOString().substring(0, 10);
              return taskDate === today;
            }).length === 0 ? (
              <p className="error">No Due Task is today ......</p>
            ) : (
              tasks.map(task => {
                const dueDate = task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : '';
                const isToday = dueDate === new Date().toISOString().substring(0, 10);
  
                return (
                  isToday && (
                    <div key={task._id} className="task-item mb-3">
                      <div className="card" style={{ backgroundColor: theme === 'light' ? '#f0f0f0' : '#333' }}>
                        <div className="card-body">
                          <h5 className="card-title">{task.title}</h5>
                          <p className="card-text">{task.description}</p>
                          <p className="text-muted">Due Date: {dueDate}</p>
                          <p className="task-status">
                            <strong>Status:</strong> {task.completed ? 'Completed' : 'Not Completed'}
                          </p>
                          {/* Button to mark task as completed */}
                          {!task.completed ? (
                            <button
                              className="btn btn-success"
                              onClick={() => handleCompleteTask(task._id)}
                            >
                              Mark as Completed
                            </button>
                          ) : (
                            <button
                              className="btn btn-danger"
                              onClick={() => handleCompleteTask(task._id)}
                            >
                              Mark as Not Completed
                            </button>
                          )}
                          {/* Button to delete task */}
                          <span style={{ padding: "10px" }}>
                            <button className="btn px-2" onClick={() => handeldelete(task._id)}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </span>
                          {/* Button to edit task */}
                          <Link to={`/updatetask/${userid}/${task._id}`}>
                            <button className="btn px-2">
                              <i className="fa-sharp fa-solid fa-pen-to-square"></i>
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}  
