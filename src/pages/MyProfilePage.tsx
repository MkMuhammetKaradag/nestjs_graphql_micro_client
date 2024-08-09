import React, { useState } from 'react';
import ImageDropzone from '../components/app/ImageDropzone';
import { useMutation } from '@apollo/client';
import { UPLOAD_PROFIL_PHOTO } from '../graphql/mutations/UploadProfilPhoto';

const MyProfilePage = () => {
  const [uploadProfilePhoto, { loading, error }] =
    useMutation(UPLOAD_PROFIL_PHOTO);

  const handleImagesUpload = (files: File[]) => {
    try {
      uploadProfilePhoto({
        variables: {
          image: files[0],
        },
        onCompleted: () => {
          console.log('comploted');
        },

        refetchQueries: ['GetMe'],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-1/2 mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6">Upload your Profil Photo</h2>
      {loading && <div>loading </div>}
      <ImageDropzone
        multiple={false}
        maxFiles={3}
        onImagesUpload={handleImagesUpload}
      />
    </div>
  );
};

export default MyProfilePage;
