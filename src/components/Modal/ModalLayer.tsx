import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import {
  PanGestureHandler,
  State as GestureState,
  PanGestureHandlerStateChangeEvent,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import { useAppTheme } from '../../theme/ThemeProvider';
import { ModalPropsMap } from '../../../store/redux/modalSlice';
import useModal from '../../hooks/useModal';
import ConfirmModal from './ConfirmModal';

const AnimatedContainer = Animated.createAnimatedComponent(View);
const FULLSCREEN_HEADER_HEIGHT = 64;

type FullScreenPostModalProps = ModalPropsMap['fullScreen'] & {
  visible: boolean;
  onClose: () => void;
};

type MenuModalProps = ModalPropsMap['menu'] & {
  visible: boolean;
  onClose: () => void;
};

type ToastModalProps = ModalPropsMap['toast'] & {
  visible: boolean;
  onClose: () => void;
};

type CustomRectModalProps = ModalPropsMap['customRect'] & {
  visible: boolean;
  onClose: () => void;
};

const FullScreenPostModal: React.FC<FullScreenPostModalProps> = ({
  visible,
  onClose,
  renderContent,
  title,
  onDismiss,
  leftActionLabel,
  rightActionLabel,
  onPressLeftAction,
  onPressRightAction,
}) => {
  const { colors, palette } = useAppTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  const windowHeight = useMemo(() => Dimensions.get('window').height, []);
  const topSpacing = useMemo(() => windowHeight * 0.1, [windowHeight]);
  const sheetHeight = useMemo(() => windowHeight - topSpacing, [windowHeight, topSpacing]);
  const styles = useMemo(() => createStyles(colors, palette), [colors, palette]);

  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
    }
  }, [translateY, visible]);

  const handleClose = () => {
    onDismiss?.();
    onClose();
  };

  const animateBack = useCallback(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 6,
    }).start();
  }, [translateY]);

  const animateDismiss = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleGestureEvent = useMemo(
    () =>
      Animated.event<PanGestureHandlerGestureEvent['nativeEvent']>(
        [{ nativeEvent: { translationY: translateY } }],
        { useNativeDriver: true },
      ),
    [translateY],
  );

  const handleGestureStateChange = useCallback(
    (event: PanGestureHandlerStateChangeEvent) => {
      const { nativeEvent } = event;
      if (
        nativeEvent.state === GestureState.END ||
        nativeEvent.state === GestureState.CANCELLED ||
        nativeEvent.state === GestureState.FAILED
      ) {
        const { translationY, velocityY } = nativeEvent;
        const shouldDismiss = translationY > 120 || velocityY > 800;
        if (shouldDismiss) {
          animateDismiss();
        } else {
          animateBack();
        }
      }
    },
    [animateBack, animateDismiss],
  );

  const handleLeftPress = () => {
    if (onPressLeftAction) {
      onPressLeftAction();
    } else {
      handleClose();
    }
  };

  const handleRightPress = () => {
    if (onPressRightAction) {
      onPressRightAction();
    } else {
      handleClose();
    }
  };

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={handleClose} >
      <View style={styles.modalBackdrop}>
        <PanGestureHandler
          onGestureEvent={handleGestureEvent}
          onHandlerStateChange={handleGestureStateChange}
        >
          <AnimatedContainer
            style={[
              styles.fullScreenContainer,
              {
                transform: [{ translateY }],
              },
            ]}
          >
            <View style={styles.sheetHandleWrapper}>
              <View style={styles.sheetHandle} /> 
            </View>
            <View style={styles.fullScreenHeader}>
              <View style={styles.headerSide}>
                {leftActionLabel ? (
                  <TouchableOpacity
                    onPress={handleLeftPress}
                    accessibilityRole="button"
                    hitSlop={8}
                  >
                    <Text style={[styles.fullScreenAction, styles.headerLeftText]}>
                      {leftActionLabel}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleClose}
                    accessibilityRole="button"
                    hitSlop={8}
                  >
                    <Ionicons name="close" size={24} color={colors.textPrimary} />
                  </TouchableOpacity>
                )}
              </View>
              {title ? (
                <Text style={styles.fullScreenTitle} numberOfLines={1}>
                  {title}
                </Text>
              ) : (
                <View style={styles.fullScreenTitlePlaceholder} />
              )}
              <View style={[styles.headerSide, { alignItems: 'flex-end' }]}>
                {rightActionLabel ? (
                  <TouchableOpacity
                    onPress={handleRightPress}
                    accessibilityRole="button"
                    hitSlop={8}
                  >
                    <Text style={[styles.fullScreenAction, styles.headerRightText]}>
                      {rightActionLabel}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.headerSpacer} />
                )}
              </View>
            </View>
      
              <View style={styles.fullScreenContent}>{renderContent ? renderContent() : null}</View>
          
          </AnimatedContainer>
        </PanGestureHandler>
      </View>
    </Modal>
  );
};

