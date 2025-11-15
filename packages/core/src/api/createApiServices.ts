import type { AxiosInstance } from 'axios';
import { LoginType, SMS, SMSValidate, socialLogin, usernameProfile, pageIndex, userPosts, fetchFollowType, fetchLikedUser } from '../types';

export interface ApiDependencies {
  instance: AxiosInstance;
  formInstance: AxiosInstance;
  request: AxiosInstance;
}

export function createApiServices({ instance, formInstance, request }: ApiDependencies) {
  const Axios = request;

// const instanceMock = new AxiosMockAdapter(instance,{ delayResponse: 1000 });
// const axiosMock = new AxiosMockAdapter(Axios,{ delayResponse: 1000 });
// axiosMock.onPost('api/auth/login').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//         body: {
//           accessToken: 'sefasefa',
//           refreshToken: 'sefasefa',
//           validatefime: '2024-11-15T12:00:00Z',
//         },
//     },
//   ];
// });

// // Mock response for the signup API
// axiosMock.onPost('api/auth/signup').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//       email: '327561@naver.com',
//       password: '12awdawdwa34',
//         message: 'Signup successful!',
//         body: {},
//     },
//   ];
// });

// axiosMock.onPost('api/auth/send/phone').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: 'SMS sending successful!',
//     },
//   ];
// });

// axiosMock.onPost('api/auth/send/verification').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: 'SMS verification successful!',
//     },
//   ];
// });

// axiosMock.onPost('api/auth/recreatePassword/+8201094711807').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "임시 비밀번호 발급",
//     body: null
//     },
//   ];
// });
  

// instanceMock.onGet('api/get/user/information').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "유저정보를 확인했습니다",
//     body: {
//     email:'327561@naver.com',
//     nickName:'nickN',
//     profilePicture:'default_1',
//     // nickName:'hyunwu',
//     // profilePicture:'https://www.google.com/imgres?q=picture&imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fthumbnails%2F036%2F324%2F708%2Fsmall_2x%2Fai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg&imgrefurl=https%3A%2F%2Fwww.vecteezy.com%2Ffree-photos%2Fpicture&docid=wska7sM6RxRdCM&tbnid=RwwbN3rxhf-iNM&vet=12ahUKEwip9sTPnN6JAxX5m68BHbvGNagQM3oECBUQAA..i&w=600&h=400&hcb=2&itg=1&ved=2ahUKEwip9sTPnN6JAxX5m68BHbvGNagQM3oECBUQAA',
// }
//     },
//   ];
// });


// instanceMock.onGet('api/board/randomBoard/0').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body:[
//   {
//     typeOfPost:'board',
//     bno:19,
//     boardImages:['https://plus.unsplash.com/premium_photo-1732746888692-d8129397a4dd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D','https://images.unsplash.com/photo-1732948937655-095f68551734?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D'],
//     nickName: 'johnDoe',
//     profilePicture: 'https://example.com/profile1.jpg',
//     numberOfLike: 12,
//     numberOfComments: 5,
//     contents: 'Exploring the mountains!',
//     tags: ['hiking', 'adventure', 'travel'],
//     regData: '2024-11-15',
//     isLike:false,
//     isFollowing:true,
//     isLikeVisible:true,
//     isReplyAllowed:true
//   },
//   {
//     typeOfPost:'board',
//     bno:20,
//     boardImages:['https://plus.unsplash.com/premium_photo-1732746888692-d8129397a4dd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D','https://images.unsplash.com/photo-1732948937655-095f68551734?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D'],
//     nickName: 'nickN',
//     profilePicture: 'default_1',
//     numberOfLike: 20,
//     numberOfComments: 10,
//     contents: 'Enjoying coffee at the best cafe in town ☕ #ㄹㄴㄷㄹ',
//     tags: ['#ㄹㄴㄷㄹ'],
//     regData: '2024-11-14',
//     isLike:true
//     ,isFollowing:false,
//     isLikeVisible:true,
//     isReplyAllowed:true
//   },
//   {
//     typeOfPost:'board',
//     bno:21,
//     boardImages:['https://images.unsplash.com/photo-1732948937655-095f68551734?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D'],
//     nickName: 'nickN',
//     profilePicture: 'https://example.com/profile3.jpg',
//     numberOfLike: 50,
//     numberOfComments: 30,
//     contents: 'Nature is my therapy 🌿',
//     tags: ['nature', 'therapy', 'peace'],
//     regData: '2024-11-13',
//     isLike:true
//     ,isFollowing:false,
//     isLikeVisible:false,
//     isReplyAllowed:false
//   },
//   {
//     typeOfPost:'board',
//     bno:22,
//     boardImages:['https://plus.unsplash.com/premium_photo-1732746888692-d8129397a4dd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D','https://images.unsplash.com/photo-1732948937655-095f68551734?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D','https://plus.unsplash.com/premium_photo-1666739087695-15880e5f9354?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'],
//     nickName: 'chefMike',
//     profilePicture: 'default_1',
//     numberOfLike: 35,
//     numberOfComments: 12,
//     contents: 'My latest recipe: Creamy Mushroom Pasta 🍝',
//     tags: ['food', 'recipe', 'pasta'],
//     regData: '2024-11-12',
//     isLike:false
//     ,isFollowing:false,
//     isLikeVisible:false,
//     isReplyAllowed:false
//   },
//   {
//     typeOfPost:'board',
//     bno:23,
//     boardImages:['https://plus.unsplash.com/premium_photo-1732746888692-d8129397a4dd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D','https://images.unsplash.com/photo-1732948937655-095f68551734?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D','https://plus.unsplash.com/premium_photo-1666739087695-15880e5f9354?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D','https://plus.unsplash.com/premium_photo-1666739087695-15880e5f9354?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D'],
//     nickName: 'catLover123',
//     profilePicture: 'https://example.com/profile5.jpg',
//     numberOfLike: 100,
//     numberOfComments: 45,
//     contents: 'My cat Simba being adorable as always 😻',
//     tags: ['cat', 'cute', 'pet'],
//     regData: '2024-11-11',
//     isLike:true
//     ,isFollowing:false,
//     isLikeVisible:true,
//     isReplyAllowed:true
//   },
//     ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/randomBoard/1').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body:[
//       {
//         typeOfPost:'board',
//         bno:1,
//         boardImages:[],
//         nickName: 'adventureAddict',
//         profilePicture: 'https://example.com/profile15.jpg',
//         numberOfLike: 45,
//         numberOfComments: 12,
//         contents: 'Ziplining through the forest canopy 🌲',
//         tags: ['adventure', 'zipline', 'forest'],
//         regData: '2024-11-01',
//         isLike:false
//       },
//       {
//         typeOfPost:'board',
//         bno:2,
//         boardImages:[],
//         nickName: 'bakingQueen',
//         profilePicture: 'default_1',
//         numberOfLike: 60,
//         numberOfComments: 20,
//         contents: 'Freshly baked cookies for the family 🍪',
//         tags: ['baking', 'cookies', 'home'],
//         regData: '2024-10-31',
//         isLike:false
//       },
//       {
//         typeOfPost:'board',
//         bno:3,
//         boardImages:[],
//         nickName: 'beachBum',
//         profilePicture: 'https://example.com/profile17.jpg',
//         numberOfLike: 85,
//         numberOfComments: 30,
//         contents: 'Beach vibes all day 🌊',
//         tags: ['beach', 'summer', 'relaxation'],
//         regData: '2024-10-30',
//         isLike:false
//       },
//       {
//         typeOfPost:'board',
//         bno:4,
//         boardImages:[],
//         nickName: 'gamerPro',
//         profilePicture: 'https://example.com/profile18.jpg',
//         numberOfLike: 90,
//         numberOfComments: 35,
//         contents: 'Reached top rank in my favorite game 🎮',
//         tags: ['gaming', 'victory', 'pro'],
//         regData: '2024-10-29',
//         isLike:false
//       },
//       {
//         typeOfPost:'board',
//         bno:5,
//         boardImages:[],
//         nickName: 'foodieJoy',
//         profilePicture: 'default_1',
//         numberOfLike: 47,
//         numberOfComments: 14,
//         contents: 'Discovered the best ramen spot 🍜',
//         tags: ['food', 'ramen', 'yummy'],
//         regData: '2024-10-28',
//         isLike:false
//       },
//     ]
//     },
//   ];
// });
// instanceMock.onGet('api/board/randomBoard/2').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body: [
//       {
//         typeOfPost:'board',
//         bno:8,
//         boardImages:[],
//         nickName: 'bookWorm',
//         profilePicture: 'https://example.com/profile8.jpg',
//         numberOfLike: 25,
//         numberOfComments: 7,
//         contents: 'Just finished reading "The Great Gatsby" 📚',
//         tags: ['books', 'reading', 'literature'],
//         regData: '2024-11-08',
//         isLike:false
//       },
//       {
//         typeOfPost:'board',
//         bno:9,
//         boardImages:[],
//         nickName: 'photoArt',
//         profilePicture: 'https://example.com/profile9.jpg',
//         numberOfLike: 90,
//         numberOfComments: 32,
//         contents: 'Captured this beautiful sunset today 🌅',
//         tags: ['photography', 'sunset', 'art'],
//         regData: '2024-11-07',
//         isLike:false
//       },
//       {
//         typeOfPost:'board',
//         bno:10,
//         boardImages:[],
//         nickName: 'techieTim',
//         profilePicture: 'default_1',
//         numberOfLike: 15,
//         numberOfComments: 5,
//         contents: 'Excited about the new AI advancements 🤖',
//         tags: ['tech', 'AI', 'future'],
//         regData: '2024-11-06',
//         isLike:false
//       },
//       {
//         typeOfPost:'board',
//         bno:11,
//         boardImages:[],
//         nickName: 'cityExplorer',
//         profilePicture: 'https://example.com/profile11.jpg',
//         numberOfLike: 40,
//         numberOfComments: 15,
//         contents: 'Discovered a hidden gem in downtown 🌇',
//         tags: ['citylife', 'exploration', 'hidden'],
//         regData: '2024-11-05',
//         isLike:false
//       },
//       {
//         typeOfPost:'board',
//         bno:12,
//         boardImages:[],
//         nickName: 'musicManiac',
//         profilePicture: 'https://example.com/profile12.jpg',
//         numberOfLike: 53,
//         numberOfComments: 19,
//         contents: 'Can’t stop listening to this new track 🎵',
//         tags: ['music', 'song', 'playlist'],
//         regData: '2024-11-04',
//         isLike:false
//       },
//     ]
//   },
//   ]
//   });
//   instanceMock.onGet('api/board/randomBoard/3').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body:[
//       {
//         typeOfPost:'board',
//         bno:15,
//         boardImages:[],
//         nickName: 'skyWatcher',
//         profilePicture: 'default_1',
//         numberOfLike: 32,
//         numberOfComments: 10,
//         contents: 'Caught a meteor shower last night 🌠',
//         tags: ['astronomy', 'sky', 'night'],
//         regData: '2024-10-25',
//         isLike:false
//       },
//       {
//         typeOfPost:'board',
//         bno:16,
//         boardImages:[],
//         nickName: 'flowerFanatic',
//         profilePicture: 'https://example.com/profile23.jpg',
//         numberOfLike: 29,
//         numberOfComments: 9,
//         contents: 'My garden is blooming beautifully 🌷',
//         tags: ['garden', 'flowers', 'nature'],
//         regData: '2024-10-24',
//         isLike:false
//       },
//       {
//         typeOfPost:'board',
//         bno:17,
//         boardImages:[],
//         nickName: 'urbanRunner',
//         profilePicture: 'https://example.com/profile24.jpg',
//         numberOfLike: 58,
//         numberOfComments: 18,
//         contents: 'Morning runs are the best 🏃‍♂️',
//         tags: ['running', 'health', 'city'],
//         regData: '2024-10-23',
//         isLike:false
//       },
//       {
//         typeOfPost:'board',
//         bno:18,
//         boardImages:[],
//         nickName: 'kitchenKing',
//         profilePicture: 'https://example.com/profile25.jpg',
//         numberOfLike: 40,
//         numberOfComments: 12,
//         contents: 'Cooking is an art 🥘',
//         tags: ['cooking', 'recipe', 'kitchen'],
//         regData: '2024-10-22',
//         isLike:false
//       },
//   ]
// },
// ]
// });

// instanceMock.onGet('api/board/randomBoard/4').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body:[
//   ]
// },
// ]
// });

// instanceMock.onGet('/api/get/userInformation/otherUser').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "유저 조회 완료",
//     body:{
//         email: "otherUser@gmail.com",
//         nickName: 'otherUser',
//         profilePicture: 'https://images.unsplash.com/photo-1731484396266-b80443ec385b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
//         backgroundPicture: 'https://images.unsplash.com/photo-1731451162502-491cf56d78ec?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D',
//         location: null,
//         description: null,
//         followingNumber: 3,
//        followerNumber: 0,
//         brithDay: null,
//         isFollowing:true
//     }
// },
// ]
// });

// instanceMock.onGet('/api/get/userInformation/johnDoe').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "유저 조회 완료",
//     body:{
//         email: "johnDoe@gmail.com",
//         nickName: 'johnDoe',
//         profilePicture: 'https://images.unsplash.com/photo-1731484396266-b80443ec385b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
//         backgroundPicture: 'https://images.unsplash.com/photo-1731451162502-491cf56d78ec?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D',
//         location: null,
//         description: null,
//         followingNumber: 3,
//        followerNumber: 0,
//         brithDay: null,
//         isFollowing:true
//     }
// },
// ]
// });

// instanceMock.onGet('/api/get/userInformation/anotherUser').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "유저 조회 완료",
//     body:{
//         email: "anotherUser@gmail.com",
//         nickName: 'anotherUser',
//         profilePicture: 'https://images.unsplash.com/photo-1712847333437-f9386beb83e4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGh1bWFufGVufDB8fDB8fHww',
//         backgroundPicture: 'https://images.unsplash.com/flagged/photo-1552863473-6e5ffe5e052f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGh1bWFufGVufDB8fDB8fHww',
//         location: null,
//         description: null,
//         followingNumber: 3,
//        followerNumber: 0,
//         brithDay: null,
//         isFollowing:false
//     }
// },
// ]
// });

// instanceMock.onGet('/api/get/userInformation/nickN').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "유저 조회 완료",
//     body:{
//         email: "327561@gmail.com",
//         nickName: 'nickN',
//         profilePicture: 'https://images.unsplash.com/photo-1731271140119-34ad9551ff10?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8',
//         backgroundPicture: 'https://images.unsplash.com/photo-1731331095592-c86db3fa1d51?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8',
//         location: 'Seoul, Korea',
//         description: 'test description',
//         followingNumber: 3,
//        followerNumber: 0,
//         brithDay: '1999,08,12'
//     }
// },
// ]
// });


// instanceMock.onGet('api/board/postInfo/nickN/post/0').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//       body:[
//       {
//         typeOfPost:'reply',
//         rno:19,
//         commentImage:null,
//         nickName: 'johnDoe',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments: 5,
//         contents: 'Exploring the mountains!',
//         tags: ['hiking', 'adventure', 'travel'],
//         regData: '2024-11-15',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:20,
//         commentImage:'https://images.unsplash.com/photo-1732948937655-095f68551734?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         nickName: 'happySoul',
//         profilePicture: null,
//         numberOfLike: 20,
//         numberOfComments: 10,
//         contents: 'Enjoying coffee at the best cafe in town ☕',
//         tags: ['coffee', 'relax', 'morning'],
//         regData: '2024-11-14',
//         isLike:true
//       },
//       {
//         typeOfPost:'reply',
//         rno:21,
//         commentImage:null,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },
//         ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/postInfo/nickN/post/1').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body:[
//       {
//         typeOfPost:'reply',
//         rno:1,
//         nickName: 'adventureAddict',
//         profilePicture: 'https://example.com/profile15.jpg',
//         numberOfLike: 45,
//         numberOfComments: 12,
//         contents: 'Ziplining through the forest canopy 🌲',
//         tags: ['adventure', 'zipline', 'forest'],
//         regData: '2024-11-01',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:2,
//         nickName: 'bakingQueen',
//         profilePicture: null,
//         numberOfLike: 60,
//         numberOfComments: 20,
//         contents: 'Freshly baked cookies for the family 🍪',
//         tags: ['baking', 'cookies', 'home'],
//         regData: '2024-10-31',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:3,
//         nickName: 'beachBum',
//         profilePicture: 'https://example.com/profile17.jpg',
//         numberOfLike: 85,
//         numberOfComments: 30,
//         contents: 'Beach vibes all day 🌊',
//         tags: ['beach', 'summer', 'relaxation'],
//         regData: '2024-10-30',
//         isLike:false
//       },
//     ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/postInfo/nickN/post/2').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body: [
//       {
//         typeOfPost:'reply',
//         rno:8,
//         nickName: 'bookWorm',
//         profilePicture: 'https://example.com/profile8.jpg',
//         numberOfLike: 25,
//         numberOfComments: 7,
//         contents: 'Just finished reading "The Great Gatsby" 📚',
//         tags: ['books', 'reading', 'literature'],
//         regData: '2024-11-08',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:9,
//         nickName: 'photoArt',
//         profilePicture: 'https://example.com/profile9.jpg',
//         numberOfLike: 90,
//         numberOfComments: 32,
//         contents: 'Captured this beautiful sunset today 🌅',
//         tags: ['photography', 'sunset', 'art'],
//         regData: '2024-11-07',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:10,
//         nickName: 'techieTim',
//         profilePicture: 'default_1',
//         numberOfLike: 15,
//         numberOfComments: 5,
//         contents: 'Excited about the new AI advancements 🤖',
//         tags: ['tech', 'AI', 'future'],
//         regData: '2024-11-06',
//         isLike:false
//       },
//     ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/postInfo/nickN/post/3').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body:[

//     ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/postInfo/nickN/replies/0').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//       body:[
//       {
//         typeOfPost:'reply',
//         rno:19,
//         nickName: 'reply',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments: 5,
//         contents: 'Exploring the mountains!',
//         tags: ['hiking', 'adventure', 'travel'],
//         regData: '2024-11-15',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:20,
//         nickName: 'happySoul',
//         profilePicture: 'default_1',
//         numberOfLike: 20,
//         numberOfComments: 10,
//         contents: 'Enjoying coffee at the best cafe in town ☕',
//         tags: ['coffee', 'relax', 'morning'],
//         regData: '2024-11-14',
//         isLike:true
//       },
//       {
//         typeOfPost:'reply',
//         rno:21,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },
//         ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/postInfo/nickN/replies/1').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body:[
//       {
//         typeOfPost:'reply',
//         rno:1,
//         nickName: 'adventureAddict',
//         profilePicture: 'https://example.com/profile15.jpg',
//         numberOfLike: 45,
//         numberOfComments: 12,
//         contents: 'Ziplining through the forest canopy 🌲',
//         tags: ['adventure', 'zipline', 'forest'],
//         regData: '2024-11-01',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:2,
//         nickName: 'bakingQueen',
//         profilePicture: 'default_1',
//         numberOfLike: 60,
//         numberOfComments: 20,
//         contents: 'Freshly baked cookies for the family 🍪',
//         tags: ['baking', 'cookies', 'home'],
//         regData: '2024-10-31',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:3,
//         nickName: 'beachBum',
//         profilePicture: 'https://example.com/profile17.jpg',
//         numberOfLike: 85,
//         numberOfComments: 30,
//         contents: 'Beach vibes all day 🌊',
//         tags: ['beach', 'summer', 'relaxation'],
//         regData: '2024-10-30',
//         isLike:false
//       },
//     ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/postInfo/nickN/replies/2').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body: [
//       {
//         typeOfPost:'reply',
//         rno:8,
//         nickName: 'bookWorm',
//         profilePicture: 'https://example.com/profile8.jpg',
//         numberOfLike: 25,
//         numberOfComments: 7,
//         contents: 'Just finished reading "The Great Gatsby" 📚',
//         tags: ['books', 'reading', 'literature'],
//         regData: '2024-11-08',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:9,
//         nickName: 'photoArt',
//         profilePicture: 'https://example.com/profile9.jpg',
//         numberOfLike: 90,
//         numberOfComments: 32,
//         contents: 'Captured this beautiful sunset today 🌅',
//         tags: ['photography', 'sunset', 'art'],
//         regData: '2024-11-07',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:10,
//         nickName: 'techieTim',
//         profilePicture: 'default_1',
//         numberOfLike: 15,
//         numberOfComments: 5,
//         contents: 'Excited about the new AI advancements 🤖',
//         tags: ['tech', 'AI', 'future'],
//         regData: '2024-11-06',
//         isLike:false
//       },
//     ]
//     },
//   ];
// })

// instanceMock.onGet('api/board/postInfo/nickN/replies/3').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body:[
      
//     ]
//     },
//   ];
// });



// instanceMock.onGet('api/board/postInfo/nickN/likes/0').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//       body:[
//       {
//         typeOfPost:'likes',
//         rno:19,
//         nickName: 'johnDoe',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments: 5,
//         contents: 'Exploring the mountains!',
//         tags: ['hiking', 'adventure', 'travel'],
//         regData: '2024-11-15',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:20,
//         nickName: 'happySoul',
//         profilePicture: 'default_1',
//         numberOfLike: 20,
//         numberOfComments: 10,
//         contents: 'Enjoying coffee at the best cafe in town ☕',
//         tags: ['coffee', 'relax', 'morning'],
//         regData: '2024-11-14',
//         isLike:true
//       },
//       {
//         typeOfPost:'reply',
//         rno:21,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },
//         ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/postInfo/nickN/likes/1').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body:[
//       {
//         typeOfPost:'like',
//         rno:1,
//         nickName: 'adventureAddict',
//         profilePicture: 'https://example.com/profile15.jpg',
//         numberOfLike: 45,
//         numberOfComments: 12,
//         contents: 'Ziplining through the forest canopy 🌲',
//         tags: ['adventure', 'zipline', 'forest'],
//         regData: '2024-11-01',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:2,
//         nickName: 'bakingQueen',
//         profilePicture: 'default_1',
//         numberOfLike: 60,
//         numberOfComments: 20,
//         contents: 'Freshly baked cookies for the family 🍪',
//         tags: ['baking', 'cookies', 'home'],
//         regData: '2024-10-31',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:3,
//         nickName: 'beachBum',
//         profilePicture: 'https://example.com/profile17.jpg',
//         numberOfLike: 85,
//         numberOfComments: 30,
//         contents: 'Beach vibes all day 🌊',
//         tags: ['beach', 'summer', 'relaxation'],
//         regData: '2024-10-30',
//         isLike:false
//       },
//     ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/postInfo/nickN/likes/2').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//       body: [
//       {
//         typeOfPost:'reply',
//         rno:8,
//         nickName: 'bookWorm',
//         profilePicture: 'https://example.com/profile8.jpg',
//         numberOfLike: 25,
//         numberOfComments: 7,
//         contents: 'Just finished reading "The Great Gatsby" 📚',
//         tags: ['books', 'reading', 'literature'],
//         regData: '2024-11-08',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:9,
//         nickName: 'photoArt',
//         profilePicture: 'https://example.com/profile9.jpg',
//         numberOfLike: 90,
//         numberOfComments: 32,
//         contents: 'Captured this beautiful sunset today 🌅',
//         tags: ['photography', 'sunset', 'art'],
//         regData: '2024-11-07',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:10,
//         nickName: 'techieTim',
//         profilePicture: 'default_1',
//         numberOfLike: 15,
//         numberOfComments: 5,
//         contents: 'Excited about the new AI advancements 🤖',
//         tags: ['tech', 'AI', 'future'],
//         regData: '2024-11-06',
//         isLike:false
//       },
//     ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/postInfo/nickN/likes/3').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body:[
      
//     ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/postInfo/otherUser/likes/0').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//       body:[
//       {
//         typeOfPost:'reply',
//         rno:19,
//         nickName: 'likes111',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments: 5,
//         contents: 'Exploring the mountains!',
//         tags: ['hiking', 'adventure', 'travel'],
//         regData: '2024-11-15',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:20,
//         nickName: 'happySoul',
//         profilePicture: 'default_1',
//         numberOfLike: 20,
//         numberOfComments: 10,
//         contents: 'Enjoying coffee at the best cafe in town ☕',
//         tags: ['coffee', 'relax', 'morning'],
//         regData: '2024-11-14',
//         isLike:true
//       },
//       {
//         typeOfPost:'reply',
//         rno:21,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },
//         ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/postInfo/otherUser/replies/0').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//       body:[
//       {
//         typeOfPost:'reply',
//         rno:19,
//         nickName: 'reply111',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments: 5,
//         contents: 'Exploring the mountains!',
//         tags: ['hiking', 'adventure', 'travel'],
//         regData: '2024-11-15',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:20,
//         nickName: 'happySoul',
//         profilePicture: 'default_1',
//         numberOfLike: 20,
//         numberOfComments: 10,
//         contents: 'Enjoying coffee at the best cafe in town ☕',
//         tags: ['coffee', 'relax', 'morning'],
//         regData: '2024-11-14',
//         isLike:true
//       },
//       {
//         typeOfPost:'reply',
//         rno:21,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },
//         ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/postInfo/otherUser/post/0').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//       body:[
//       {
//         typeOfPost:'reply',
//         rno:19,
//         nickName: 'post111',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments: 5,
//         contents: 'Exploring the mountains!',
//         tags: ['hiking', 'adventure', 'travel'],
//         regData: '2024-11-15',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:20,
//         nickName: 'happySoul',
//         profilePicture: 'default_1',
//         numberOfLike: 20,
//         numberOfComments: 10,
//         contents: 'Enjoying coffee at the best cafe in town ☕',
//         tags: ['coffee', 'relax', 'morning'],
//         regData: '2024-11-14',
//         isLike:true
//       },
//       {
//         typeOfPost:'reply',
//         rno:21,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },
//         ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/postInfo/anotherUser/post/0').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//       body:[
//       {
//         typeOfPost:'reply',
//         rno:19,
//         nickName: 'post111',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments: 5,
//         contents: 'Exploring the mountains!',
//         tags: ['hiking', 'adventure', 'travel'],
//         regData: '2024-11-15',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:20,
//         nickName: 'happySoul',
//         profilePicture: 'default_1',
//         numberOfLike: 20,
//         numberOfComments: 10,
//         contents: 'Enjoying coffee at the best cafe in town ☕',
//         tags: ['coffee', 'relax', 'morning'],
//         regData: '2024-11-14',
//         isLike:true
//       },
//       {
//         typeOfPost:'reply',
//         rno:21,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },
//         ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/postInfo/anotherUser/likes/0').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//       body:[
//       {
//         typeOfPost:'reply',
//         rno:19,
//         nickName: 'likes111',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments: 5,
//         contents: 'Exploring the mountains!',
//         tags: ['hiking', 'adventure', 'travel'],
//         regData: '2024-11-15',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:20,
//         nickName: 'happySoul',
//         profilePicture: 'default_1',
//         numberOfLike: 20,
//         numberOfComments: 10,
//         contents: 'Enjoying coffee at the best cafe in town ☕',
//         tags: ['coffee', 'relax', 'morning'],
//         regData: '2024-11-14',
//         isLike:true
//       },
//       {
//         typeOfPost:'reply',
//         rno:21,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },
//         ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/postInfo/anotherUser/replies/0').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//       body:[
//       {
//         typeOfPost:'reply',
//         rno:19,
//         nickName: 'reply111',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments: 5,
//         contents: 'Exploring the mountains!',
//         tags: ['hiking', 'adventure', 'travel'],
//         regData: '2024-11-15',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:20,
//         nickName: 'happySoul',
//         profilePicture: 'default_1',
//         numberOfLike: 20,
//         numberOfComments: 10,
//         contents: 'Enjoying coffee at the best cafe in town ☕',
//         tags: ['coffee', 'relax', 'morning'],
//         regData: '2024-11-14',
//         isLike:true
//       },
//       {
//         typeOfPost:'reply',
//         rno:21,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },
//         ]
//     },
//   ];
// });


// instanceMock.onPatch('api/update/userInformation').reply((config) => {
//   const data = config.data; // FormData
//   if (data instanceof FormData) {
//     for (let [key, value] of data.entries()) {
//       console.log(`${key}: ${value}`);
//     }
//   }
//   return [
//     200,
//     {
//       message: '사진 업로드 완료',
//       body: [],
//     },
//   ];
// });



// instanceMock.onPost('api/follow/following/anotherUser').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "팔로잉 완료",
//     body:[
      
//     ]
//     },
//   ];
// });


// instanceMock.onPost('api/follow/unfollowing/otherUser').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "언팔로잉 완료",
//     body:[
      
//     ]
//     },
//   ];
// });


// instanceMock.onPost('api/boardLike/like/',{ params: { bno: "19" } }).reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "좋아요 좋아요 취소 완료",
//     body:[
      
//     ]
//     },
//   ];
// });


// instanceMock.onPost('api/boardLike/unlike/',{ params: { bno: "19" } }).reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "좋아요 좋아요 취소 완료",
//     body:[
      
//     ]
//     },
//   ];
// });


// instanceMock.onPost('api/replyLike/like/',{ params: { rno: "19" } }).reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "좋아요 좋아요 취소 완료",
//     body:[
      
//     ]
//     },
//   ];
// });


// instanceMock.onPost('api/replyLike/unlike/',{ params: { rno: "19" } }).reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "좋아요 좋아요 취소 완료",
//     body:[
      
//     ]
//     },
//   ];
// });



// instanceMock.onGet('api/board/detail/',{ params: { bno: "19" } }).reply((config) => {
//   console.log('configdd',config.data);
//   return [
//     200,
//     {
//     message: "board information",
//     body:
//       {
//         typeOfPost:'board',
//         bno:19,
//         boardImages:['https://plus.unsplash.com/premium_photo-1732746888692-d8129397a4dd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D','https://images.unsplash.com/photo-1732948937655-095f68551734?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D'],
//         nickName: 'johnDoe',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments: 5,
//         contents: 'Exploring the mountains!',
//         tags: ['hiking', 'adventure', 'travel'],
//         regData: '2024-11-15',
//         isLike:false
//         ,isFollowing:true,
//         isLikeVisible:true,
//         isReplyAllowed:true
//       },
//     },
//   ];
// });


// instanceMock.onGet('api/reply/detail/',{ params: { rno: "19" } }).reply((config) => {
//   console.log('configdd',config.data);
//   return [
//     200,
//     {
//     message: "rno information",
//     body:
//     {
//       typeOfPost:'reply',
//       rno:19,
//       bno:19,
//       commentImage:'https://images.unsplash.com/photo-1732129527496-f2ba9d1de57e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2N3x8fGVufDB8fHx8fA%3D%3D',
//       nickName: 'johnDoe',
//       profilePicture: 'https://example.com/profile1.jpg',
//       numberOfLike: 12,
//       numberOfComments:11,
//       contents: 'Exploring the mountains!',
//       tags: ['hiking', 'adventure', 'travel'],
//       regData: '2024-11-15',
//       isLike:false
//     },
//     },
//   ];
// });


// instanceMock.onGet('api/reply/detail/0',{ params: { bno: "19" } }).reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "reply information",
//       body:[
//       {
//         typeOfPost:'reply',
//         rno:19,
//         bno:19,
//         commentImage:'https://images.unsplash.com/photo-1732129527496-f2ba9d1de57e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2N3x8fGVufDB8fHx8fA%3D%3D',
//         nickName: 'johnDoe',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments:11,
//         contents: 'Exploring the mountains!',
//         regData: '2024-11-15',
//         isLike:false
//         ,isFollowing:false,
//       },
//       {
//         typeOfPost:'reply',
//         rno:20,
//         bno:19,
//         commentImage:'https://images.unsplash.com/photo-1732948937655-095f68551734?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         nickName: 'nickN',
//         profilePicture: 'default_1',
//         numberOfLike: 20,
//         numberOfComments: 10,
//         contents: 'Enjoying coffee at the best cafe in town ☕',
//         regData: '2024-11-14',
//         isLike:true
//         ,isFollowing:false,
//       },
//       {
//         typeOfPost:'reply',
//         rno:21,
//         bno:19,
//         nickName: 'natureLover',
//         commentImage:'https://images.unsplash.com/photo-1733170683329-b9b26aaf1162?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4NXx8fGVufDB8fHx8fA%3D%3D',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         regData: '2024-11-13',
//         isLike:true
//         ,isFollowing:true,
//       },
//         ]
//     },
//   ];
// });

// instanceMock.onGet('api/reply/detail/1',{ params: { bno: "19" } }).reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "reply information",
//       body:[
//       {
//         typeOfPost:'reply',
//         rno:22,
//         bno:19,
//         commentImage:'https://plus.unsplash.com/premium_photo-1732746888692-d8129397a4dd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D',
//         nickName: 'johnDoe',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments: 5,
//         contents: 'Exploring the mountains!',
//         tags: ['hiking', 'adventure', 'travel'],
//         regData: '2024-11-15',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:23,
//         bno:19,
//         commentImage:'https://images.unsplash.com/photo-1732948937655-095f68551734?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         nickName: 'happySoul',
//         profilePicture: 'default_1',
//         numberOfLike: 20,
//         numberOfComments: 10,
//         contents: 'Enjoying coffee at the best cafe in town ☕',
//         tags: ['coffee', 'relax', 'morning'],
//         regData: '2024-11-14',
//         isLike:true
//       },
//       {
//         typeOfPost:'reply',
//         rno:24,
//         bno:19,
//         commentImage:null,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },
//         ]
//     },
//   ];
// });

// instanceMock.onGet('api/reply/detail/2',{ params: { bno: "19" } }).reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "reply information",
//       body:[
//       {
//         typeOfPost:'reply',
//         rno:1,
//         bno:19,
//         commentImage:'https://images.unsplash.com/photo-1733393735327-eb1a9d357af4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8',
//         nickName: 'johnDoe',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments: 5,
//         contents: 'Exploring the mountains!',
//         tags: ['hiking', 'adventure', 'travel'],
//         regData: '2024-11-15',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:2,
//         bno:19,
//         commentImage:'https://images.unsplash.com/photo-1732948937655-095f68551734?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         nickName: 'happySoul',
//         profilePicture: 'default_1',
//         numberOfLike: 20,
//         numberOfComments: 10,
//         contents: 'Enjoying coffee at the best cafe in town ☕',
//         tags: ['coffee', 'relax', 'morning'],
//         regData: '2024-11-14',
//         isLike:true
//       },
//       {
//         typeOfPost:'reply',
//         rno:3,
//         bno:19,
//         commentImage:'https://images.unsplash.com/photo-1733299704493-9aa9c608778a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8',
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },
//         ]
//     },
//   ];
// });

