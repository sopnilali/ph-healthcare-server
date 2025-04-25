"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorFilterableFields = exports.paginationFields = exports.doctorSearchAbleFields = void 0;
exports.doctorSearchAbleFields = ['email']; // only for search term
exports.paginationFields = ['limit', 'page', 'sortBy', 'sortOrder'];
exports.doctorFilterableFields = [
    'name',
    'email',
    'contactNumber',
    'searchTerm',
    'address',
    'registrationNumber',
    'gender',
    'qualification',
    'currentWorkingPlace',
    'designaton',
    'specialties'
];
