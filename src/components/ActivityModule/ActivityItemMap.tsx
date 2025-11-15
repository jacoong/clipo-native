import ActivityAccountItem from '../../../compoents/AccountCard/ActivityAccountItem';
import ActivityDetail from '../../../compoents/AccountCard/ActivityDetail';
import { activityDetailType,activityType } from '../../../store/types';
import {useTheme} from '../../../customHook/useTheme';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import {useContext,useEffect,useState,ReactNode, act} from 'react';
import TransitionDiv from '../../../compoents/TransitionDiv';
import { Border_color_Type } from '../../../store/ColorAdjustion';
import { useUpdateisRead } from '../../../customHook/useUpdateisRead';
import NoNumberLoad from '../../../compoents/NoNumberLoad';
import { MdSearchOff } from 'react-icons/md';
import { HiOutlineSignalSlash } from "react-icons/hi2";
import Loading from '../../../compoents/Loading';

interface Props {
    activityValues: activityDetailType[]|null;
  }


const ActivityItemMap = ({ activityValues }: Props) => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const {handleUseUpdatedisRead} = useUpdateisRead();

    // 여기에다가 종합 함수 하나  생성, 함수 하나 더 생성
    // 
    const updateReadInfo = (activity: activityDetailType) =>{
      handleNavigate(activity);
      handleUseUpdatedisRead(activity.nno)
    }

    const handleNavigate = (activity: activityDetailType) => {
        const path = LinkToActivity(activity);
        navigate(path, { state: { isBack: true } });
      };
    
      const LinkToActivity = (activity: activityDetailType) => {
        const rno = activity.rno;
        const bno = activity.bno;
        const parentRe = activity.parentRe;
        const type = activity.type;
        const from = activity.from
        switch (type) {
            case 'reply':
            case 'reference':
            case 'longtime':
            case 'mention':
                if(parentRe !== null){
                  return `/main/@/${from}/post/${bno}/comment/${parentRe}/nestRe/${rno}`;
                }else if(rno !== null){
                  return `/main/@/${from}/post/${bno}/comment/${rno}`;
                }else{
                  return `/main/@/${from}/post/${bno}`;
                }
            case 'follow':
            case 'like':
                return`/main/@/${from}`;
            default:
                return '/main/activity'
        }
    
      };

      
    return (
      <div>
        {activityValues === null ? (
          <div className='items-center justify-center w-full h-[30vw] flex'>
            <Loading />
          </div>
        ) : activityValues.length === 0 ? (
          <NoNumberLoad
            title="활동 내역이 없습니다."
            description={'알림이 없습니다.\n새 활동이 생기면 여기에 표시됩니다.'}
            isDark={isDark}
            icon={<HiOutlineSignalSlash />}
          />
        ) : (
        activityValues.map((activity, id) => (
          <TransitionDiv isDark={isDark}>
          <div
            key={`activityMain-${id}`} // ✅ key는 최상위 div에 줘야 함
            onClick={() => updateReadInfo(activity)}
            className={`block border-b ${Border_color_Type(isDark)}`}
          >
            <ActivityAccountItem itemInfo={activity} isDark={isDark}>
              <ActivityDetail
                activity={activity}
                isDark={isDark}
              />
            </ActivityAccountItem>
          </div>
          </TransitionDiv>
        ))
        )}
      </div>
    );
  };
  
  export default ActivityItemMap;