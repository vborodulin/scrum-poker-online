import { ExtensibleError } from '@chpokify/helpers';
import { Response, Request, NextFunction } from 'express';
import * as core from 'express-serve-static-core';
import { LabelValues } from 'prom-client';

import { typesHelpers } from '@core/types/helpers';

import { TUserDocument } from '@models/user';

export type TThrowError<T extends any, E extends Error = Error> = {
  data: T
} | {
  err: E
}

export type TSuccessResponse<T> = {
  error: null;
  result: T;
  meta: {
    time: number;
  };
};

export type TFailErrorData = {
  message: ExtensibleError['message'];
  details: ExtensibleError['details'];
  code: ExtensibleError['code'];
  stack?: ExtensibleError['stack'];
};

export type TFailResponse = {
  error: TFailErrorData;
  result: null;
  meta: {
    time: number;
  };
};

export type TAppRequest
  <P extends core.Params = core.ParamsDictionary,
  ReqBody = any,
  ReqQuery = core.Query> = Request<P, any, ReqBody, ReqQuery> &
  {
    timeStart: [number, number];
    promDurationTimer: (labels?: LabelValues<any>) => void;
    locale: string;
    user: TUserDocument;
    rawBody: string;
  };

export type TAppResponse<TResultResponse = any> = typesHelpers.Override<Response, {
  locals: Record<string, any> & {
    reqId: string;
    result: TResultResponse
  }
}>;

export type TAppNext = NextFunction;

export type TAppMiddleware = (
  req: TAppRequest,
  res: TAppResponse,
  next: TAppNext,
) => void;
