import React, { useState } from 'react';
import ImageDropzone from '../components/app/ImageDropzone';
import { useMutation } from '@apollo/client';
import { UPLOAD_PROFIL_PHOTO } from '../graphql/mutations/UploadProfilPhoto';

const MyProfilePage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProfilePhoto, { loading, error }] =
    useMutation(UPLOAD_PROFIL_PHOTO);

  const handleImagesUpload = () => {
    // console.log(files);
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
        multiple={true}
        maxFiles={3}
        setFiles={setFiles}
        // onImagesUpload={handleImagesUpload}
      />

      <div>
        <button
          disabled={files.length === 0}
          className="bg-red-500 p-3 text-white mt-3"
          onClick={handleImagesUpload}
        >
          send
        </button>
      </div>
    </div>
  );
};

export default MyProfilePage;