// instanceMock.onGet('api/reply/detail/3',{ params: { bno: "19" } }).reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "reply information",
//       body:[

//         ]
//     },
//   ];
// });


// instanceMock.onGet('api/reply/detail/nest/0',{ params: {  rno:'19'} }).reply((config) => {
//   console.log('config111',config.params);
//   return [
//     200,
//     {
//     message: "nestRe information",
//       body:[
//       {
//         typeOfPost:'nestRe',
//         rno:41,
//         bno:19,
//         parentRno:19,
//         commentImage:'https://images.unsplash.com/photo-1721332155484-5aa73a54c6d2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMXx8fGVufDB8fHx8fA%3D%3D',
//         nickName: 'nickN',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments: 5,
//         contents: 'Exploring the mountains!',
//         tags: ['hiking', 'adventure', 'travel'],
//         regData: '2024-11-15',
//         isLike:false
//       },
//       {
//         typeOfPost:'nestRe',
//         rno:42,
//         bno:19,
//         commentImage:'https://images.unsplash.com/photo-1732948937655-095f68551734?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         nickName: 'happySoul',
//         profilePicture: 'default_1',
//         numberOfLike: 20,
//         numberOfComments: 10,
//         contents: 'Enjoying coffee at the best cafe in town ☕',
//         tags: ['coffee', 'relax', 'morning'],
//         regData: '2024-11-14',
//         isLike:true
//       },
//       {
//         typeOfPost:'nestRe',
//         rno:43,
//         bno:19,
//         commentImage:null,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },

