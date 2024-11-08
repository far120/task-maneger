import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/Auth/Signup"
import Login from "./pages/Auth/login"
import Home from "./pages/Home/home";
import Completed from "./pages/Home/completed";
import Today from "./pages/Home/today";
import Addtask from "./pages/methods/addtask";
import UpdateTask from "./pages/methods/updatetask";
import NotFound from "./pages/validation/NotFound";
import Protection from "./pages/validation/protected";
import useTokenDecoder from "./pages/jwt/useTokenDecoder";
import Auth from "./pages/userdata/auth";
import Profile from "./pages/userdata/profile";
import Show from "./pages/userdata/show";
import Update from "./pages/userdata/updates";
import Dashboard from "./pages/userdata/dashboard";
import Prevday from "./pages/Home/prevday";
import Nextday from "./pages/Home/nextday";
import { Mycontext } from "./pages/Auth/context";
import { useContext } from "react";

function App() {
  const { value, setValue } = useContext(Mycontext);
  if (!localStorage.getItem('token') && value !== "default value") {
    localStorage.setItem('token', value);
  }
  
  if (localStorage.getItem('token') && value === "default value") {
    setValue(localStorage.getItem("token"));
  }
  const data = useTokenDecoder();
    const role = data?.role;
  return (

    <>
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      { window.localStorage.getItem("token") ?(
        <>
        {window.localStorage.getItem("token") && role ==="adminserver" ?(
          <Route path="/auth" element={<Auth />} />
        ):
        (
          null
        )  }
      <Route path="/" element={<Home />} />
      <Route path="/addtask" element={<Addtask />} />
      <Route path="/updatetask/:userid/:taskid" element={<UpdateTask />} />
      <Route path="/today" element={<Today />} />
      <Route path="/completed" element={<Completed />} />
      <Route path="/prevday" element={<Prevday />} />
      <Route path="/nextday" element={<Nextday />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/auth/:userid" element={<Show />} />
      <Route path="/updates/:userid" element={<Update />} />
      <Route path="/dashboard/:id" element={<Dashboard />} />
      </>
      ):(
        <>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        </>
      )

      }
    </Routes>
  

    </>
  );
}

export default App;
