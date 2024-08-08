import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GET_PRODUCT } from '../graphql/queries/GetProduct';
import { CREATE_COMMENT_PRODUCT_SUBSCRIPTION } from '../graphql/subcriptions/AddCommentProduct';
import { GET_COMMENTS } from '../graphql/queries/GetComments';
import CommentCard from '../components/app/CommentCard';
import Pagination from '../components/app/Pagination';
import styles from '../utils/styles';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CREATE_COMMENT } from '../graphql/mutations/CreateComment';
import toast from 'react-hot-toast';
interface Vendor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilPhoto: string;
}
export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  user: Vendor;
}

interface Product {
  id: number;
  description: string;
  price: number;
  quantity: number;
  images: string[] | null;
  name: string;
  // comments: Comment[] | null;
  vendor: Vendor;
}

const formSchema = z.object({
  comment: z.string().min(4, 'comment must be at least 4 characters long!'),
});
type CreateCommentSchema = z.infer<typeof formSchema>;

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CreateCommentSchema>({
    resolver: zodResolver(formSchema),
  });

  const {
    data: dataProduct,
    loading: loadingProduct,
    error,
    // subscribeToMore,
  } = useQuery(GET_PRODUCT, {
    variables: {
      input: {
        id: Number(id),
      },
    },
  });

  const {
    data: dataComments,
    loading: loadingComments,
    error: errorComments,
    subscribeToMore,
  } = useQuery(GET_COMMENTS, {
    variables: {
      input: {
        productId: Number(id),
        take: itemsPerPage,
        skip: itemsPerPage * (currentPage - 1),
      },
    },
  });

  const [createComment, { loading: createCommentLoading }] =
    useMutation(CREATE_COMMENT);

  const onSubmitCreateComment = async (data: CreateCommentSchema) => {
    try {
      await createComment({
        variables: {
          input: {
            productId: Number(id),
            comment: data.comment,
          },
        },
      });
      toast.success('Please check your email to reset your password!');
      reset();
    } catch (error: any) {
      console.log('GraphQL Errors:', error.graphQLErrors[0].message);
      toast.error(`Error  ${error.graphQLErrors[0].message}`);
    }
  };
  useEffect(() => {
    // Yeni ürünler eklendiğinde listeyi güncellemek için subscribeToMore'u kullanın
    const unsubscribe = subscribeToMore({
      document: CREATE_COMMENT_PRODUCT_SUBSCRIPTION,
      variables: {
        productId: Number(id),
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newComment = subscriptionData.data.createCommentProduct;
        return {
          ...prev,
          getComments: {
            ...prev.getComments,
            comments: [newComment, ...prev.getComments.comments],
            total: prev.getComments.total + 1,
          },
        };
      },
      onError: (err) => {
        // console.log('GraphQL Errors:', err.graphQLErrors[0].message);
        console.log(err);
      },
    });

    // Aboneliği bileşen temizlenirken iptal edin
    return () => unsubscribe();
  }, [subscribeToMore]);

  if (loadingProduct || loadingComments) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Bir hata oluştu: {error.message}</div>;
  }

  if (!dataProduct || !dataProduct.getProduct.product) {
    return <div>Ürün bulunamadı</div>;
  }

  if (errorComments) {
    return <div>Bir hata oluştu: {errorComments.message}</div>;
  }

  if (!dataComments || !dataComments.getComments.comments) {
    return <div>Ürün bulunamadı</div>;
  }
  const product: Product = dataProduct.getProduct.product;
  const comments: Comment[] | null = dataComments.getComments.comments;
  const { name, description, price, quantity, images, vendor } = product;
  const handleImageClick = (img: string) => {
    setSelectedImage(img);
  };
  const imageArray = images || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="container  mx-auto p-4">
      <div className="bg-white   rounded-lg shadow-lg p-6 ">
        <h1 className="text-3xl font-bold mb-4">
          {name} {comments ? comments.length : 0}
        </h1>

        <div className="grid h-[100%]  grid-cols-1 md:grid-cols-2 gap-10">
          {/* Resim Galerisi */}
          <div>
            {imageArray.length > 0 ? (
              <div className="flex flex-col items-center">
                <img
                  src={selectedImage || imageArray[0]}
                  alt={product.name}
                  className="w-full h-64 object-cover mb-4"
                />
                <div className="flex space-x-2">
                  {imageArray.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      className={`w-16 h-16 object-cover border-2 rounded cursor-pointer ${
                        selectedImage === img
                          ? 'border-blue-500'
                          : 'border-gray-300'
                      }`}
                      onClick={() => handleImageClick(img)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Resim Yok</span>
              </div>
            )}

            <div>
              <p className="text-gray-700 mb-4">{description}</p>
              <p className="text-2xl font-semibold text-blue-600 mb-4">
                ${price}
              </p>
              <p className="text-lg text-gray-500 mb-4">Stok: {quantity}</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Sepete Ekle
              </button>

              {/* Satıcı Bilgileri */}
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-2">Satıcı Bilgileri</h2>
                <p className="text-gray-700">{`${vendor.firstName} ${vendor.lastName}`}</p>
                <p className="text-gray-500">{vendor.email}</p>
              </div>
            </div>
          </div>

          {/* Ürün Bilgileri */}
          <div className="flex flex-col  relative">
            <div className="max-h-[84%] overflow-auto">
              {comments && comments?.length > 0 ? (
                comments.map((comment) => {
                  return <CommentCard comment={comment}></CommentCard>;
                })
              ) : (
                <div>Non Comment</div>
              )}
            </div>
            <div>
              <form onSubmit={handleSubmit(onSubmitCreateComment)}>
                <input
                  {...register('comment')}
                  type={'text'}
                  placeholder="comment"
                  className={`${styles.input}`}
                />
                {errors.comment && (
                  <span className="text-red-500 block mt-1">
                    {`${errors.comment.message}`}
                  </span>
                )}
              </form>
            </div>
            {comments && dataComments.getComments.total > comments.length && (
              <div className="flex  absolute bottom-0 justify-center">
                <Pagination
                  totalItems={dataComments.getComments.total}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                ></Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
