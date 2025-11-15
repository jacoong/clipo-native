import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';

export type ModalType = 'none' | 'fullScreen' | 'menu' | 'confirm' | 'toast' | 'customRect';

export type ModalPropsMap = {
  none: undefined;
  fullScreen: {
    renderContent?: () => ReactNode;
    title?: string;
    onDismiss?: () => void;
    leftActionLabel?: string;
    rightActionLabel?: string;
    onPressLeftAction?: () => void;
    onPressRightAction?: () => void;
  };
  menu: {
    items: Array<{
      label: string;
      onPress: () => void;
      iconName?: string;
    }>;
    title?: string;
  };
  confirm: {
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  };
  toast: {
    message: string;
    duration?: number;
    iconName?: string;
  };
  customRect: {
    title?: string;
    description?: string;
    primaryAction?: {
      label: string;
      onPress: () => void;
    };
    secondaryAction?: {
      label: string;
      onPress: () => void;
    };
  };
};

export interface ModalState {
  type: ModalType;
  isVisible: boolean;
  props?: ModalPropsMap[keyof ModalPropsMap];
}

const initialState: ModalState = {
  type: 'none',
  isVisible: false,
  props: undefined,
};

export type OpenModalPayload<T extends ModalType = ModalType> = {
  type: T;
  props?: ModalPropsMap[T];
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<OpenModalPayload>) => {
      state.type = action.payload.type;
      state.isVisible = true;
      state.props = action.payload.props;
    },
    closeModal: (state) => {
      state.type = 'none';
      state.isVisible = false;
      state.props = undefined;
    },
    resetModal: () => initialState,
  },
});

export const { openModal, closeModal, resetModal } = modalSlice.actions;

export default modalSlice.reducer;
