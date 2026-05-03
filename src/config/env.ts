import "dotenv/config";

export const envs = {
    DATABASE_URL: process.env.DATABASE_URL!,
    PORT: process.env.PORT || "3000"
}