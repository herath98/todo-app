import useFetch from '../useFetch';
import { ENDPOINTS } from '../../lib/constants';

export function useForgotPassword() {
  const { fetchData: forgotPassword, loading } = useFetch(
    ENDPOINTS.FORGOT_PASSWORD,
    {
      method: 'POST',
      silent: true
    }
  );

  return { forgotPassword, loading };
}
