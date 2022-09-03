import React, { useState, useEffect } from "react";
import "./App.css";

const API_BASE = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [popUpActive, setPopUpActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    GetTodo();
    console.log(todos);
  }, []);

  //automatically fetch the  todos from the localhost 3001
  const GetTodo = () => {
    fetch(API_BASE + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error:", err));
  };

  const completeTodo = async (id) => {
    const data = await fetch(API_BASE + "/todos/complete/" + id).then((res) =>
      res.json()
    );

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      })
    );
  };
  const deleteTodo = async (id) => {
    const data = await fetch(API_BASE + "/todos/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };

  const addTodo = async () => {
    const data = await fetch(API_BASE + "/todos/new/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json());
    // set all to default
    setTodos([...todos, data]);
    setPopUpActive(false);
    setNewTodo("");
  };
  return (
    <div className="App">
      <h1>Welcome, jamico</h1>
      <h4>Your Task</h4>
      <div className="todos">
        {todos.map((todo) => (
          <div
            className={"todo " + (todo.complete ? "is-complete" : "")}
            key={todo._id}
            onClick={() => completeTodo(todo._id)}
          >
            <div className="checkbox"></div>
            <div className="text">{todo.text}</div>
            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
              x
            </div>
          </div>
        ))}
      </div>
      <div className="addPopup" onClick={() => setPopUpActive(true)}>
        +
      </div>
      {popUpActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopUpActive(false)}>
            x
          </div>
          <div className="content">
            <h3>Add Task</h3>

            <input
              type="text"
              className="addTodoInput"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <button className="button" onClick={addTodo}>
              Create Task{" "}
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
