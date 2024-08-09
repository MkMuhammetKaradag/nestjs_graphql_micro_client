import React from 'react';
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import styles from '../../utils/styles';
interface CreateProductFormProps {
  // onImagesUpload: (files: File[]) => void;
  register: UseFormRegister<{
    description: string;
    price: number;
    quantity: number;
    name: string;
  }>;
  // handleSubmit: UseFormHandleSubmit<
  //   {
  //     description: string;
  //     price: number;
  //     quantity: number;
  //     name: string;
  //   },
  //   undefined
  // >;
  // watch: UseFormWatch<{
  //   description: string;
  //   price: number;
  //   quantity: number;
  //   name: string;
  // }>;
  errors: FieldErrors<{
    description: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({
  register,

  errors,
}) => {
  return (
    <>
      <input
        {...register('description')}
        type="text"
        placeholder="Description"
        className={`${styles.input} mt-3 mb-1`}
      />
      {errors.description && (
        <span className="text-red-500 block mt-1">
          {`${errors.description.message}`}
        </span>
      )}

      <input
        {...register('price')}
        type="number"
        placeholder="Price"
        className={`${styles.input} mt-3 mb-1`}
      />
      {errors.price && (
        <span className="text-red-500 block mt-1">
          {`${errors.price.message}`}
        </span>
      )}
      <input
        {...register('quantity')}
        type="number"
        placeholder="Quantity"
        className={`${styles.input} mt-3 mb-1`}
      />
      {errors.quantity && (
        <span className="text-red-500 block mt-1">
          {`${errors.quantity.message}`}
        </span>
      )}
      <input
        {...register('name')}
        type="text"
        placeholder="Product Name"
        className={`${styles.input} mt-3 mb-1`}
      />
      {errors.name && (
        <span className="text-red-500 block mt-1">
          {`${errors.name.message}`}
        </span>
      )}
    </>
  );
};

export default CreateProductForm;
