import { AxiosRequestConfig, AxiosInstance } from 'axios';

type Extract<T, U> = U extends keyof T ? T[U] : undefined;
type ValueOf<T> = T[keyof T];
type ExtractResponse<T, U extends number> = ValueOf<
  NonNullable<Extract<Extract<T, 'responses'>, U>>
>;
type ExtractParmeters<T> = Extract<T, 'parameters'> extends undefined
  ? void
  : Extract<T, 'parameters'>;
type SwaggerParams = { path: any; body: any; query: any };

const buildURL = (url: string, parameters: any = {}): string =>
  Object.keys(parameters).reduce(
    (acc, key) => acc.replace(new RegExp(`{${key}}`, 'g'), parameters[key]),
    url
  );

export const swaggerClient =
  <paths>(axiosInstance: AxiosInstance) =>
  <Endpoint extends keyof paths, Method extends keyof paths[Endpoint]>(
    url: Endpoint,
    method: Method
  ) =>
  async (
    parameters: ExtractParmeters<paths[Endpoint][Method]>
  ): Promise<ExtractResponse<paths[Endpoint][Method], 200 | 201>> =>
    axiosInstance
      .request({
        url: buildURL(
          url as string,
          (parameters as unknown as SwaggerParams)['path']
        ),
        method,
        data: (parameters as unknown as SwaggerParams)['body'],
      } as AxiosRequestConfig)
      .then(({ data }) => data);
