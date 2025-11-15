import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAppTheme } from '../../theme/ThemeProvider';

export interface ConfirmModalProps {
  visible: boolean;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  message,
  onConfirm,
  onCancel,
  onClose,
  confirmLabel = '확인',
  cancelLabel = '취소',
}) => {
  const { colors, palette } = useAppTheme();

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.45)' }]}>
        <View style={[styles.box, { backgroundColor: colors.surface }]}>
          <Text style={[styles.text, { color: colors.textPrimary }]}>{message}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.ghostButton]}
              onPress={handleCancel}
              accessibilityRole="button"
            >
              <Text style={[styles.buttonLabel, { color: colors.textSecondary }]}>
                {cancelLabel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: palette.themeColor }]}
              onPress={handleConfirm}
              accessibilityRole="button"
            >
              <Text style={[styles.buttonLabel, styles.primaryLabel]}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  box: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 16,
    elevation: 6,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    minWidth: 96,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
});

export default ConfirmModal;
