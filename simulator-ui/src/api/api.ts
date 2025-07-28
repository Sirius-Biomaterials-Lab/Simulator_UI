/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * AnisotropicFitResponse
 * Response model for fit operation
 */
export interface AnisotropicFitResponse {
  /**
   * Status
   * Operation status
   * @default "ok"
   */
  status?: string;
  /**
   * Parameters
   * Optimized parameters
   */
  parameters: AnisotropicParameterValue[];
  /**
   * Metrics
   * Evaluation metrics
   */
  metrics: AnisotropicMetric[];
  /** Plot data */
  plot_data: AnisotropicPlotData;
}

/**
 * AnisotropicMetric
 * Model for evaluation metrics
 */
export interface AnisotropicMetric {
  /**
   * Name
   * Metric name
   */
  name: string;
  /**
   * Value
   * Metric value
   */
  value: number | null;
}

/**
 * AnisotropicParameterValue
 * Model for optimized parameter values
 */
export interface AnisotropicParameterValue {
  /**
   * Name
   * Parameter name
   */
  name: string;
  /**
   * Value
   * Parameter value
   */
  value: number;
}

/**
 * AnisotropicPlotData
 * Model for plot data
 */
export interface AnisotropicPlotData {
  /**
   * Title
   * Plot title
   */
  title: string;
  /**
   * X Label
   * X-axis label
   */
  x_label: string;
  /**
   * Y Label
   * Y-axis label
   */
  y_label: string;
  /**
   * Lines
   * Plot lines
   */
  lines: AnisotropicPlotLine[];
}

/**
 * AnisotropicPlotLine
 * Model for plot line data
 */
export interface AnisotropicPlotLine {
  /**
   * Name
   * Line name
   */
  name: string;
  /**
   * X
   * X coordinates
   */
  x: number[];
  /**
   * Y
   * Y coordinates
   */
  y: number[];
}

/**
 * AnisotropicPredictResponse
 * Response model for prediction operation
 */
export interface AnisotropicPredictResponse {
  /**
   * Status
   * Operation status
   * @default "ok"
   */
  status?: string;
  /**
   * Metrics
   * Prediction metrics
   */
  metrics: AnisotropicMetric[];
  /** Plot data */
  plot_data: AnisotropicPlotData;
}

/**
 * AnisotropicResponse
 * Standard response model for anisotropic operations
 */
export interface AnisotropicResponse {
  /**
   * Status
   * Operation status
   * @default "error"
   */
  status?: string;
  /**
   * Detail
   * Additional details or error message
   */
  detail?: string | null;
}

/** Body_predict_model_modules_anisotropic_predict_post */
export interface BodyPredictModelModulesAnisotropicPredictPost {
  /**
   * File
   * Prediction data file (.csv)
   * @format binary
   */
  file: File;
}

/** Body_predict_model_modules_isotropic_predict_post */
export interface BodyPredictModelModulesIsotropicPredictPost {
  /**
   * File
   * @format binary
   */
  file: File;
}

/** Body_upload_model_modules_anisotropic_upload_model_post */
export interface BodyUploadModelModulesAnisotropicUploadModelPost {
  /** Model Type */
  model_type: "GOH" | "HOG";
  /** Alpha */
  alpha?: number | string | null;
  /** Kappa */
  kappa?: number | string | null;
  /** Files */
  files: File[];
}

