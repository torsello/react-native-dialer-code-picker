import { useEffect, useRef, useState, useCallback } from 'react';
import {
  EmitterSubscription,
  Keyboard,
  Platform,
  KeyboardEvent,
} from 'react-native';

/**
 * Custom hook to track keyboard visibility and height.
 * Returns:
 * - isOpen: Whether the keyboard is visible or not.
 * - keyboardHeight: The height of the keyboard.
 * - keyboardPlatform: The current platform (iOS or Android).
 */
export const useKeyboardStatus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const keyboardShowListener = useRef<EmitterSubscription | null>(null);
  const keyboardHideListener = useRef<EmitterSubscription | null>(null);

  const handleKeyboardShow = useCallback((event: KeyboardEvent) => {
    setKeyboardHeight(event.endCoordinates.height);
    setIsOpen(true);
  }, []);

  const handleKeyboardHide = useCallback(() => {
    setKeyboardHeight(0);
    setIsOpen(false);
  }, []);

  useEffect(() => {
    keyboardShowListener.current = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardShow
    );
    keyboardHideListener.current = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardHide
    );

    return () => {
      keyboardShowListener.current?.remove();
      keyboardHideListener.current?.remove();
    };
  }, [handleKeyboardShow, handleKeyboardHide]);

  return {
    isOpen,
    keyboardHeight,
    keyboardPlatform: Platform.OS,
  };
};
