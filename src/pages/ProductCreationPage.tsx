import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Stepper from '../components/app/Stepper';
import CreateProductForm from '../components/app/CreateProductForm';
import ImageDropzone from '../components/app/ImageDropzone';
import { useMutation } from '@apollo/client';
import { CREATE_PRODUCT } from '../graphql/mutations/CreateProduct';
import toast from 'react-hot-toast';
import { UPLOAD_PRODUCT_IMAGES } from '../graphql/mutations/UploadProductImages';
import { useNavigate } from 'react-router-dom';
const formSchema = z.object({
  description: z
    .string()
    .min(20, 'description must be at least 2 chracters long!'),
  price: z.preprocess(
    (value) => parseFloat(value as string),
    z.number().gte(10)
  ),
  quantity: z.preprocess(
    (value) => parseInt(value as string, 10),
    z.number().gte(1)
  ),
  name: z.string().min(4, 'name must be at least 4 characters long!'),
});

type ProductSchema = z.infer<typeof formSchema>;

const ProductCreationPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [productId, setProductId] = useState<number>();
  const navigate = useNavigate();
  const [CreateProduct, { loading: createProductLoading }] =
    useMutation(CREATE_PRODUCT);

  const [uploadProductImages, { loading: uploadImagesLoading }] = useMutation(
    UPLOAD_PRODUCT_IMAGES
  );
  const handleImagesUpload = () => {
    if (files.length > 0 || productId) {
      try {
        uploadProductImages({
          variables: {
            input: {
              id: productId,
            },
            images: files,
          },
          onCompleted: () => {
            console.log('comploted');
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
  } = useForm<ProductSchema>({
    resolver: zodResolver(formSchema),
  });
  const createProductSubmit = async (data: ProductSchema) => {
    await CreateProduct({
      variables: {
        input: {
          ...data,
        },
      },
    })
      .then((res) => {
        if (res.data.createProduct.product) {
          toast.success('login');
          setProductId(res.data.createProduct.product.id);
          reset(); //
        }
      })
      .catch((error) => {
        console.log('GraphQL Errors:', error.graphQLErrors[0].message);
        toast.error(`hata  ${error.graphQLErrors[0].message}`);
      });
  };

  const steps = [
    {
      title: 'Create Product ',
      content: (
        <CreateProductForm
          register={register}
          errors={errors}
        ></CreateProductForm>
      ),
      onClickSubmit: handleSubmit(createProductSubmit),
      buttonDisable:
        !watch('description') ||
        !watch('name') ||
        !watch('price') ||
        !watch('quantity'),
      buttonName: 'Next',
    },
    {
      title: 'Upload Images',
      content: (
        <ImageDropzone
          maxFiles={3}
          multiple={true}
          setFiles={setFiles}
        ></ImageDropzone>
      ),
      onClickSubmit: handleImagesUpload,
      buttonName: 'Next',
    },

    {
      title: 'Adım 3',
      content: <div>sdsds</div>,
      onClickSubmit: () => {
        console.log('adım 3 tıklandı');
        navigate('/');
      },
      buttonName: 'son',
      buttonDisable: false,
    },
  ];

  return (
    <div className=" bg-whiterounded overflow-hidden shadow-lg p-3 relative   bg-white">
      <Stepper steps={steps} />
    </div>
  );
};

export default ProductCreationPage;
