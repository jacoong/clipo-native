import { useCallback, useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/redux/hooks';
import {
  closeModal as closeModalAction,
  ModalPropsMap,
  ModalState,
  ModalType,
  openModal as openModalAction,
  OpenModalPayload,
} from '../../store/redux/modalSlice';

type ModalPropsFor<T extends ModalType> = ModalPropsMap[T];

type UseModalReturn = ModalState & {
  openModal: <T extends ModalType>(
    type: T,
    props?: ModalPropsFor<T>,
  ) => void;
  closeModal: () => void;
};

const DEFAULT_TOAST_DURATION = 2000;

export const useModal = (): UseModalReturn => {
  const dispatch = useAppDispatch();
  const modalState = useAppSelector((state) => state.modal);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearToastTimeout = useCallback(() => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
  }, []);

  const closeModal = useCallback(() => {
    clearToastTimeout();
    dispatch(closeModalAction());
  }, [clearToastTimeout, dispatch]);

  const openModal = useCallback(
    <T extends ModalType>(type: T, props?: ModalPropsFor<T>) => {
      clearToastTimeout();
      dispatch(openModalAction({ type, props } as OpenModalPayload<T>));

      if (type === 'toast') {
        const duration =
          (props as ModalPropsFor<'toast'> | undefined)?.duration ??
          DEFAULT_TOAST_DURATION;
        toastTimeoutRef.current = setTimeout(() => {
          dispatch(closeModalAction());
        }, duration);
      }
    },
    [clearToastTimeout, dispatch],
  );

  useEffect(() => clearToastTimeout, [clearToastTimeout]);

  return {
    ...modalState,
    openModal,
    closeModal,
  };
};

export default useModal;
