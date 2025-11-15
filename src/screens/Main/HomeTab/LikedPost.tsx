import React from 'react';

import HomeMenu from './HomeMenu';

const LikedPost: React.FC = () => {
  return (
    <HomeMenu
      value={{ type: 'LikePost', label: '좋아요한 스레드' }}
      activeTab="favorites"
    />
  );
};

export default LikedPost;
