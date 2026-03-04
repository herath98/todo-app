import useFetch from '../useFetch';
import { ENDPOINTS } from '../../lib/constants';

export function useLogin() {
  const { fetchData: login, loading } = useFetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    silent: true
  });

  return { login, loading };
}
