import React from 'react';

import HomeMenu from './HomeMenu';

const FollowingPost: React.FC = () => {
  return (
    <HomeMenu
      value={{ type: 'FollowingPost', label: '팔로잉 스레드' }}
      activeTab="search"
    />
  );
};

export default FollowingPost;
