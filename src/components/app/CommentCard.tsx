import React, { FC } from 'react';
import { Comment } from '../../pages/ProductPage';
type CommentCardProps = {
  comment: Comment;
};
const CommentCard: FC<CommentCardProps> = ({ comment }) => {
  return (
    <div className="mx-2 my-1 ">
      <div className="flex  items-center">
        <div>
          {comment.user.profilPhoto ? (
            <img
              className="rounded-full h-8 w-8 object-cover"
              src={comment.user.profilPhoto}
            />
          ) : (
            <div className="rounded-full flex h-8 w-8 items-center justify-center bg-gray-200">
              <span className="text-gray-500">N</span>
            </div>
          )}
        </div>
        <div>
          <span className=" pl-2  text-slate-700">
            {comment.user.firstName} {comment.user.lastName}{' '}
          </span>
        </div>
      </div>
      <div className="pl-10">{comment.text}</div>

      <hr></hr>
    </div>
  );
};

export default CommentCard;
