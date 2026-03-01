import TaskList from "./components/TaskList/TaskList.jsx";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/main.css";

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <div className="app-header">
          <h1>Task Manager</h1>
          <ThemeToggle />
        </div>
        <TaskList />
      </div>
    </ThemeProvider>
  );
}

export default App;
