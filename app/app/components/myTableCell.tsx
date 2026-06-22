import { Form, Input, Select, type InputRef } from 'antd';
import type { MyTypeSchema } from 'datalayer';
import { useContext, useEffect, useRef, useState } from 'react';
import { EditableContext, Errors, type ErrorsType } from '../utils';

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof MyTypeSchema;
  record: MyTypeSchema;
  handleSave: (record: MyTypeSchema) => void;
  handleValidate: (
    dataIndex: keyof MyTypeSchema,
    prevValue: string | number | boolean | undefined,
    record: MyTypeSchema,
  ) => ErrorsType;
}

export const EditableCell: React.FC<
  React.PropsWithChildren<EditableCellProps>
> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  handleValidate,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;
  const previousValue = record ? record[dataIndex] : '';
  const [error, setError] = useState<ErrorsType>(Errors.noError);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      setError(Errors.noError);
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      let values = await form.validateFields();
      if (dataIndex === 'dataType' && values[dataIndex] !== previousValue) {
        values = {
          ...values,
          defaultValue: values[dataIndex] === 'INT' ? 0 : true,
        };
      }
      const validateResult = handleValidate(dataIndex, previousValue, {
        ...record,
        ...values,
      });
      console.log('validateResult', validateResult);
      if (validateResult !== Errors.noError) {
        setError(validateResult);
        return;
      }

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        validateStatus={error !== Errors.noError ? 'error' : undefined}
        help={error !== Errors.noError ? `${title} ${error}` : undefined}
      >
        {dataIndex === 'dataType' ? (
          <Select onChange={save} onBlur={save}>
            <Select.Option value="INT">INT</Select.Option>
            <Select.Option value="BOOL">BOOL</Select.Option>
          </Select>
        ) : (
          <Input
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            autoComplete="off"
            disabled={dataIndex === 'defaultValue' && !record.dataType}
          />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24, height: '30px' }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
