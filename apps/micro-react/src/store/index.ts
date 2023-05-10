import defaultSettings from '../settings.json';
import { IUploadFileData } from '../pages/storage/importantFile';
export interface GlobalState {
  settings?: typeof defaultSettings;
  userInfo?: {
    name?: string;
    avatar?: string;
    job?: string;
    organization?: string;
    location?: string;
    email?: string;
    permissions: Record<string, string[]>;
  };
  userLoading?: boolean;
  fileUploadList?: Map<string, IUploadFileData>;
}

const initialState: GlobalState = {
  settings: defaultSettings,
  userInfo: {
    permissions: {},
  },
  fileUploadList: new Map(),
};

export default function store(state = initialState, action: any) {
  switch (action.type) {
    case 'update-settings': {
      const { settings } = action.payload;
      return {
        ...state,
        settings,
      };
    }
    case 'update-userInfo': {
      const { userInfo = initialState.userInfo, userLoading } = action.payload;
      return {
        ...state,
        userLoading,
        userInfo,
      };
    }
    case 'upload-fileUploadList': {
      const { fileUploadList } = action.payload;
      return {
        ...state,
        fileUploadList,
      };
    }
    default:
      return state;
  }
}
