import { AxiosRequestConfig, AxiosInstance } from 'axios';

type Extract<T, U> = U extends keyof T ? T[U] : undefined;
type ValueOf<T> = T[keyof T];
type ExtractResponse<T, U extends number> = ValueOf<
  NonNullable<Extract<Extract<T, 'responses'>, U>>
>;
type ExtractParmeters<T> = Extract<T, 'parameters'> extends undefined
  ? void
  : Extract<T, 'parameters'>;
type SwaggerParams = { path: any; body: { data: any }; query: any };

const buildURL = (url: string, parameters: any = {}): string =>
  Object.keys(parameters).reduce(
    (acc, key) => acc.replace(new RegExp(`{${key}}`, 'g'), parameters[key]),
    url
  );

const swaggerClient =
  <paths>(axiosInstance: AxiosInstance) =>
  <Endpoint extends keyof paths, Method extends keyof paths[Endpoint]>(
    url: Endpoint,
    method: Method
  ) =>
  async (
    parameters: ExtractParmeters<paths[Endpoint][Method]>
  ): Promise<ExtractResponse<paths[Endpoint][Method], 200 | 201>> => {
    const swaggerParameters = (parameters || {}) as unknown as SwaggerParams;
    return axiosInstance
      .request({
        url: buildURL(url as string, swaggerParameters.path),
        method,
        params: swaggerParameters.query,
        data: swaggerParameters.body?.data,
      } as AxiosRequestConfig)
      .then(({ data }) => data);
  };

export default swaggerClient;
