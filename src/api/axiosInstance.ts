import axios, { AxiosRequestConfig } from 'axios';
import { getAuth } from 'firebase/auth';
import config from '../config';

const axiosInstance = axios.create({
  baseURL: config.BACKEND_URL,
});

const shouldRefreshToken = (config: AxiosRequestConfig) => {
  const expiration = config.headers?.Expiration;
  const authToken = config.headers?.Authorization;
  if (!expiration || !authToken) return true;
  return new Date(expiration as string) >= new Date();
};

const refreshToken = async () => {
  const tokenResult = await getAuth().currentUser?.getIdTokenResult();
  if (tokenResult) {
    const { expirationTime, token } = tokenResult;
    // Subsequent requests will include these headers
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axiosInstance.defaults.headers.common['Expiration'] = expirationTime;
    return tokenResult.token;
  }
};

axiosInstance.interceptors.request.use(async (axiosConfig) => {
  if (shouldRefreshToken(axiosConfig)) {
    const token = await refreshToken();
    if (token)
      // We need to update axiosConfig so that current request doesn't fail
      axiosConfig.headers = {
        ...axiosConfig.headers,
        Authorization: `Bearer ${token}`,
      };
  }
  return axiosConfig;
});

const removeHeaders = () => {
  delete axiosInstance.defaults.headers.common['Authorization'];
  delete axiosInstance.defaults.headers.common['Expiration'];
};

getAuth().onAuthStateChanged((user) => !user && removeHeaders());

export default axiosInstance;
