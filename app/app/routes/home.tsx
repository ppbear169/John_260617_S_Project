import { Button } from 'antd';
import type { Route } from './+types/home';
import { useState } from 'react';
import type { MyTypeSchema } from 'datalayer';
import { MyTable } from '../components/myTable';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  return (
    <div className={'p-6'}>
      <MyTable />
    </div>
  );
}
