"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_route_1 = require("../modules/Admin/admin.route");
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const doctor_route_1 = require("../modules/Doctor/doctor.route");
const specialties_route_1 = require("../modules/Specialties/specialties.route");
const patient_route_1 = require("../modules/Patient/patient.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        routes: user_route_1.UserRoutes
    },
    {
        path: "/admin",
        routes: admin_route_1.AdminRoutes
    },
    {
        path: "/auth",
        routes: auth_route_1.AuthRoutes
    },
    {
        path: "/doctor",
        routes: doctor_route_1.DoctorRoutes
    },
    {
        path: "/specialites",
        routes: specialties_route_1.SpecialitiesRoutes
    },
    {
        path: "/patient",
        routes: patient_route_1.PatientRoutes
    }
];
moduleRoutes.forEach(({ path, routes }) => {
    router.use(path, routes);
});
exports.default = router;
