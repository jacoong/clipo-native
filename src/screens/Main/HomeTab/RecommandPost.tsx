import React from 'react';
import HomeMenu from './HomeMenu';
import {typeValue} from './HomeMenu';
const RecommandPost: React.FC = () => {
  return <HomeMenu value={{type:'Recommand',label:'추천 스레드'}} activeTab="home" />;
};

export default RecommandPost;
 