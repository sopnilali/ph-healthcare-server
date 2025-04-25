import { Router } from "express";
import { AdminRoutes, } from "../modules/Admin/admin.route";
import { UserRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { DoctorRoutes } from "../modules/Doctor/doctor.route";
import { SpecialitiesRoutes } from "../modules/Specialties/specialties.route";
import { PatientRoutes } from "../modules/Patient/patient.route";

const router = Router();


const moduleRoutes = [
    {
        path: "/user",
        routes: UserRoutes
    }, 
    {
        path: "/admin",
        routes: AdminRoutes
    },
    {
        path: "/auth",
        routes: AuthRoutes
    },
    {
        path: "/doctor",
        routes: DoctorRoutes
    },
    {
        path: "/specialites",
        routes: SpecialitiesRoutes
    },
    {
        path: "/patient",
        routes: PatientRoutes
    }
]

moduleRoutes.forEach(({path, routes})=> {
    router.use(path, routes)
})

export default router