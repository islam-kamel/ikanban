import "./App.css";
import KanbanBorder from "./components/KanbanBorder.tsx";

function App() {

  return (
    <div>
      <KanbanBorder />
      <a href="https://github.com/islam-kamel" target="_blank">
        <small
          className="text-muted text-center block my-3 font-semibold">
          Made With ❤️ by Islam
        </small>
      </a>
    </div>
  );
}

export default App;
