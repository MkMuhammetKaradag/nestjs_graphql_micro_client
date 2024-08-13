import { useMutation, useQuery } from '@apollo/client';
import React, { FC, useEffect, useState } from 'react';
import { GET_COMMENTS } from '../../graphql/queries/GetComments';
import { CREATE_COMMENT } from '../../graphql/mutations/CreateComment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CREATE_COMMENT_PRODUCT_SUBSCRIPTION } from '../../graphql/subcriptions/AddCommentProduct';
import CommentCard from './CommentCard';
import styles from '../../utils/styles';
import Pagination from './Pagination';
import { z } from 'zod';
import { Comment } from '../../pages/ProductPage';
import toast from 'react-hot-toast';
const formSchema = z.object({
  comment: z.string().min(4, 'comment must be at least 4 characters long!'),
});
type CreateCommentSchema = z.infer<typeof formSchema>;

interface CommentsProps {
  id: number;
}
const Comments: React.FC<CommentsProps> = ({ id }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CreateCommentSchema>({
    resolver: zodResolver(formSchema),
  });
  const [createComment, { loading: createCommentLoading }] =
    useMutation(CREATE_COMMENT);
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
      toast.success('Comment added');
      reset();
    } catch (error: any) {
      console.log('GraphQL Errors:', error.graphQLErrors[0].message);
      toast.error(`Error  ${error.graphQLErrors[0].message}`);
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (errorComments) {
    return <div>Bir hata oluştu: {errorComments.message}</div>;
  }

  if (!dataComments || !dataComments.getComments.comments) {
    return <div>Ürün bulunamadı</div>;
  }
  const comments: Comment[] | null = dataComments.getComments.comments;
  return (
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
      <div className="absolute bottom-0 w-full">
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

        {comments && dataComments.getComments.total > comments.length && (
          <div className="flex  justify-center">
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
  );
};

export default Comments;
