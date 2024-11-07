import { createContext, useState } from "react";

export const Mycontext = createContext();

export const MyProvider = ({ children }) => {
    const [value, setValue] = useState("default value");
    const [params, setparams] = useState("default value");

  
    return (
      <Mycontext.Provider value={{ value, setValue , params , setparams }}>
        {children}
      </Mycontext.Provider>
    );
  };


