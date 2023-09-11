import { useContext } from "react"
import AuthContext from "../Context/AuthProvider"
import { Navigate } from "react-router-dom"

const Private =({children})=>{
    const {user} = useContext(AuthContext)
    
    
    console.log(user)
    return user?.token ? children : <Navigate to ="/"/>


}
export default Private