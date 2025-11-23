import { ZodObject, ZodRawShape } from "zod";
import { Request, Response, NextFunction } from "express";
export function validate(schema: ZodObject<ZodRawShape>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ 
        body: req.body, 
        params: req.params, 
        query: req.query 
      });
      next();
    } catch (err: any) {
      const issues =
        err.errors?.map((e: any) => ({
          path: e.path,
          message: e.message
        })) ?? [];
      res.status(400).json({ message: "Validation error", errors: issues });
    }
  };
}
