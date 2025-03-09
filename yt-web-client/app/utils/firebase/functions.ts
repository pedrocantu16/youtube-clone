/* eslint-disable @typescript-eslint/no-explicit-any */
import {httpsCallable} from 'firebase/functions';
import { functions } from './firebase';

const generateUploadUlrFunction = httpsCallable(functions, 'generateUploadUrl');


export async function uploadVideo(file: File) {
    const response: any = await generateUploadUlrFunction({
        fileExtension: file.name.split('.').pop()
    });

    // Upload the file via the signed URL
    const uploadResult = await fetch(response?.data?.url, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type
        }
    });

    return uploadResult;
}

const getVideosFunction = httpsCallable(functions, 'getVideos');

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string  
}

export async function getVideos() {
  const response: any = await getVideosFunction();
  return response.data as Video[];
}

