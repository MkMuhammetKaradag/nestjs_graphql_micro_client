import { gql } from '@apollo/client';

export const UPLOAD_PRODUCT_IMAGES = gql`
  mutation ProfilPhotoUpload(
    $input: ProductImagesUploadDto!
    $images: [Upload]!
  ) {
    productImagesUpload(productImagesUploadDto: $input, images: $images) {
      product {
        id
      }
    }
  }
`;
