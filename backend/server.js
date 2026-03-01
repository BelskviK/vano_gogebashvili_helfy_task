import express from "express";
import cors from "cors";
import TaskRouter from "./routes/task.routes.js";

const app = express();
const PORT = 4000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://vano-gogebashvili-helfy-task.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(express.json());
app.use("/api/tasks", TaskRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
