import {useContext} from 'react';
import {ApiContext, StateContext, ForceUpdateContext} from './context.js';
export const useApi = function useApi() {
  return useContext(ApiContext);
};
export const useRootState = function useRootState() {
  return useContext(StateContext);
};
export const useForceUpdate = function useForceUpdate() {
  return useContext(ForceUpdateContext);
};
