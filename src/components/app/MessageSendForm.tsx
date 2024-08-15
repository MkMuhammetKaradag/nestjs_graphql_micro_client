import React from 'react';
import styles from '../../utils/styles';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CREATE_MESSAGE } from '../../graphql/mutations/CreateMessage';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
interface MessageSendFormProps {
  id: number;
}

const formSchema = z.object({
  content: z.string().min(4, 'comment must be at least 4 characters long!'),
});
type CreateMessageSchema = z.infer<typeof formSchema>;
const MessageSendForm: React.FC<MessageSendFormProps> = ({ id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CreateMessageSchema>({
    resolver: zodResolver(formSchema),
  });
  const [createmMessage, { loading: createMessageLoading }] =
    useMutation(CREATE_MESSAGE);

  const onSubmitSendMessage = async (data: CreateMessageSchema) => {
    try {
      await createmMessage({
        variables: {
          input: {
            chatId: Number(id),
            content: data.content,
          },
        },
      });
      toast.success('message send  ');
      reset();
    } catch (error: any) {
      console.log('GraphQL Errors:', error.graphQLErrors[0].message);
      toast.error(`Error  ${error.graphQLErrors[0].message}`);
    }
  };
  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit(onSubmitSendMessage)}>
        <input
          {...register('content')}
          type={'text'}
          placeholder="Message"
          className={`${styles.input}`}
        />
        {errors.content && (
          <span className="text-red-500 block mt-1">
            {`${errors.content.message}`}
          </span>
        )}
      </form>
    </div>
  );
};

export default MessageSendForm;
