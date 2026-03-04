import useFetch from '../useFetch';
import { ENDPOINTS } from '../../lib/constants';

export function useRegister() {
  const { fetchData: register, loading } = useFetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    silent: true
  });

  return { register, loading };
}
