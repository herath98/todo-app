import useFetch from '../useFetch';
import { ENDPOINTS } from '../../lib/constants';

export function useTodos() {
  const { fetchData: getTodos, loading } = useFetch(ENDPOINTS.TODOS, {
    method: 'GET',
    silent: true
  });

  const { fetchData: createTodo, loading: creating } = useFetch(
    ENDPOINTS.TODOS,
    {
      method: 'POST'
    }
  );

  const { fetchData: toggleTodo } = useFetch('', {
    method: 'PATCH',
    // silent: true
  });

  const { fetchData: deleteTodo, loading: deleting } = useFetch('', {
    method: 'DELETE'
  });

  return { getTodos, loading, createTodo, creating, toggleTodo, deleteTodo, deleting };
}
