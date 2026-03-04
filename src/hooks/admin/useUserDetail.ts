import useFetch from '../useFetch';
import { ENDPOINTS } from '../../lib/constants';

export function useUserDetail(id?: string) {
  const { fetchData: getUser, loading } = useFetch(
    id ? ENDPOINTS.USER_BY_ID(id) : '',
    {
      method: 'GET',
      silent: true
    }
  );

  const { fetchData: updateUser, loading: saving } = useFetch(
    id ? ENDPOINTS.USER_BY_ID(id) : '',
    {
      method: 'PUT'
    }
  );

  return { getUser, loading, updateUser, saving };
}
