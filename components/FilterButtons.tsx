
import React from 'react';
import type { Filter } from '../types';

interface FilterButtonsProps {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  activeTodoCount: number;
  hasCompletedTodos: boolean;
  clearCompleted: () => void;
}

const FilterButton: React.FC<{
  currentFilter: Filter;
  targetFilter: Filter;
  setFilter: (filter: Filter) => void;
  children: React.ReactNode;
}> = ({ currentFilter, targetFilter, setFilter, children }) => {
  const isActive = currentFilter === targetFilter;
  return (
    <button
      onClick={() => setFilter(targetFilter)}
      className={`font-bold transition-colors duration-300 ${
        isActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
      }`}
    >
      {children}
    </button>
  );
};

const FilterButtons: React.FC<FilterButtonsProps> = ({
  filter,
  setFilter,
  activeTodoCount,
  hasCompletedTodos,
  clearCompleted,
}) => {
  return (
    <div className="flex items-center justify-between p-5 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
      <span>{activeTodoCount} {activeTodoCount === 1 ? 'item' : 'items'} left</span>
      <div className="hidden sm:flex items-center space-x-4">
        <FilterButton currentFilter={filter} targetFilter="all" setFilter={setFilter}>All</FilterButton>
        <FilterButton currentFilter={filter} targetFilter="active" setFilter={setFilter}>Active</FilterButton>
        <FilterButton currentFilter={filter} targetFilter="completed" setFilter={setFilter}>Completed</FilterButton>
      </div>
      <button
        onClick={clearCompleted}
        className={`transition-colors duration-300 hover:text-gray-800 dark:hover:text-gray-200 ${!hasCompletedTodos ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!hasCompletedTodos}
      >
        Clear Completed
      </button>
    </div>
  );
};

export default FilterButtons;
