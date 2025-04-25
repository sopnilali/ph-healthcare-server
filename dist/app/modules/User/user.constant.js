"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFilterableFields = exports.paginationFields = exports.userSearchAbleFields = void 0;
exports.userSearchAbleFields = ['email']; // only for search term
exports.paginationFields = ['limit', 'page', 'sortBy', 'sortOrder'];
exports.userFilterableFields = [
    'email',
    'role',
    'status',
    'searchTerm'
];
