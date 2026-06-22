import { Form, Input, type InputRef } from 'antd';
import type { MyTypeSchema } from 'datalayer';
import { useContext, useEffect, useRef, useState } from 'react';
import { EditableContext, Errors, type ErrorsType } from '../utils';

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof MyTypeSchema;
  record: MyTypeSchema;
  handleSave: (record: MyTypeSchema) => void;
  handleValidate: (record: MyTypeSchema) => ErrorsType;
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
  const [error, setError] = useState(Errors.noError);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      // const validateResult = handleValidate(
      //   values[dataIndex],
      //   previousValue,
      //   record,
      // );

      // switch (validateResult) {
      //   case Errors.repeated:
      //     setError();
      //     return;
      //   default:
      //     setError(Errors.noError);
      //     break;
      // }

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
        help={error !== Errors.noError ? error : undefined}
      >
        <Input
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          autoComplete="off"
        />
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