//       {
//         typeOfPost:'nestRe',
//         rno:44,
//         bno:19,
//         commentImage:null,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },

//       {
//         typeOfPost:'nestRe',
//         rno:45,
//         bno:19,
//         commentImage:null,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       }
//         ]
//     },
//   ];
// });

// instanceMock.onGet('api/reply/detail/nest/1',{ params: {  rno:'19'} }).reply((config) => {
//   console.log('config111',config.params);
//   return [
//     200,
//     {
//     message: "reply information",
//       body:[
//       {
//         typeOfPost:'nestRe',
//         rno:46,
//         bno:19,
//         commentImage:null,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },

//       {
//         typeOfPost:'nestRe',
//         rno:47,
//         bno:19,
//         commentImage:null,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },

//       {
//         typeOfPost:'nestRe',
//         rno:48,
//         bno:19,
//         commentImage:null,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿6',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },

//       {
//         typeOfPost:'nestRe',
//         rno:49,
//         bno:19,
//         commentImage:null,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿7',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },

//       {
//         typeOfPost:'nestRe',
//         rno:50,
//         bno:19,
//         commentImage:null,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy8 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },
//         ]
//     },
//   ];
// });

// instanceMock.onGet('api/reply/detail/nest/2',{ params: {  rno:'19'} }).reply((config) => {
//   console.log('config111',config.params);
//   return [
//     200,
//     {
//     message: "reply information",
//       body:[
//       {
//         typeOfPost:'nestRe',
//         rno:51,
//         bno:19,
//         commentImage:null,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy9 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },
//         ]
//     },
//   ];
// });

