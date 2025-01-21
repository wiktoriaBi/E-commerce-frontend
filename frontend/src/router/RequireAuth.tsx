import {useUserContext} from "../context/UserContext.tsx";
import {Navigate, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {PathNames} from "./PathNames.ts";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[]; // set the user-roles
}

export const RequireAuth: React.FC<ProtectedRouteProps> = ({allowedRoles, children}: {allowedRoles: string[],children: React.ReactNode})=>  {

    const navigate = useNavigate();
    const {role} = useUserContext();

   const [canRender, setCanRender] = useState(false); // Track when children can render
    console.log(role)


    console.log("Allowed roles (type):", typeof allowedRoles[0]);
    console.log("User role (type):", typeof role);

   useEffect(() => {
       const checkPermissions = () => {
           console.log("Allowed roles:"+ allowedRoles);
           console.log("User role:" + role as string)
           console.log("Index:" + allowedRoles.indexOf(role as string));

           if (role === null) {
               console.log("role==null:", {replace: true});
               navigate('/', {replace: true});
           }
           else if (!allowedRoles.includes(role as string)) {
               console.log("Role not allowed!!!")
               navigate('/notfound', {replace: true} )
               //navigate("/notfound", {replace: true});
           } else {
               console.log("Role allowed")
           }
       }
       checkPermissions();
       setCanRender(true); // Allow rendering once the role is validated
  }, [allowedRoles, navigate, role]);

    if (!canRender) {
        // Prevent rendering until the role check is complete
        return null;
    }
    return children;
}