import { Button, Table, type TableProps } from 'antd';
import type { MyTypeSchema } from 'datalayer';
import { useState } from 'react';
import { EditableRow } from './myTableRow';
import { EditableCell } from './myTableCell';
import { Errors } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import type { TableRowSelection } from 'antd/es/table/interface';

export const MyTable = () => {
  const [dataSource, setDataSource] = useState<MyTypeSchema[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  type ColumnTypes = Exclude<TableProps<MyTypeSchema>['columns'], undefined>;
  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: 'Index',
      dataIndex: '',
      width: '10%',
      editable: false,
      render: (_, record) => dataSource.indexOf(record) + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '20%',
      editable: true,
    },
    {
      title: 'Data Type',
      dataIndex: 'dataType',
      width: '20%',
      editable: true,
    },
    {
      title: 'Default Value',
      dataIndex: 'defaultValue',
      width: '20%',
      editable: true,
    },
    {
      title: 'Comment',
      dataIndex: 'comments',
      editable: true,
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: MyTypeSchema) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        handleValidate,
      }),
    };
  });

  const handleSave = (row: MyTypeSchema) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const handleValidate = (
    value: string,
    prevValue: string,
    record: MyTypeSchema,
  ) => {
    if (value !== prevValue) {
      return Errors.repeated;
    }
    return Errors.noError;
  };

  const handleAdd = () => {
    const newData: MyTypeSchema = {
      key: uuidv4(),
      name: '',
      dataType: undefined,
      defaultValue: undefined,
      comments: '',
    };
    setDataSource([...dataSource, newData]);
  };

  const handleDel = () => {
    setDataSource(
      dataSource.filter((item) => !selectedRowKeys.includes(item.key)),
    );
    setSelectedRowKeys([]);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<MyTypeSchema> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <div className={'flex flex-col'}>
        <div>
          <Button
            onClick={handleAdd}
            type="primary"
            style={{ marginBottom: 16 }}
          >
            Add a row
          </Button>
          <Button
            onClick={handleDel}
            type="primary"
            style={{ marginBottom: 16 }}
            disabled={
              selectedRowKeys.length === 0 || selectedRowKeys.length > 1
            }
          >
            Delete a row
          </Button>
        </div>
        <div>
          <Table<MyTypeSchema>
            components={{
              body: {
                row: EditableRow,
                cell: EditableCell,
              },
            }}
            rowSelection={rowSelection}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns as ColumnTypes}
          />
        </div>
      </div>
    </>
  );
};
