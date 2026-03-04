import useFetch from '../useFetch';
import { ENDPOINTS } from '../../lib/constants';

export function useVerifyEmail() {
  const { fetchData: verifyEmail, loading: verifying } = useFetch(
    ENDPOINTS.VERIFY_EMAIL,
    {
      method: 'POST',
      silent: true
    }
  );

  const { fetchData: resendVerification, loading: resending } = useFetch(
    ENDPOINTS.RESEND_VERIFICATION,
    {
      method: 'POST',
      silent: true
    }
  );

  return { verifyEmail, verifying, resendVerification, resending };
}
