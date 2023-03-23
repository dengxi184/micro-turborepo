import microApp from '@micro-zoe/micro-app';
import { setStorage, getStorage, removeStorage } from '../storage';
import { publishRequest } from '../api/publish';
import { getListRequest } from '../api/getArticleList';
import { getDetailsRequest } from '../api/getArticleDetails';
import { delArticleRequest } from '../api/deleteArticle';
import { uploadImgRequest } from '../api/uploadImg';
import _ from 'lodash';

Object.assign(window, {
  getStorage,
  setStorage,
  removeStorage,
  publishRequest,
  getListRequest,
  getDetailsRequest,
  delArticleRequest,
  uploadImgRequest,
  _,
});
microApp.setGlobalData({
  getStorage,
  setStorage,
  removeStorage,
  publishRequest,
  getListRequest,
  getDetailsRequest,
  delArticleRequest,
  uploadImgRequest,
  _,
});