/** Body_upload_model_modules_isotropic_upload_model_post */
export interface BodyUploadModelModulesIsotropicUploadModelPost {
  /**
   * Hyperlastic Model
   * Hyperlastic model identifier
   */
  hyperlastic_model:
    | "NeoHookean"
    | "MooneyRivlin"
    | "GeneralizedMooneyRivlin"
    | "Beda"
    | "Yeoh"
    | "Gent"
    | "Carroll";
  /**
   * Files
   * Model file (.csv, .xls, .xlsx)
   */
  files: File[];
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** IsotropicFitResponse */
export interface IsotropicFitResponse {
  /**
   * Status
   * @default "ok"
   */
  status?: string;
  /**
   * Metrics
   * @default [{"name":"metric1","value":0.5}]
   */
  metrics?: Metric[];
  /**
   * Parameters
   * @default [{"name":"parameter1","value":0.5}]
   */
  parameters?: Parameter[];
  /** @default {"name":"test","x_label":"test_x_label","y_label":"test_y_label","lines":[{"name":"test","x":[0,1,2,3,4,5,6,7,8,9,10],"y":[0,1,2,3,4,5,6,7,8,9,10]}]} */
  plot_data?: PlotData;
}

/** IsotropicPredictResponse */
export interface IsotropicPredictResponse {
  /**
   * Status
   * @default "ok"
   */
  status?: string;
  /**
   * Metrics
   * @default [{"name":"metric1","value":0.5}]
   */
  metrics?: Metric[];
  /** @default {"name":"test","x_label":"test_x_label","y_label":"test_y_label","lines":[{"name":"test","x":[0,1,2,3,4,5,6,7,8,9,10],"y":[0,1,2,3,4,5,6,7,8,9,10]}]} */
  plot_data?: PlotData;
}

/** IsotropicResponse */
export interface IsotropicResponse {
  /**
   * Status
   * @default "error"
   */
  status?: string;
  /** Detail */
  detail?: string | null;
}

/** Line */
export interface Line {
  /**
   * Name
   * @default "test"
   */
  name?: string;
  /**
   * X
   * @default [0,1,2,3,4,5,6,7,8,9,10]
   */
  x?: number[];
  /**
   * Y
   * @default [0,1,2,3,4,5,6,7,8,9,10]
   */
  y?: number[];
}

/** Metric */
export interface Metric {
  /**
   * Name
   * @default "metric1"
   */
  name?: string;
  /**
   * Value
   * @default 0.5
   */
  value?: number | null;
}

/** Parameter */
export interface Parameter {
  /**
   * Name
   * @default "parameter1"
   */
  name?: string;
  /**
   * Value
   * @default 0.5
   */
  value?: number;
}

/** PlotData */
export interface PlotData {
  /**
   * Name
   * @default "test"
   */
  name?: string;
  /**
   * X Label
   * @default "test_x_label"
   */
  x_label?: string;
  /**
   * Y Label
   * @default "test_y_label"
   */
  y_label?: string;
  /**
   * Lines
   * @default [{"name":"test","x":[0,1,2,3,4,5,6,7,8,9,10],"y":[0,1,2,3,4,5,6,7,8,9,10]}]
   */
  lines?: Line[];
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title FastAPI
 * @version 0.1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags Auth
     * @name LoginCookieAuthLoginCookiePost
     * @summary Login Cookie
     * @request POST:/auth/login-cookie/
     * @secure
     */
    loginCookieAuthLoginCookiePost: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/auth/login-cookie/`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name LogoutCookieAuthLogoutCookieGet
     * @summary Logout Cookie
     * @request GET:/auth/logout-cookie/
     */
    logoutCookieAuthLogoutCookieGet: (params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/auth/logout-cookie/`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  modules = {
    /**
     * @description Uploads a model file (.csv, .xls, .xlsx) for isotropic processing.
     *
     * @tags isotropic
     * @name UploadModelModulesIsotropicUploadModelPost
     * @summary Upload Model
     * @request POST:/modules/isotropic/upload_model
     */
    uploadModelModulesIsotropicUploadModelPost: (
      data: BodyUploadModelModulesIsotropicUploadModelPost,
      params: RequestParams = {},
    ) =>
      this.request<IsotropicResponse, IsotropicResponse | HTTPValidationError>({
        path: `/modules/isotropic/upload_model`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Runs fitting algorithm on the uploaded isotropic data.
     *
     * @tags isotropic
     * @name FitModelModulesIsotropicFitPost
     * @summary Fit Model
     * @request POST:/modules/isotropic/fit
     */
    fitModelModulesIsotropicFitPost: (params: RequestParams = {}) =>
      this.request<IsotropicFitResponse, HTTPValidationError>({
        path: `/modules/isotropic/fit`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description Performs predictions based on the isotropic model with provided input data.
     *
     * @tags isotropic
     * @name PredictModelModulesIsotropicPredictPost
     * @summary Predict Model
     * @request POST:/modules/isotropic/predict
     */
    predictModelModulesIsotropicPredictPost: (
      data: BodyPredictModelModulesIsotropicPredictPost,
      params: RequestParams = {},
    ) =>
      this.request<IsotropicPredictResponse, HTTPValidationError>({
        path: `/modules/isotropic/predict`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags isotropic
     * @name DeleteItemModulesIsotropicFileFilenameDelete
     * @summary Delete Item
     * @request DELETE:/modules/isotropic/file/{filename}
     */
    deleteItemModulesIsotropicFileFilenameDelete: (
      filename: string,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/modules/isotropic/file/${filename}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags isotropic
     * @name CalculateEnergyModulesIsotropicCalculateEnergyPost
     * @summary Calculate Energy
     * @request POST:/modules/isotropic/calculate_energy
     */
    calculateEnergyModulesIsotropicCalculateEnergyPost: (
      params: RequestParams = {},
    ) =>
      this.request<string, HTTPValidationError>({
        path: `/modules/isotropic/calculate_energy`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags isotropic
     * @name DeleteItemModulesIsotropicClearDataDelete
     * @summary Delete Item
     * @request DELETE:/modules/isotropic/clear_data
     */
    deleteItemModulesIsotropicClearDataDelete: (params: RequestParams = {}) =>
      this.request<void, HTTPValidationError>({
        path: `/modules/isotropic/clear_data`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Uploads model files (.csv) for anisotropic processing with GOH or HOG models.
     *
     * @tags anisotropic
     * @name UploadModelModulesAnisotropicUploadModelPost
     * @summary Upload Model
     * @request POST:/modules/anisotropic/upload_model
     */
    uploadModelModulesAnisotropicUploadModelPost: (
      data: BodyUploadModelModulesAnisotropicUploadModelPost,
      params: RequestParams = {},
    ) =>
      this.request<
        AnisotropicResponse,
        AnisotropicResponse | HTTPValidationError
      >({
        path: `/modules/anisotropic/upload_model`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Runs parameter optimization on uploaded anisotropic data using GOH/HOG models.
     *
     * @tags anisotropic
     * @name FitModelModulesAnisotropicFitPost
     * @summary Fit Model
     * @request POST:/modules/anisotropic/fit
     */
    fitModelModulesAnisotropicFitPost: (params: RequestParams = {}) =>
      this.request<
        AnisotropicFitResponse,
        AnisotropicResponse | HTTPValidationError
      >({
        path: `/modules/anisotropic/fit`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description Performs predictions using fitted anisotropic model on provided data.
     *
     * @tags anisotropic
     * @name PredictModelModulesAnisotropicPredictPost
     * @summary Predict Model
     * @request POST:/modules/anisotropic/predict
     */
    predictModelModulesAnisotropicPredictPost: (
      data: BodyPredictModelModulesAnisotropicPredictPost,
      params: RequestParams = {},
    ) =>
      this.request<
        AnisotropicPredictResponse,
        AnisotropicResponse | HTTPValidationError
      >({
        path: `/modules/anisotropic/predict`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes a specific uploaded file.
     *
     * @tags anisotropic
     * @name DeleteFileModulesAnisotropicFileFilenameDelete
     * @summary Delete File
     * @request DELETE:/modules/anisotropic/file/{filename}
     */
    deleteFileModulesAnisotropicFileFilenameDelete: (
      filename: string,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/modules/anisotropic/file/${filename}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Clears all uploaded data and fitted models for the session.
     *
     * @tags anisotropic
     * @name ClearAllDataModulesAnisotropicClearDataDelete
     * @summary Clear All Data
     * @request DELETE:/modules/anisotropic/clear_data
     */
    clearAllDataModulesAnisotropicClearDataDelete: (
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/modules/anisotropic/clear_data`,
        method: "DELETE",
        ...params,
      }),
  };
  metrics = {
    /**
     * @description Endpoint that serves Prometheus metrics.
     *
     * @tags monitoring
     * @name MetricsMetricsGet
     * @summary Metrics
     * @request GET:/metrics
     */
    metricsMetricsGet: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/metrics`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
