import useFetch from '../useFetch';
import { ENDPOINTS } from '../../lib/constants';

export function useResetPassword() {
  const { fetchData: resetPassword, loading } = useFetch(
    ENDPOINTS.RESET_PASSWORD,
    {
      method: 'POST',
      silent: true
    }
  );

  return { resetPassword, loading };
}