// instanceMock.onGet('api/reply/detail/nest/3',{ params: { rno:'19'} }).reply((config) => {
//   console.log('config111',config.params);
//   return [
//     200,
//     {
//     message: "reply information",
//       body:[
//         ]
//     },
//   ];
// });


// instanceMock.onGet('api/reply/detail/nest/0',{ params: { rno:'20'}}).reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "reply information",
//       body:[
//       {
//         typeOfPost:'nestRe',
//         rno:52,
//         bno:19,
//         parentRno:20,
//         commentImage:'https://plus.unsplash.com/premium_photo-1732746888692-d8129397a4dd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D',
//         nickName: 'johnDoe',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments: 5,
//         contents: 'Exploring the mountains!',
//         tags: ['hiking', 'adventure', 'travel'],
//         regData: '2024-11-15',
//         isLike:false
//       },
//       {
//         typeOfPost:'nestRe',
//         rno:53,
//         bno:19,
//         parentRno:20,
//         commentImage:'https://images.unsplash.com/photo-1732948937655-095f68551734?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         nickName: 'happySoul',
//         profilePicture: 'default_1',
//         numberOfLike: 20,
//         numberOfComments: 10,
//         contents: 'Enjoying coffee at the best cafe in town ☕',
//         tags: ['coffee', 'relax', 'morning'],
//         regData: '2024-11-14',
//         isLike:true
//       },
//       {
//         typeOfPost:'nestRe',
//         rno:54,
//         bno:19,
//         commentImage:null,
//         parentRno:20,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },
//         ]
//     },
//   ];
// });