const MenuModal: React.FC<MenuModalProps> = ({ visible, onClose, items, title }) => {
  const { colors, palette } = useAppTheme();
  const translateY = useRef(new Animated.Value(40)).current;
  const styles = useMemo(() => createStyles(colors, palette), [colors, palette]);

  useEffect(() => {
    if (visible) {
      translateY.setValue(40);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [translateY, visible]);

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.overlay, styles.menuOverlay]}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.menuContainer, { transform: [{ translateY }] }]}>
              {title ? <Text style={styles.menuTitle}>{title}</Text> : null}
              <FlatList
                data={items}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      item.onPress();
                    }}
                  >
                    {item.iconName ? (
                      <Ionicons
                        name={item.iconName as keyof typeof Ionicons.glyphMap}
                        size={18}
                        color={colors.textSecondary}
                        style={{ marginRight: 12 }}
                      />
                    ) : null}
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.menuSeparator} />}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>

      </TouchableWithoutFeedback>
    </Modal>
  );
};

const ToastModal: React.FC<ToastModalProps> = ({ visible, message, iconName, onClose }) => {
  const { colors, palette } = useAppTheme();
  const styles = useMemo(() => createStyles(colors, palette), [colors, palette]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.toastWrapper} pointerEvents="box-none">
          <View style={styles.toastContent}>
            {iconName ? (
              <Ionicons
                name={iconName as keyof typeof Ionicons.glyphMap}
                size={18}
                color={colors.textSecondary}
                style={{ marginRight: 8 }}
              />
            ) : null}
            <Text style={styles.toastMessage}>{message}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const CustomRectModal: React.FC<CustomRectModalProps> = ({
  visible,
  onClose,
  title,
  description,
  primaryAction,
  secondaryAction,
}) => {
  const { colors, palette } = useAppTheme();
  const styles = useMemo(() => createStyles(colors, palette), [colors, palette]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.customRectBox}>
          {title ? <Text style={styles.customRectTitle}>{title}</Text> : null}
          {description ? <Text style={styles.customRectDescription}>{description}</Text> : null}
          <View style={styles.customRectActions}>
            {secondaryAction ? (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  secondaryAction.onPress();
                  onClose();
                }}
              >
                <Text style={styles.secondaryLabel}>{secondaryAction.label}</Text>
              </TouchableOpacity>
            ) : null}
            {primaryAction ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  primaryAction.onPress();
                  onClose();
                }}
              >
                <Text style={styles.primaryLabel}>{primaryAction.label}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const isConfirmProps = (
  props: ModalPropsMap[keyof ModalPropsMap] | undefined,
): props is ModalPropsMap['confirm'] =>
  typeof props === 'object' && props !== null && 'message' in props;

const isFullScreenProps = (
  props: ModalPropsMap[keyof ModalPropsMap] | undefined,
): props is ModalPropsMap['fullScreen'] => typeof props === 'object';

