import UploadPage from '@/components/UploadPage';
import { uploadImage } from '../actions';

export default async function Upload() {
  return <UploadPage uploadImage={uploadImage} />;
}
