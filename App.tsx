
import React, { useState, useEffect, useMemo } from 'react';
import type { Todo, Filter } from './types';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterButtons from './components/FilterButtons';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const items = window.localStorage.getItem('todos');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Error reading todos from localStorage", error);
      return [];
    }
  });

  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    try {
      window.localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error("Error writing todos to localStorage", error);
    }
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };
    setTodos(prevTodos => [newTodo, ...prevTodos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeTodoCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200 antialiased transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-800 dark:to-purple-900"></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 max-w-2xl">
        <Header />
        <main className="mt-8 space-y-4 sm:space-y-6">
          <TodoForm addTodo={addTodo} />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <TodoList
              todos={filteredTodos}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
            />
            {todos.length > 0 && (
              <FilterButtons
                filter={filter}
                setFilter={setFilter}
                activeTodoCount={activeTodoCount}
                hasCompletedTodos={todos.some(todo => todo.completed)}
                clearCompleted={clearCompleted}
              />
            )}
          </div>
        </main>
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
          <p>Drag and drop to reorder list (feature coming soon!).</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
