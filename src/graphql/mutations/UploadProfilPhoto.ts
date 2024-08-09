import { gql } from '@apollo/client';

export const UPLOAD_PROFIL_PHOTO = gql`
  mutation ProfilPhotoUpload($image: Upload!) {
    profilPhotoUpload(image: $image) {
      profilPhoto
    }
  }
`;
