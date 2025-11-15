import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BodyText, H1 } from './Typography';
import { useAppTheme } from '../theme/ThemeProvider';

export type AuthScreenLayoutProps = {
  title: string;
  subtitle?: string;
  helper?: string;
  children: ReactNode;
  footer?: ReactNode;
  contentStyle?: ViewStyle;
  keyboardOffset?: number;
};

const AuthScreenLayout: React.FC<AuthScreenLayoutProps> = ({
  title,
  subtitle,
  helper,
  children,
  footer,
  contentStyle,
  keyboardOffset,
}) => {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: colors.background,
        },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset ?? Platform.select({ ios: 0, android: 24 })}
        style={styles.flex}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={[styles.content, contentStyle]}
          >
            <View style={styles.headerBlock}>
              <H1 style={styles.title}>{title}</H1>
              {subtitle ? <BodyText style={styles.subtitle}>{subtitle}</BodyText> : null}
              {helper ? <BodyText style={styles.helper}>{helper}</BodyText> : null}
            </View>

            <View style={styles.form}>{children}</View>

            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
  },
  headerBlock: {
    gap: 12,
    alignItems: 'center',
  },
  title: {
    marginTop: 30,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  helper: {
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  footer: {
    marginTop: 8,
  },
});

export default AuthScreenLayout;
