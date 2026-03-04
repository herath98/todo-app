import useFetch from '../useFetch';
import { ENDPOINTS } from '../../lib/constants';

export function useUsers() {
  const { fetchData: getUsers, loading } = useFetch(ENDPOINTS.USERS, {
    method: 'GET',
    silent: true
  });

  return { getUsers, loading };
}
