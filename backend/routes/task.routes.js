import express from "express";
import * as taskController from "../controllers/task.controller.js";

const TaskRouter = express.Router();

TaskRouter.get("/", taskController.getAll);
TaskRouter.post("/", taskController.create);
TaskRouter.put("/:id", taskController.update);
TaskRouter.patch("/:id/toggle", taskController.toggle);
TaskRouter.delete("/:id", taskController.remove);

export default TaskRouter;
