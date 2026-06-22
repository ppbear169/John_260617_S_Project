import type { Form, GetRef } from 'antd';
import React from 'react';

type FormInstance<T> = GetRef<typeof Form<T>>;

export const EditableContext = React.createContext<FormInstance<any> | null>(
  null,
);

export const Errors = {
  required: 'required',
  repeated: 'already exists',
  noError: 'noError',
} as const;
export type ErrorsType = (typeof Errors)[keyof typeof Errors];
