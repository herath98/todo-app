import useFetch from '../useFetch';
import { ENDPOINTS } from '../../lib/constants';

export function useDashboard() {
  const { fetchData: getTodos, loading } = useFetch(ENDPOINTS.TODOS, {
    method: 'GET',
    silent: true
  });

  return { getTodos, loading };
}
