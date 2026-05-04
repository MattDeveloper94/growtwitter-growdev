export { };

declare module "express-serve-static-core" {
    interface Request {
        usuario?: {
            id: string;
        };
    }
}