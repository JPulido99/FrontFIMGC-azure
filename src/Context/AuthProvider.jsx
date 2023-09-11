import { createContext,useEffect,useState } from "react";
const AuthContext = createContext();
export const AuthProvider =({children})=>{
    
    const [user,setUser]=useState(null);

    useEffect(()=>{
        const storageUser = JSON.parse(localStorage.getItem("user"));
        setUser(storageUser)

    },[])
    
    return (
     <AuthContext.Provider value={{user,setUser}} >{children}</AuthContext.Provider>
    )
}
export default AuthContext
