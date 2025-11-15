import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import FlashMessageOverlay, {
  FlashMessagePayload,
} from './FlashMessageOverlay';

type FlashMessageContextValue = {
  showMessage: (payload: FlashMessagePayload & { duration?: number }) => void;
  hideMessage: () => void;
};

const FlashMessageContext = createContext<FlashMessageContextValue | undefined>(undefined);

const AUTO_DISMISS_DEFAULT = 3200;

export const FlashMessageProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [message, setMessage] = useState<FlashMessagePayload | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const hideMessage = useCallback(() => {
    clearTimeoutRef();
    setMessage(null);
  }, [clearTimeoutRef]);

  const showMessage = useCallback<
    FlashMessageContextValue['showMessage']
  >(
    ({ duration = AUTO_DISMISS_DEFAULT, ...payload }) => {
      clearTimeoutRef();
      setMessage(payload);
      timeoutRef.current = setTimeout(() => {
        setMessage(null);
      }, duration);
    },
    [clearTimeoutRef],
  );

  return (
    <FlashMessageContext.Provider value={{ showMessage, hideMessage }}>
      {children}
      <FlashMessageOverlay message={message} onClose={hideMessage} />
    </FlashMessageContext.Provider>
  );
};

export const useFlashMessageContext = () => {
  const ctx = useContext(FlashMessageContext);
  if (!ctx) {
    throw new Error('useFlashMessage must be used within FlashMessageProvider');
  }
  return ctx;
};
