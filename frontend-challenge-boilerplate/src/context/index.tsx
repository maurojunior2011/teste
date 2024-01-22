import { createContext, useContext, useReducer } from "react";

import { FileActionType } from "@/constants";
import {
  FileAction,
  FileContextState,
  FileDispatch,
  FileProviderProps,
} from "@/types";

export const FileContextInitialValues: Partial<FileContextState> = {
  file: {} as File,
  isLoading: false,
};

const FileContext = createContext<{
  state: FileContextState;
  dispatch: FileDispatch;
}>({
  state: FileContextInitialValues as FileContextState,
  dispatch: () => {},
});

const FileReducer = (
  state: FileContextState,
  action: FileAction,
): FileContextState => {
  switch (action.type) {
    case FileActionType.SET_UPLOAD_FILE: {
      // Create the action return
      state.file = action.payload === undefined ? null : action.payload.file;
      return state;
    }
    case FileActionType.SET_FILE_LIST: {
      // Create the action return
      if(state.file != null) {
        if(state.fileList !== undefined) {
          if(!state.fileList.includes(state.file)) {
            state.fileList.push(state.file);
          }
        } else {
          state.fileList = [];
          state.fileList.push(state.file);
        }
      }
      return state;
    }
    case FileActionType.SET_IS_LOADING: {
      // Create the action return
      break;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const FileProvider = ({ children }: FileProviderProps) => {
  const [state, dispatch] = useReducer(
    FileReducer,
    FileContextInitialValues as FileContextState,
  );

  return (
    <FileContext.Provider value={{ state, dispatch }}>
      {children}
    </FileContext.Provider>
  );
};

const useFileContext = () => {
  const context = useContext(FileContext);

  if (context === undefined)
    throw new Error("useFileContext must be used within a FileProvider");

  return context;
};

export { FileProvider, useFileContext };
