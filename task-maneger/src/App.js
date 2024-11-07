import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/Auth/Signup"
import Login from "./pages/Auth/login"
import Home from "./pages/Home/home";
// import Completed from "./pages/Content/completed";
// import Today from "./pages/Content/today";
import Addtask from "./pages/methods/addtask";
import UpdateTask from "./pages/methods/updatetask";

function App() {
  return (
    <>
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/addtask" element={<Addtask />} />
      <Route path="/updatetask/:userid/:taskid" element={<UpdateTask />} />

      {/* <Route path="/alltasks" element={<AllTasks />} />
      <Route path="/today" element={<Today />} />

      <Route path="/completed" element={<Completed />} />
      </Route> */}
    </Routes>
  

    </>
  );
}

export default App;
