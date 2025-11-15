import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeProvider';
import { returnDefaultProfielColor } from '../../store/exportFunctionFolder';

type ProfileContainerProps = {
  profileImg?: string | null;
  nickName: string;
  size?: number;
  isClickable?: boolean;
  onPress?: () => void;
  variant?: 'avatar' | 'accountRow';
  subtitle?: string | null;
  metaText?: string | null;
  showFollowButton?: boolean;
  isFollowing?: boolean;
  onPressFollow?: () => void;
};

const DEFAULT_SIZE = 40;

const ProfileContainer: React.FC<ProfileContainerProps> = ({
  profileImg,
  nickName,
  size = DEFAULT_SIZE,
  isClickable = true,
  onPress,
  variant = 'avatar',
  subtitle,
  metaText,
  showFollowButton = false,
  isFollowing = false,
  onPressFollow,
}) => {
  const { colors, palette } = useAppTheme();

  const avatarStyle = useMemo(
    () => [
      styles.avatarWrapper,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.card },
    ],
    [colors.card, size],
  );

  const initials = nickName?.slice(0, 1)?.toUpperCase() ?? '?';
  const isDefaultImage = profileImg?.startsWith('default_');

  const content = isDefaultImage ? (
    <Ionicons name="person-circle-outline" size={size} color={returnDefaultProfielColor(profileImg)} />
  ) : profileImg ? (
    <Image source={{ uri: profileImg }} style={styles.avatarImage} />
  ) : (
    <View style={styles.fallbackCircle}>
      <Text style={[styles.fallbackText, { color: colors.textPrimary }]}>{initials}</Text>
    </View>
  );

  if (variant === 'accountRow') {
    const body = (
      <View style={styles.accountRow}>
        <View style={styles.accountInfo}>
          <View style={avatarStyle}>{content}</View>
          <View style={styles.accountTexts}>
            <Text style={[styles.accountName, { color: colors.textPrimary }]} numberOfLines={1}>
              {nickName}
            </Text>
            {subtitle ? (
              <Text style={[styles.accountSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
            {metaText ? (
              <Text style={[styles.accountMetaText, { color: colors.textSecondary }]} numberOfLines={1}>
                {metaText}
              </Text>
            ) : null}
          </View>
        </View>
        {showFollowButton ? (
          <TouchableOpacity
            onPress={onPressFollow}
            style={[
              styles.followButton,
              {
                backgroundColor: isFollowing ? colors.border : palette.customBlack,
              },
            ]}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.followButtonLabel,
                { color: isFollowing ? colors.textPrimary : palette.customRealWhite },
              ]}
            >
              {isFollowing ? '팔로잉' : '팔로우'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );

    if (isClickable && onPress) {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          {body}
        </TouchableOpacity>
      );
    }

    return body;
  }

  if (isClickable && onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={avatarStyle} accessibilityRole="button">
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={avatarStyle}>{content}</View>;
};

const styles = StyleSheet.create({
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  fallbackCircle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: '600',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  accountTexts: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '700',
  },
  accountSubtitle: {
    fontSize: 14,
  },
  accountMetaText: {
    fontSize: 12,
  },
  followButton: {
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ProfileContainer;