// instanceMock.onGet('api/reply/detail/nest/0',{ params: { rno:'21'} }).reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "reply information",
//       body:[
//       {
//         typeOfPost:'reply',
//         rno:55,
//         bno:19,
//         parentRno:21,
//         commentImage:'https://images.unsplash.com/photo-1733393735327-eb1a9d357af4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8',
//         nickName: 'johnDoe',
//         profilePicture: 'https://example.com/profile1.jpg',
//         numberOfLike: 12,
//         numberOfComments: 5,
//         contents: 'Exploring the mountains!',
//         tags: ['hiking', 'adventure', 'travel'],
//         regData: '2024-11-15',
//         isLike:false
//       },
//       {
//         typeOfPost:'reply',
//         rno:20,
//         bno:19,
//         parentRno:21,
//         commentImage:'https://images.unsplash.com/photo-1732948937655-095f68551734?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         nickName: 'happySoul',
//         profilePicture: null,
//         numberOfLike: 20,
//         numberOfComments: 10,
//         contents: 'Enjoying coffee at the best cafe in town ☕',
//         tags: ['coffee', 'relax', 'morning'],
//         regData: '2024-11-14',
//         isLike:true
//       },
//       {
//         typeOfPost:'reply',
//         rno:21,
//         bno:19,
//         parentRno:21,
//         commentImage:null,
//         nickName: 'natureLover',
//         profilePicture: 'https://example.com/profile3.jpg',
//         numberOfLike: 50,
//         numberOfComments: 30,
//         contents: 'Nature is my therapy 🌿',
//         tags: ['nature', 'therapy', 'peace'],
//         regData: '2024-11-13',
//         isLike:true
//       },
//         ]
//     },
//   ];
// });


