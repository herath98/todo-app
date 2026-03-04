import React, { useCallback, useState } from 'react';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import alert from '../utils/alert';
import { useLocation } from 'react-router-dom';
const BASE_URL = import.meta.env?.VITE_BASE_URL || 'http://localhost:8000/api';
const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred.';
interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export interface ApiResponse<T = unknown> {
  status?: boolean;
  success?: boolean;
  message?: string;
  details?: string;
  code?: number;
  data?: T;
  pagination?: PaginationMeta;
  resetToken?: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    role: string;
    clientProfile?: Record<string, unknown>;
  };
  errors?: {
    field: string;
    message: string;
    error?: string;
  }[];
  error?: {
    code: number;
    type: string;
    details: string;
  };
}
interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  accessToken?: string;
  data?: unknown;
  silent?: boolean;
  successMessage?: string;
  config?: AxiosRequestConfig;
  contentType?: string;
  file?: File;
  image?: File;
  endpoint?: string;
  showToastOnError?: boolean;
  headers?: Record<string, string>;
  responseType?: 'json' | 'blob' | 'text';
  noRedirect?: boolean;
}
interface UseFetchReturn<T = unknown> {
  data: ApiResponse<T> | null;
  loading: boolean;
  error: string | null;
  responseCode: number | null;
  fetchData: (overrideOptions?: FetchOptions) => Promise<ApiResponse<T> | null>;
  reset: () => void;
}
const useFetch = <T = unknown,>(
initialEndpoint = '',
options: FetchOptions = {})
: UseFetchReturn<T> => {
  const [data, setData] = useState<ApiResponse<T> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [responseCode, setResponseCode] = useState<number | null>(null);
  const location = useLocation();
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setResponseCode(null);
  }, []);
  const handleError = useCallback(
    (
    message: string = DEFAULT_ERROR_MESSAGE,
    code?: number,
    responseData?: ApiResponse<T>)
    : void => {
      if (
      (
      responseData as unknown as {
        code?: string;
      })?.
      code === 'ACCOUNT_DEACTIVATED' ||
      message?.toLowerCase().includes('account has been deactivated'))
      {
        Cookies.remove('accessToken');
        alert.error(
          'Your account has been deactivated. Please contact an administrator.'
        );
        if (location.pathname !== '/') window.location.href = '/';
        return;
      }
      if (
      code === 401 ||
      message?.toLowerCase().includes('invalid token') ||
      message?.toLowerCase().includes('please log in again'))
      {
        Cookies.remove('accessToken');
        if (location.pathname !== '/') window.location.href = '/';
        return;
      }
      const resp = responseData as Record<string, unknown> | undefined;
      let displayMessage = message || DEFAULT_ERROR_MESSAGE;
      if (resp) {
        if (Array.isArray(resp.errors) && resp.errors.length > 0) {
          const first = resp.errors[0];
          if (typeof first === 'string') displayMessage = first;else
          if (first && typeof first === 'object')
          displayMessage =
          (
          first as {
            message?: string;
            error?: string;
          }).
          message ||
          (
          first as {
            error?: string;
          }).
          error ||
          JSON.stringify(first);
        } else if (resp.errors && typeof resp.errors === 'object') {
          const vals = Object.values(
            resp.errors as Record<string, unknown[]>
          ).flat();
          if (vals.length > 0) {
            const first = vals[0];
            displayMessage =
            typeof first === 'string' ?
            first :
            (
            first as {
              message?: string;
            })?.
            message || JSON.stringify(first);
          }
        } else if (resp.message) {
          displayMessage = resp.message as string;
        }
      }
      setError(displayMessage);
      alert.warn(displayMessage || 'operation failed');
    },
    [location.pathname]
  );
  const fetchData = useCallback(
    async (
    overrideOptions: FetchOptions = {})
    : Promise<ApiResponse<T> | null> => {
      const {
        method = 'GET',
        accessToken: providedToken,
        data: requestData,
        silent = false,
        successMessage,
        config,
        contentType = 'application/json',
        file,
        image,
        endpoint = initialEndpoint,
        showToastOnError = true,
        headers: optionHeaders,
        responseType = 'json',
        noRedirect = false
      } = {
        ...options,
        ...overrideOptions
      };
      const accessToken =
      providedToken || Cookies.get('accessToken') || undefined;
      setLoading(true);
      setError(null);
      try {
        let response: AxiosResponse<ApiResponse<T>>;
        let finalData: unknown = requestData;
        const finalHeaders: Record<string, string> = {
          'Content-Type': contentType,
          ...(accessToken && {
            Authorization: `Bearer ${accessToken}`
          }),
          ...(config?.headers as Record<string, string>),
          ...optionHeaders
        };
        if (contentType === 'multipart/form-data' || file || image) {
          const formData = new FormData();
          if (requestData instanceof FormData) {
            finalData = requestData;
          } else {
            if (file) formData.append('file', file);
            if (image) formData.append('image', image);
            if (requestData && typeof requestData === 'object') {
              Object.entries(requestData as Record<string, unknown>).forEach(
                ([key, value]) => {
                  if (value instanceof File) formData.append(key, value);else
                  if (Array.isArray(value))
                  value.forEach((item: string | Blob) =>
                  formData.append(key, item)
                  );else
                  if (typeof value === 'object' && value !== null)
                  formData.append(key, JSON.stringify(value));else
                  if (value !== undefined && value !== null)
                  formData.append(key, String(value));
                }
              );
            }
            finalData = formData;
          }
          delete finalHeaders['Content-Type'];
        } else if (contentType === 'application/json' && requestData) {
          finalData =
          typeof requestData === 'string' ?
          requestData :
          JSON.stringify(requestData);
        }
        const requestConfig: AxiosRequestConfig = {
          headers: finalHeaders,
          responseType: responseType === 'json' ? undefined : responseType,
          ...config
        };
        const url = `${BASE_URL}${endpoint}`;
        switch (method.toUpperCase()) {
          case 'GET':
            response = await axios.get<ApiResponse<T>>(url, {
              params: requestData,
              ...requestConfig
            });
            break;
          case 'POST':
            response = await axios.post<ApiResponse<T>>(
              url,
              finalData,
              requestConfig
            );
            break;
          case 'PUT':
            response = await axios.put<ApiResponse<T>>(
              url,
              finalData,
              requestConfig
            );
            break;
          case 'DELETE':
            response = await axios.delete<ApiResponse<T>>(url, {
              data: finalData,
              ...requestConfig
            });
            break;
          case 'PATCH':
            response = await axios.patch<ApiResponse<T>>(
              url,
              finalData,
              requestConfig
            );
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
        setResponseCode(response.status);
        const responseData = response.data;
        if (responseData.code) setResponseCode(responseData.code);
        if (
        responseData.status === true ||
        response.status === 200 ||
        response.status === 201 ||
        responseData.success === true)
        {
          setData(responseData);
          if (!silent)
          alert.success(
            successMessage || responseData.message || 'Operation successful!'
          );
          return responseData;
        } else {
          if (
          (responseData.success === false || responseData.status === false) &&
          responseData.message && (
          responseData.message.toLowerCase().includes('invalid token') ||
          responseData.message.
          toLowerCase().
          includes('please log in again')))
          {
            if (!noRedirect) {
              Cookies.remove('accessToken');
              if (location.pathname !== '/') window.location.href = '/';
            }
            return responseData;
          }
          if (responseData.code === 401) {
            if (!noRedirect) window.location.href = '/';
            return responseData;
          } else if (responseData.code === 403) {
            if (!noRedirect) {
              Cookies.remove('accessToken');
              window.location.href = '/';
            }
            return responseData;
          } else {
            setData(responseData);
            if (!silent && showToastOnError)
            handleError(responseData.message, responseData.code, responseData);
            return responseData;
          }
        }
      } catch (err: unknown) {
        const axiosError = err as {
          response?: {
            status?: number;
            data?: ApiResponse<T> & {
              error?: {
                details?: string;
              };
            };
          };
          message?: string;
        };
        const errorResponseData = axiosError.response?.data;
        const statusCode = axiosError.response?.status || 500;
        setResponseCode(statusCode);
        const backendDetails = errorResponseData?.details;
        const nestedDetails = errorResponseData?.error?.details;
        const firstValidationError =
        errorResponseData?.errors?.[0]?.error ||
        errorResponseData?.errors?.[0]?.message;
        const topLevelMessage = errorResponseData?.message;
        const finalErrorMessage =
        backendDetails ||
        nestedDetails ||
        firstValidationError ||
        topLevelMessage ||
        axiosError.message ||
        DEFAULT_ERROR_MESSAGE;
        if (
        statusCode === 401 ||
        finalErrorMessage.toLowerCase().includes('invalid token'))
        {
          if (!noRedirect) {
            Cookies.remove('accessToken');
            if (location.pathname !== '/') window.location.href = '/';
          }
        }
        setError(finalErrorMessage);
        if (!silent && showToastOnError)
        handleError(finalErrorMessage, statusCode, errorResponseData);
        return (
          errorResponseData || {
            success: false,
            message: finalErrorMessage,
            details: finalErrorMessage,
            error: {
              code: statusCode,
              type: 'CLIENT_ERROR',
              details: finalErrorMessage
            }
          });

      } finally {
        setLoading(false);
      }
    },
    [initialEndpoint, options, handleError, location.pathname]
  );
  return {
    data,
    loading,
    error,
    responseCode,
    fetchData,
    reset
  };
};
export default useFetch;