import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAppTheme } from '../../theme/ThemeProvider';

type FilterType = 'Account' | 'Hashtag';

type SearchChangePayload = {
  value: string;
  filter: FilterType;
};

type SearchInputBarProps = {
  value: string;
  onChange: (payload: SearchChangePayload) => void;
  onSubmit?: (payload: SearchChangePayload) => void;
  inputProps?: TextInputProps;
};

const detectFilter = (value: string): SearchChangePayload => {
  const trimmed = value.trimStart();

  if (trimmed.startsWith('#')) {;
    return {
      value,
      filter: 'Hashtag',
    };
  }

  if (trimmed.startsWith('@')) {
    return {
      value: trimmed.replace(/^@+/, ''),
      filter: 'Account',
    };
  }
   return {
      value: value,
      filter: 'Account',
    };
};

const SearchInputBar: React.FC<SearchInputBarProps> = ({ value, onChange, onSubmit, inputProps }) => {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [text, setText] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setText(value);
  }, [value]);

  const emitChange = useCallback(
    (nextValue: string) => {
      const payload = detectFilter(nextValue);
      onChange(payload);
    },
    [onChange],
  );

  const handleChangeText = useCallback(
    (next: string) => {
      setText(next);
      emitChange(next);
    },
    [emitChange],
  );

  const handleSubmit = useCallback(() => {
    const payload = detectFilter(text);
    if (payload.value.length > 0) {
      onSubmit?.(payload);
    }
  }, [onSubmit, text]);

  const handleClear = useCallback(() => {
    setText('');
    emitChange('');
  }, [emitChange]);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}> 
      {!isFocused ? (
        <Ionicons
          name="search"
          size={18}
          color={colors.textSecondary}
          style={styles.leadingIcon}
        />
      ) : (
        <View style={styles.leadingSpacer} />
      )}
      <TextInput
        value={text}
        onChangeText={handleChangeText}
        placeholder="검색"
        placeholderTextColor={colors.placeholder}
        style={[styles.input, { color: colors.textPrimary }]}
        autoCorrect={false}
        returnKeyType="search"
        autoCapitalize="none"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={handleSubmit}
        {...inputProps}
      />
      {text.length > 0 && isFocused ? (
        <TouchableOpacity onPress={handleClear} hitSlop={8} style={styles.trailingIconWrapper}>
          <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.trailingSpacer} />
      )}
    </View>
  );
};

const createStyles = (
  colors: ReturnType<typeof useAppTheme>['colors'],
) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 18,
    },
    leadingIcon: {
      marginRight: 8,
    },
    leadingSpacer: {
      width: 18,
      marginRight: 8,
    },
    trailingIconWrapper: {
      marginLeft: 8,
    },
    trailingSpacer: {
      width: 18,
      marginLeft: 8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      padding: 0,
    },
  });

export type { SearchChangePayload };
export default SearchInputBar;
