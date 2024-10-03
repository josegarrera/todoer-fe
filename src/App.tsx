import { useEffect, useState, CSSProperties } from 'react';
import axios from 'axios';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get('http://localhost:3001/todos');
    setTodos(response.data);
  };

  const fetchRandomTitle = async () => {
    setLoadingTitle(true);
    try {
      const response = await axios.get(
        'http://localhost:3002/random-title'
      );
      setTitle(response.data.title);
    } catch (error) {
      console.error('Error fetching random title', error);
    }
    setLoadingTitle(false);
  };

  const addTodo = async () => {
    if (title.trim() === '') {
      alert('Please enter a title or generate a random one');
      return;
    }

    setLoading(true); // Activar el estado de carga
    try {
      const response = await axios.post(
        'http://localhost:3001/todos',
        { title }
      );
      setTodos([...todos, response.data]);
      setTitle('');
    } catch (error) {
      console.error('Error adding todo', error);
    }
    setLoading(false); // Desactivar el estado de carga
  };

  const completeTodo = async (_id: string) => {
    const response = await axios.patch(
      `http://localhost:3001/todos/${_id}/complete`
    );
    setTodos(
      todos.map(todo => (todo._id === _id ? response.data : todo))
    );
  };

  const deleteTodo = async (_id: string) => {
    await axios.delete(`http://localhost:3001/todos/${_id}`);
    setTodos(todos.filter(todo => todo._id !== _id));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.todoApp}>
        <h1 style={styles.title}>TODO List</h1>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={handleKeyDown} // Escuchar la tecla Enter
            placeholder="New Todo"
            style={styles.input}
            disabled={loading || loadingTitle} // Deshabilitar mientras carga
          />
          <button
            onClick={addTodo}
            style={styles.addButton}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Todo'}
          </button>
        </div>
        <button
          onClick={fetchRandomTitle}
          style={styles.randomButton}
          disabled={loadingTitle}
        >
          {loadingTitle ? 'Generating...' : 'Generate Random Title'}
        </button>
        <ul style={styles.todoList}>
          {todos.map(todo => (
            <li key={todo._id} style={styles.todoItem}>
              <span
                style={{
                  ...styles.todoText,
                  textDecoration: todo.completed
                    ? 'line-through'
                    : 'none',
                }}
              >
                {todo.title}
              </span>
              <div style={styles.buttons}>
                <button
                  onClick={() => completeTodo(todo._id)}
                  disabled={todo.completed}
                  style={styles.doneButton}
                >
                  {todo.completed ? 'Completed' : 'Mark as Done'}
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100vh',
    paddingTop: '50px',
    backgroundColor: '#282c34',
    color: 'white',
  },
  todoApp: {
    width: '600px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#20232a',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    marginRight: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  addButton: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#61dafb',
    cursor: 'pointer',
  },
  randomButton: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#4caf50',
    cursor: 'pointer',
    marginTop: '10px',
    color: 'white',
  },
  todoList: {
    listStyleType: 'none',
    padding: 0,
  },
  todoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #ccc',
  },
  todoText: {
    flex: 1,
  },
  buttons: {
    display: 'flex',
    gap: '10px',
  },
  doneButton: {
    padding: '5px 10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#4caf50',
    color: 'white',
    cursor: 'pointer',
    opacity: 0.8,
  },
  deleteButton: {
    padding: '5px 10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#f44336',
    color: 'white',
    cursor: 'pointer',
  },
};

export default App;
