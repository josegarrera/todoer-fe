import { useEffect, useState } from 'react';
import axios from 'axios';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get('http://localhost:3001/todos');
    setTodos(response.data);
  };

  const addTodo = async () => {
    const response = await axios.post('http://localhost:3001/todos', {
      title,
    });
    setTodos([...todos, response.data]);
    setTitle('');
  };

  const deleteTodo = async (_id: string) => {
    await axios.delete(`http://localhost:3001/todos/${_id}`);
    setTodos(todos.filter(todo => todo._id !== _id));
  };

  return (
    <div>
      <h1>TODO List</h1>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="New Todo"
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            {todo.title}
            <button onClick={() => deleteTodo(todo._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