// instanceMock.onGet('api/follow/get/users/nickN/following/0').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "팔로잉 조회 완료",
//     body:[
//       {
//         email: "following@gmail.com",
//         nickName: 'anotherUser',
//         profilePicture: 'https://plus.unsplash.com/premium_photo-1732730224306-3b469ea9e640?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8',
//         isFollowing: false
//       },
//       {
//         email: "user2@gmail.com",
//         nickName: "nickName2",
//         profilePicture: "https://example.com/profile2.jpg",
//         isFollowing: false
//       },
//       {
//         email: "user3@gmail.com",
//         nickName: 'banana',
//         profilePicture: "https://example.com/profile3.jpg",
//         isFollowing: false
//       },
//       {
//         email: "user4@gmail.com",
//         nickName: "nickName4",
//         profilePicture: null,
//         isFollowing: false
//       },
//       {
//         email: "user5@gmail.com",
//         nickName: 'sxqweq',
//         profilePicture: "https://example.com/profile5.jpg",
//         isFollowing: false
//       },
//       {
//         email: "user6@gmail.com",
//         nickName: "nickName6",
//         profilePicture: "https://example.com/profile6.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user7@gmail.com",
//         nickName: 'aaaaa',
//         profilePicture: null,
//         isFollowing: true
//       },
//       {
//         email: "user8@gmail.com",
//         nickName: "xxz",
//         profilePicture: "https://example.com/profile8.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user9@gmail.com",
//         nickName: 'sefsfsc',
//         profilePicture: "https://example.com/profile9.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user10@gmail.com",
//         nickName: "nickName10",
//         profilePicture: null,
//         isFollowing: true
//       },
//       {
//         email: "user11@gmail.com",
//         nickName: 'nulls',
//         profilePicture: null,
//         isFollowing: true
//       },
//       {
//         email: "user12@gmail.com",
//         nickName: "sefes",
//         profilePicture: "https://example.com/profile12.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user13@gmail.com",
//         nickName: 'nicksss',
//         profilePicture: "https://example.com/profile13.jpg",
//         isFollowing: true
//       }
//     ]
// },
// ]
// });


// instanceMock.onGet('api/follow/get/users/nickN/following/1').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "팔로잉 조회 완료",
//     body:[
//       {
//         email: "user1@gmail.com",
//         nickName: 'nickname11',
//         profilePicture: 'https://images.unsplash.com/photo-1725610147161-5caa05b3b156?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8',
//         isFollowing: true
//       },
//       {
//         email: "user2@gmail.com",
//         nickName: "nickName22",
//         profilePicture: "https://example.com/profile2.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user3@gmail.com",
//         nickName: 'nickName33',
//         profilePicture: "https://example.com/profile3.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user4@gmail.com",
//         nickName: "nickName4",
//         profilePicture: null,
//         isFollowing: true
//       },
//       {
//         email: "user8@gmail.com",
//         nickName: "nickName8",
//         profilePicture: "https://example.com/profile8.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user9@gmail.com",
//         nickName: null,
//         profilePicture: "https://example.com/profile9.jpg",
//         isFollowing: true
//       },
//     ]
// },
// ]
// });

// instanceMock.onGet('api/follow/get/users/nickN/following/2').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "팔로잉 조회 완료",
//     body:[

//     ]
// },
// ]
// });


// instanceMock.onGet('api/follow/get/users/nickN/follower/0').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "팔로워 조회 완료",
//     body:[
//       {
//         email: "follower@gmail.com",
//         nickName: 'otherUser',
//         profilePicture: 'https://plus.unsplash.com/premium_photo-1669050943756-8a1a8149ea15?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D',
//         isFollowing: true
//       },
//       {
//         email: "ffuser2@gmail.com",
//         nickName: "nicffkName2",
//         profilePicture: "https://example.com/profile2.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user3@gmail.com",
//         nickName: 'banana',
//         profilePicture: "https://example.com/profile3.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user4@gmail.com",
//         nickName: "nickName4",
//         profilePicture: null,
//         isFollowing: true
//       },
//       {
//         email: "user5@gmail.com",
//         nickName: 'sxqweq',
//         profilePicture: "https://example.com/profile5.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user6@gmail.com",
//         nickName: "nickName6",
//         profilePicture: "https://example.com/profile6.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user7@gmail.com",
//         nickName: 'aaaaa',
//         profilePicture: null,
//         isFollowing: true
//       },
//       {
//         email: "user8@gmail.com",
//         nickName: "xxz",
//         profilePicture: "https://example.com/profile8.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user9@gmail.com",
//         nickName: 'sefsfsc',
//         profilePicture: "https://example.com/profile9.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user10@gmail.com",
//         nickName: "nickName10",
//         profilePicture: null,
//         isFollowing: true
//       },
//       {
//         email: "user11@gmail.com",
//         nickName: 'nulls',
//         profilePicture: null,
//         isFollowing: true
//       },
//       {
//         email: "user12@gmail.com",
//         nickName: "sefes",
//         profilePicture: "https://example.com/profile12.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user13@gmail.com",
//         nickName: 'nicksss',
//         profilePicture: "https://example.com/profile13.jpg",
//         isFollowing: true
//       }
//     ]
// },
// ]
// });


