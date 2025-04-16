import { Router } from "express";
import { AdminRoutes, } from "../modules/Admin/admin.route";
import { UserRoutes } from "../modules/User/user.route";

const router = Router();


const moduleRoutes = [
    {
        path: "/user",
        routes: UserRoutes
    }, 
    {
        path: "/admin",
        routes: AdminRoutes
    }
]

moduleRoutes.forEach(({path, routes})=> {
    router.use(path, routes)
})

export default router