const isMenuProps = (
  props: ModalPropsMap[keyof ModalPropsMap] | undefined,
): props is ModalPropsMap['menu'] =>
  typeof props === 'object' && props !== null && Array.isArray((props as any).items);

const isToastProps = (
  props: ModalPropsMap[keyof ModalPropsMap] | undefined,
): props is ModalPropsMap['toast'] =>
  typeof props === 'object' && props !== null && 'message' in props;

const isCustomRectProps = (
  props: ModalPropsMap[keyof ModalPropsMap] | undefined,
): props is ModalPropsMap['customRect'] =>
  typeof props === 'object' && props !== null;

const ModalLayer: React.FC = () => {
  const { type, isVisible, props, closeModal } = useModal();

  if (!isVisible) {
    return null;
  }

  switch (type) {
    case 'fullScreen':
      return (
        <FullScreenPostModal
          visible={isVisible}
          onClose={closeModal}
          {...(isFullScreenProps(props) ? props : {})}
        />
      );
    case 'menu':
      return (
        <MenuModal
          visible={isVisible}
          onClose={closeModal}
          {...(isMenuProps(props) ? props : { items: [] })}
        />
      );
    case 'confirm':
      return (
        <ConfirmModal
          visible={isVisible}
          onClose={closeModal}
          {...(isConfirmProps(props) ? props : { message: '' })}
        />
      );
    case 'toast':
      return (
        <ToastModal
          visible={isVisible}
          onClose={closeModal}
          {...(isToastProps(props) ? props : { message: '' })}
        />
      );
    case 'customRect':
      return (
        <CustomRectModal
          visible={isVisible}
          onClose={closeModal}
          {...(isCustomRectProps(props) ? props : {})}
        />
      );
    default:
      return null;
  }
};

const createStyles = (
  colors: ReturnType<typeof useAppTheme>['colors'],
  palette: ReturnType<typeof useAppTheme>['palette'],
) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    modalBackdrop: {
      flex: 1,
       backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'flex-end',
    },
    fullScreenContainer: {
      height: '90%',
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      backgroundColor: colors.background,
    },
    sheetHandleWrapper: {
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom:5,
    },
    sheetHandle: {
      width: 42,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
    },

    fullScreenHeader: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      backgroundColor: colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    headerSide: {
      minWidth: 60,
      alignItems: 'flex-start',
    },
    headerSpacer: {
      width: 24,
      height: 24,
    },
    fullScreenTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      color: colors.textPrimary,
    },
    fullScreenTitlePlaceholder: {
      flex: 1,
    },
    fullScreenAction: {
      fontSize: 15,
      fontWeight: '600',
    },
    headerLeftText: {
      color: colors.textPrimary,
    },
    headerRightText: {
      color: palette.themeColor,
    },
    fullScreenContent: {
      flex: 1,
    },
    fullScreenContentWrapper: {
      flex: 1,
    },
    menuContainer: {
      width: '100%',
      paddingTop: 16,
      paddingBottom: 36,
      paddingHorizontal: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderTopWidth: StyleSheet.hairlineWidth,
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
    },
    menuOverlay: {
      justifyContent: 'flex-end',
      alignItems: 'stretch',
      padding: 0,
    },
    menuTitle: {
      fontSize: 14,
      marginBottom: 12,
      color: colors.textSecondary,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20,
    },
    menuLabel: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    menuSeparator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
    toastWrapper: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 80,
    },
    toastContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 999,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 6,
      backgroundColor: colors.surface,
    },
    toastMessage: {
      fontSize: 14,
      color: colors.textPrimary,
    },
    customRectBox: {
      width: '100%',
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 24,
      gap: 16,
      backgroundColor: colors.surface,
    },
    customRectTitle: {
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center',
      color: colors.textPrimary,
    },
    customRectDescription: {
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
      color: colors.textSecondary,
    },
    customRectActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
    },
    secondaryButton: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    secondaryLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    primaryButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: palette.themeColor,
    },
    primaryLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: palette.customRealWhite,
    },
  });

export default ModalLayer;
