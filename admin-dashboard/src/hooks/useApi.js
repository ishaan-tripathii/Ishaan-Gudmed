import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const handleRequest = useCallback(async (request) => {
    try {
      setLoading(true);
      setError(null);
      const response = await request();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((endpoint) => {
    return handleRequest(() => api.get(endpoint));
  }, [api, handleRequest]);

  const post = useCallback((endpoint, data) => {
    return handleRequest(() => api.post(endpoint, data));
  }, [api, handleRequest]);

  const put = useCallback((endpoint, data) => {
    return handleRequest(() => api.put(endpoint, data));
  }, [api, handleRequest]);

  const del = useCallback((endpoint) => {
    return handleRequest(() => api.delete(endpoint));
  }, [api, handleRequest]);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del
  };
};

export default useApi; 