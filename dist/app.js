"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const app = (0, express_1.default)();
// middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000'],
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use('/api/', routes_1.default);
//global api route
app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'Welcome to PH Healthcare',
    });
});
app.use(globalErrorhandler_1.default);
app.use(notFound_1.default);
exports.default = app;