// instanceMock.onGet('api/follow/get/users/nickN/follower/1').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "팔로워 조회 완료",
//     body:[
//       {
//         email: "user1@gmail.com",
//         nickName: 'nickname11',
//         profilePicture: 'https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EB%AC%B4%EC%84%B1%ED%95%9C-%EB%85%B9%EC%83%89-%EC%96%B8%EB%8D%95-%EA%BC%AD%EB%8C%80%EA%B8%B0%EC%97%90-%EC%95%89%EC%95%84%EC%9E%88%EB%8A%94-%EA%B0%88%EC%83%89%EA%B3%BC-%ED%9D%B0%EC%83%89-%EC%96%91-ltO77p_AcYc',
//         isFollowing: true
//       },
//       {
//         email: "user2@gmail.com",
//         nickName: "nickName22",
//         profilePicture: "https://example.com/profile2.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user3@gmail.com",
//         nickName: 'nickName33',
//         profilePicture: "https://example.com/profile3.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user4@gmail.com",
//         nickName: "nickName4",
//         profilePicture: null,
//         isFollowing: true
//       },
//       {
//         email: "user8@gmail.com",
//         nickName: "nickName8",
//         profilePicture: "https://example.com/profile8.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user9@gmail.com",
//         nickName: null,
//         profilePicture: "https://example.com/profile9.jpg",
//         isFollowing: true
//       },
//     ]
// },
// ]
// });

// instanceMock.onGet('api/follow/get/users/nickN/follower/2').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "팔로워 조회 완료",
//     body:[

//     ]
// },
// ]
// });

// instanceMock.onGet('api/likeduser/fetched/0').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "팔로워 조회 완료",
//     body:[
//       {
//         email: "follower@gmail.com",
//         nickName: 'otherUser',
//         profilePicture: 'https://plus.unsplash.com/premium_photo-1669050943756-8a1a8149ea15?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D',
//         isFollowing: true
//       },
//       {
//         email: "ffuser2@gmail.com",
//         nickName: "nicffkName2",
//         profilePicture: "https://example.com/profile2.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user3@gmail.com",
//         nickName: 'banana',
//         profilePicture: "https://example.com/profile3.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user4@gmail.com",
//         nickName: "nickName4",
//         profilePicture: null,
//         isFollowing: true
//       },
//       {
//         email: "user5@gmail.com",
//         nickName: 'sxqweq',
//         profilePicture: "https://example.com/profile5.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user6@gmail.com",
//         nickName: "nickName6",
//         profilePicture: "https://example.com/profile6.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user7@gmail.com",
//         nickName: 'aaaaa',
//         profilePicture: null,
//         isFollowing: true
//       },
//       {
//         email: "user8@gmail.com",
//         nickName: "xxz",
//         profilePicture: "https://example.com/profile8.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user9@gmail.com",
//         nickName: 'sefsfsc',
//         profilePicture: "https://example.com/profile9.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user10@gmail.com",
//         nickName: "nickName10",
//         profilePicture: null,
//         isFollowing: true
//       },
//       {
//         email: "user11@gmail.com",
//         nickName: 'nulls',
//         profilePicture: null,
//         isFollowing: true
//       },
//       {
//         email: "user12@gmail.com",
//         nickName: "sefes",
//         profilePicture: "https://example.com/profile12.jpg",
//         isFollowing: true
//       },
//       {
//         email: "user13@gmail.com",
//         nickName: 'nicksss',
//         profilePicture: "https://example.com/profile13.jpg",
//         isFollowing: true
//       }
//     ]
// },
// ]
// });


// instanceMock.onPost('api/board/create').reply((config) => {
//   console.log('config111',config.params);
//   return [
//     401,
//     {
//     message: "create post 완료",
//       body:[

//         ]
//     },
//   ];
// });

// instanceMock.onDelete('api/reply/delete',{ params: {  rno:'20'} }).reply((config) => {
//   console.log('config111',config.params);
//   return [
//     200,
//     {
//     message: "reply or nestRe 삭제 완료",
//       body:[

//         ]
//     },
//   ];
// });

// instanceMock.onDelete('api/board/delete',{ params: {  bno:'20'} }).reply((config) => {
//   return [
//     200,
//     {
//       message: "board 삭제 완료",
//       body:[

//         ]
//     },
//   ];
// });


// instanceMock.onPatch('api/reply/update').reply((config) => {
//   const data = config.data; // FormData
//   if (data instanceof FormData) {
//     for (let [key, value] of data.entries()) {
//       console.log(`${key}: ${value}`);
//     }
//   }
//   return [
//     200,
//     {
//       message: '댓글 편집 완료',
//       body: [],
//     },
//   ];
// });

// instanceMock.onPatch('api/board/update').reply((config) => {
//   const data = config.data; // FormData
//   if (data instanceof FormData) {
//     for (let [key, value] of data.entries()) {
//       console.log(`${key}: ${value}`);
//     }
//   }
//   return [
//     200,
//     {
//       message: '보드 편집 완료',
//       body: [],
//     },
//   ];
// });





class AuthService {
  static async wakeUp(): Promise<any> {
    const response = await Axios.post('api/auth/wakeUp', {}, {
      headers: {
        'Content-Type':  'application/json',
      },
      timeout: 180000, // 90초 타임아웃 (1분 30초)
    });
    return response;
  }

  static async LoginNeo(account:any): Promise<any> {
    const response = await Axios.post('api/auth/guest/login',account, {

      headers: {
        'Content-Type':  'application/json',
      },
      timeout: 90000, // 90초 타임아웃 (1분 30초)
    });
    return response;
  }


  static async login(userData: LoginType): Promise<any> {
    const response = await Axios.post('api/auth/login', userData, {
      headers: {
        'Content-Type':  'application/json',
      },
    });
    return response;
  }

  static async signUp(userData: LoginType): Promise<any> {
    const response = await Axios.post('api/auth/signup', userData, {
      headers: {
        'Content-Type':  'application/json',
      },
    });
    return response.data;
  }

