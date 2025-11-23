"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema) {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                params: req.params,
                query: req.query
            });
            next();
        }
        catch (err) {
            const issues = err.errors?.map((e) => ({
                path: e.path,
                message: e.message
            })) ?? [];
            res.status(400).json({ message: "Validation error", errors: issues });
        }
    };
}
