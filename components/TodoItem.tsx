
import React from 'react';
import type { Todo } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { CrossIcon } from './icons/CrossIcon';

interface TodoItemProps {
  todo: Todo;
  isFirst: boolean;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, isFirst, toggleTodo, deleteTodo }) => {
  return (
    <li className={`group flex items-center p-5 transition-colors duration-300 ${!isFirst ? 'border-t border-gray-200 dark:border-gray-700' : ''}`}>
      <div className="flex items-center flex-grow">
        <button
          onClick={() => toggleTodo(todo.id)}
          className={`relative w-6 h-6 flex-shrink-0 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all duration-300 ${
            todo.completed
              ? 'bg-gradient-to-br from-blue-400 to-purple-500 border-transparent'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          }`}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && (
            <div className="flex items-center justify-center w-full h-full">
                <CheckIcon className="w-4 h-4 text-white" />
            </div>
          )}
        </button>
        <span
          className={`ml-4 text-lg cursor-pointer flex-grow ${
            todo.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-200'
          }`}
          onClick={() => toggleTodo(todo.id)}
        >
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => deleteTodo(todo.id)}
        className="ml-4 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-opacity duration-300 focus:outline-none focus:text-red-500"
        aria-label={`Delete todo: ${todo.text}`}
      >
        <CrossIcon className="w-5 h-5" />
      </button>
    </li>
  );
};

export default TodoItem;