  static async smsRequest(userData: SMS): Promise<any> {
    const response = await Axios.post('api/auth/send/phone', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  static async forgetPassword(userData: any): Promise<any> {
    const response = await Axios.post(`api/auth/recreatePassword/${userData}`, null, {
      headers: {
        'Content-Type':  'application/json',
      },
    });
    return response.data;
  }

  static async smsVerificate(userData: SMSValidate): Promise<any> {
    const response = await Axios.post('api/auth/send/verification', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  static async updatePassword(userData: { newPassword: string; oldPassword: string }): Promise<any> {
    const response = await instance.post('api/update/password', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  static async socialLogin(userData: socialLogin): Promise<any> {
    const response = await instance.post('api/auth/socialLogin', userData, {
      headers: {
        'Content-Type':  'application/json',
      },
    });
    return response.data;
  }
}

class UserService {
  static async getUserProfile(): Promise<any> {
    const response = await instance.get(`api/get/user/information`, {
      headers: {
        'Content-Type':'application/json',
      },
    });
    return response.data;
  }

  static async createNicknameProfileImg(userData: FormData): Promise<any> {
    const response = await instance.post('api/update/profileNickname', userData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      },
    });
    return response.data;
  }

  static async userEditProfile(userData: FormData): Promise<any> {
    console.log('userEditProfile')
    
    const response = await instance.patch('api/update/userInformation', userData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      },
    });
    return response.data;
  }
  



}

class SocialService {
  static async fetchPosts(pageIndex: pageIndex): Promise<any> {
    console.log('fetchPosts');
    const response = await instance.get(`api/board/randomBoard/${pageIndex}`, {
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }

  static async fetchUserPosts(value:userPosts): Promise<any> {
    const response = await instance.get(`api/board/postInfo/${value.username}/${value.typeOfFilter.toLowerCase()}/${value.pages}`, {
      headers: {
        'Content-Type':'application/json',
      },
    });
    return response;
  }


  static async fetchedUserInfo(username: string): Promise<any> {
    console.log('fetchedUserInfo');
    const response = await instance.get(`api/get/userInformation/${username}`, {
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }



  static async createBoard(postData: FormData): Promise<any> {
    console.log('createBoard')
    if (postData instanceof FormData) {
      for (let [key, value] of postData.entries()) {
      }
    }
    const response = await instance.post(`api/board/create`,postData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      },
    });
    return response.data;
  }

  static async createReplyOrNestRe(postData: FormData): Promise<any> {
    console.log('createReplyOrNestRe')
    if (postData instanceof FormData) {
      for (let [key, value] of postData.entries()) {
        console.log(`${key}: ${value}`);
      }
    }
    const response = await instance.post(`api/reply/create`,postData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      },
    });
    return response.data;
  }

  static async folowUserAccount(userName: string): Promise<any> {
    console.log('folowUserAccount');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await instance.post(`api/follow/following/${userName}`,{}, {
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response.data;
  }

  static async unFolowUserAccount(userName: string): Promise<any> {
    console.log('unFolowUserAccount');
    await new Promise((resolve) => setTimeout( resolve, 2000));

    const response = await instance.post(`api/follow/unFollowing/${userName}`,{}, {
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response.data;
  }

  static async boardlikeContents(idValue: number): Promise<any> {
    console.log('boardlikeContents');
    const response = await instance.post(
      `api/boardLike/like/`,
      {},
      {
        params: { bno: String(idValue) },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  }


  static async fetchFollowPost(pageIndex:number): Promise<any> {
    console.log(pageIndex, 'fetchFollowPost');
    const response = await instance.get(
      `api/board/get/postInfo/follow/${pageIndex}/`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  }

  static async boardunlikeContents(idValue: number): Promise<any> {
    console.log('boardunlikeContents');
    const response = await instance.post(`api/boardLike/unlike/`,
      {},
      {
      params: { bno: String(idValue) },
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }

  static async replylikeContents(idValue: number): Promise<any> {
    console.log('replylikeContents');
    const response = await instance.post(`api/replyLike/like/`,
      {},
      {
      params: { rno: String(idValue) },
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }

  static async replyunlikeContents(idValue: number): Promise<any> {
    console.log('replyunlikeContents');
    const response = await instance.post(`api/replyLike/unlike/`,
      {},
      {
      params: { rno: String(idValue) },
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }

  


  static async fetchedBoard(bno:string ): Promise<any> {
    console.log('fetchedBoard');
    const response = await instance.get(`api/board/detail/`, {
      params: { bno: bno },
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }

  static async fetchedReplyDetail(rno:number ): Promise<any> {
    console.log('fetchedReplyDetail');
    const response = await instance.get(`api/reply/one/`, {
      params: { rno: String(rno) },
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }

  static async fetchedReply(bno: number, pageIndex: number): Promise<any> {
    console.log('fetchedReply');
    
    const response = await instance.get(`api/reply/detail/${pageIndex}`, {
      params: { bno: String(bno) }, 
      headers: {
        'Content-Type': 'application/json', 
      },
    });
  
    return response;
  }

  static async fetchedNestRe(rno:number,pageIndex: pageIndex ): Promise<any> {
    console.log('fetchedNestRe');
    const response = await instance.get(`api/reply/detail/nest/${pageIndex}`, {
      params: { 
        rno:String(rno)
      },
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }


  static async fetchedFollowingFollower(value:fetchFollowType,page:number): Promise<any> {
    console.log('fetchedFollowingFollower');
    const response = await instance.get(`api/follow/get/users/${value.username}/${value.typeOfFilter.toLowerCase()}/${page}`, {
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }


  static async searchUserAccount(search:string,page:number): Promise<any> {
    const response = await instance.get(`api/search/get/users/${page}/`, {
      params: { 
        search:search
      },
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }

  static async searchHashTag(search:string,page:number): Promise<any> {
    const response = await instance.get(`api/tag/get/${page}/`, {
      params: { 
        search:search
      },
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }

  static async deleteBoardRequest(bno:string): Promise<any> {
    console.log('deleteBoardRequest');
    const response = await instance.delete(`api/board/delete`, {
      params: { 
        bno:String(bno)
      },
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }

  static async deleteCommentRequest(rno:string): Promise<any> {
    console.log('deleteCommentRequest');
    const response = await instance.delete(`api/reply/delete`, {
      params: { 
        rno:String(rno)
      },
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }


  static async modificateBoard(boardData:FormData): Promise<any> {
    console.log('modificateBoard');
    const response = await instance.patch(`api/board/update`,boardData, {
    });
    return response;
  }

  static async modificateComment(commentData:FormData): Promise<any> {
    console.log('modificateComment');
    const response = await instance.patch(`api/reply/update`,commentData, {
    });
    return response;
  }

  static async likedUserFetch(value:fetchLikedUser,pages:number): Promise<any> {
    console.log('likedUserFetch');
    const response = await instance.get(`api/boardLike/get/users/${pages}`, {
      params: { 
        bno:value.bno,
      },
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }

  static async fetchPostWithTags(value:string,pages:number): Promise<any> {
    console.log('fetchPostWithTags',value);
    const response = await instance.get(`api/board/get/tag/${pages}/`, {
      params: { 
        search:value
      },   
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }


  static async isReadNno(nno:number ): Promise<any> {
    console.log('isReadNno');
    const response = await instance.patch(`api/notification/activity/patch/unRead/`,null, {
      params: {
        nno:nno
      },   
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }

  static async isReadInitial(): Promise<any> {
    console.log('isReadInitial');
    const response = await instance.get(`api/notification/activity/get/unRead`, { 
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response.data;
  }

  static async fetchActivity(pages:number): Promise<any> {
    console.log('fetchActivity');
    const response = await instance.get(`/api/notification/activity/get/all/${pages}`, {
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }
  

  static async fetchReplyPageNumber(bno:number,rno:number): Promise<any> {
    console.log('fetchReplyPageNumber');
    const response = await instance.get(`/api/reply/get/pageNumber/`, {
      params: { 
        bno:bno,
        rno:rno
      },   
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }

  static async fetchNestRePageNumber(parentId:number,targetId:number): Promise<any> {
    console.log('fetchNestRePageNumber');
    const response = await instance.get(`/api/reply/get/pageNumber/nest/`, {
      params: { 
        parentId:parentId,
        targetId:targetId
      },   
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }


    static async bookmarkUserFetch(pages:number): Promise<any> {
    console.log('bookmarkUserFetch');
    const response = await instance.get(`api/bookmark/get/users/${pages}`, {
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }


    static async bookmarkAdd(bno:string): Promise<any> {
    console.log('bookmarkAdd');
    const response = await instance.post(`/api/bookmark/insert`, null,{
      params: { 
        bno:bno,
      },
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }


    static async bookmarkDelete(bno:string): Promise<any> {
    console.log('bookmarkDelete');
    const response = await instance.post(`/api/bookmark/delete`,null, {
      params: { 
        bno:bno,
      },
      headers: {
        'Content-Type': 'application/json' 
      },
    });
    return response;
  }

}

  return { AuthService, UserService, SocialService };
}
