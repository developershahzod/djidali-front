const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://demo-api.djidali.uz';

export const getImageUrl = (imageName: string | null | undefined): string => {
  if (!imageName) {
    return 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg';
  }

  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }
  return `${IMAGE_BASE_URL}${imageName}`;
};

export const getTourPrimaryImage = (tour: any): string => {
  if (tour.image) {
    return getImageUrl(tour.image);
  }

  if (Array.isArray(tour.images) && tour.images.length > 0) {
    const firstImg = tour.images[0];

    if (typeof firstImg === 'object' && firstImg !== null) {
      const imgObj = firstImg as any;
      if (imgObj.is_primary && imgObj.image_url) {
        return getImageUrl(imgObj.image_url);
      }
      if (imgObj.image_url) {
        return getImageUrl(imgObj.image_url);
      }
    }

    if (typeof firstImg === 'string' && firstImg.trim() !== '') {
      return getImageUrl(firstImg);
    }

    const primaryImg = tour.images.find(
      (img: any) =>
        typeof img === 'object' &&
        img !== null &&
        img.is_primary &&
        img.image_url
    );
    if (primaryImg && typeof primaryImg === 'object') {
      return getImageUrl((primaryImg as any).image_url);
    }
  }

  return 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg';
};
