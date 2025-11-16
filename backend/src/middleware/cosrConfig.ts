import cors from "cors";

const corsMiddleware = cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

export default corsMiddleware;
