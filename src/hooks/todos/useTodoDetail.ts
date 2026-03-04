import useFetch from '../useFetch';
import { ENDPOINTS } from '../../lib/constants';

export function useTodoDetail(id?: string) {
  const { fetchData: getTodo, loading } = useFetch(
    id ? ENDPOINTS.TODO_BY_ID(id) : '',
    {
      method: 'GET',
      silent: true
    }
  );

  const { fetchData: updateTodo, loading: saving } = useFetch(
    id ? ENDPOINTS.TODO_BY_ID(id) : '',
    {
      method: 'PUT'
    }
  );

  const { fetchData: toggleTodo, loading: toggling } = useFetch('', {
    method: 'PATCH',
    silent: true
  });

  const { fetchData: deleteTodo, loading: deleting } = useFetch('', {
    method: 'DELETE'
  });

  return { getTodo, loading, updateTodo, saving, toggleTodo, toggling, deleteTodo, deleting };
}
