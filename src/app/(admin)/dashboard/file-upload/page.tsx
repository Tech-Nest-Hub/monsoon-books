'use client'
import React, { useState } from 'react'
import ImageUpload from './UploadImage';
import { MultiImageUpload } from './MultipleImageUpload';

const LetsSeeTheForm = () => {

  // inside your form
  const [coverImage, setCoverImage] = useState("");
  const [images, setImages] = useState<string[]>([]);

  return (
    <div>
      <ImageUpload value={coverImage} onChange={(url) => setCoverImage(url)} />
      <MultiImageUpload value={images} onChange={setImages} max={8} />
    </div>
  )
}

export default LetsSeeTheForm
