import { useContext } from "react"
import AuthContext from "../Context/AuthProvider"
import { Navigate } from "react-router-dom"

const Public =({children})=>{
    const {user} = useContext(AuthContext)
    return user?.token ?   <Navigate to ="/bienvenido"/>: children


}
export default Public