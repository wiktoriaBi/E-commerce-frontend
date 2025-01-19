import {useUserContext} from "../context/UserContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export function RequireAuth({allowedRoles, children}: {allowedRoles: string[],children: React.ReactNode})  {

    const navigate = useNavigate();
    const {role} = useUserContext();
    const [canRender, setCanRender] = useState(false); // Track when children can render
    console.log(role)

    console.log("Allowed roles (type):", typeof allowedRoles[0]);
    console.log("User role (type):", typeof role);

    useEffect(() => {
        console.log("Allowed roles:"+ allowedRoles);
        console.log("User role:" + role)
        console.log("Index:" + allowedRoles.indexOf(role as string));
        if (!allowedRoles.includes(role as string)) {
            if (window.history.length > 1) {
                console.log("Role not allowed!!!")
                navigate(-1, { replace: true });
            }
        } else {
            console.log("Role allowed")
            setCanRender(true); // Allow rendering once the role is validated
        }
    }, [role, navigate, allowedRoles]);

    if (!canRender) {
        // Prevent rendering until the role check is complete
        return null;
    } else {
        return children;
    }

}