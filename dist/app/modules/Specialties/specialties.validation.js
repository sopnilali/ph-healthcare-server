"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialitiesValidation = void 0;
const zod_1 = require("zod");
const createSpecialitiesValidation = zod_1.z.object({
    title: zod_1.z.string({ required_error: "Title is Required", invalid_type_error: "Title must be String" })
});
exports.SpecialitiesValidation = {
    createSpecialitiesValidation
};
