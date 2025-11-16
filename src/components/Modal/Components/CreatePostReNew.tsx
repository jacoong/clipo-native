import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
    Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMentions, type TriggersConfig, parseValue } from 'react-native-controlled-mentions';
import { getConfigsArray } from 'react-native-controlled-mentions/dist/utils/helpers';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/ThemeProvider';
import ProfileContainer from '../../ProfileContainer';
import PostTool, { PostToolDescriptor, ToolType } from '../../Posts/PostTool';
import { useAppSelector } from '../../../../store/redux/hooks';
import { SocialService } from '../../../../store/ApiService';
import { ThemedButton } from '../../ThemedButton';
import useFlashMessage from '../../../hooks/useFlashMessage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type EditorImage = {
  id: string;
  uri: string;
  asset?: ImagePicker.ImagePickerAsset;
};

type CreatePostReNewProps = {
  onRequestClose?: () => void;
  type?: 'board' | 'reply' | 'nestRe';
  bno?: number;
  parentRno?: number;
  rno?: number;
  original?: {
    content?: string;
    tags?: string[];
    mentions?: string[];
    images?: string[];
    isLikeVisible?: boolean;
    isReplyAllowed?: boolean;
  } | null;
  replyTarget?: {
    nickName: string;
    username?: string;
    profilePicture?: string | null;
    contents?: string;
    regData?: string;
    typeOfPost?: 'board' | 'reply' | 'nestRe';
  };
};


type SuggestionItem = {
  id: string;
  name: string;
  display?: string;
  subText?: string;
  avatar?: string | null;
  kind?: 'create';
};

type SuggestionFetcher = (keyword: string) => Promise<SuggestionItem[]>;

const MAX_LENGTH = 500;
const MIN_EDITOR_HEIGHT = 160;
const normalizeText = (value: string): string => {
  if (typeof value !== 'string') {
    return value as unknown as string;
  }
  if (value.normalize) {
    try {
      return value.normalize('NFC');
    } catch {
      return value;
    }
  }
  return value;
};

const buildPrefixedList = (values: string[], prefix: string, allowEmpty = false) => {
  if (!values.length) {
    return allowEmpty ? '' : null;
  }
  return values
    .map((value) => (value.startsWith(prefix) ? value : `${prefix}${value}`))
    .join(',');
};

const stripPrefix = (value: string, prefix: string) =>
  value.startsWith(prefix) ? value.slice(prefix.length) : value;

const normalizeListForComparison = (values: string[] | undefined | null, prefix: '@' | '#') =>
  (values ?? [])
    .map((item) => normalizeText(stripPrefix(item ?? '', prefix)).trim())
    .filter((item) => item.length > 0);

const extractResponseItems = (payload: any): any[] => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.body)) {
    return payload.body;
  }

  if (Array.isArray(payload?.body?.data)) {
    return payload.body.data;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.body)) {
    return payload.data.body;
  }

  if (Array.isArray(payload?.data?.body?.data)) {
    return payload.data.body.data;
  }

  return [];
};

const CreatePostReNew: React.FC<CreatePostReNewProps> = ({
  onRequestClose,
  type = 'board',
  bno,
  parentRno,
  rno,
  original,
  replyTarget,
}) => {
  const { colors, palette, mode: themeMode } = useAppTheme();
  const styles = useMemo(() => createStyles(colors, palette), [colors, palette]);
  const { showMessage } = useFlashMessage();
  const currentUser = useAppSelector((state) => state.loginUserInfo);
  const insets = useSafeAreaInsets();
  const [content, setContent] = useState('');
  const [editorImages, setEditorImages] = useState<EditorImage[]>([]);
  const [isLikeVisible, setIsLikeVisible] = useState(true);
  const [isReplyAllowed, setIsReplyAllowed] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [suggestionsDismissed, setSuggestionsDismissed] = useState(false);
  const mentionInputRef = useRef<any>(null);

  const fetchUserSuggestions = useCallback<SuggestionFetcher>(async (keyword) => {
    try {
      const response = await SocialService.searchUserAccount(keyword, 0);
      const list = extractResponseItems(response?.data) ?? [];
      return list
        .map((item: any, index: number) => {
          const username = item?.username ?? item?.nickName ?? '';
          if (!username) {
            return null;
          }
          return {
            id: String(item?.username ?? item?.id ?? index),
            name: username,
            display: item?.nickName ?? username,
            subText: item?.username ? `@${item.username}` : undefined,
            avatar: item?.profilePicture ?? null,
          };
        })
        .filter(Boolean) as SuggestionItem[];
    } catch (error) {
      console.warn('searchUserAccount failed', error);
      return [];
    }
  }, []);

  const fetchHashTagSuggestions = useCallback<SuggestionFetcher>(async (keyword) => {
    try {
      const query = keyword.startsWith('#') ? keyword : `#${keyword}`;
      const response = await SocialService.searchHashTag(query, 0);
      const list = extractResponseItems(response?.data) ?? [];
      return list
        .map((item: any, index: number) => {
          const rawTag =
            typeof item === 'string'
              ? item
              : item?.tagName ?? item?.name ?? item?.tag ?? '';
          if (!rawTag) {
            return null;
          }
          const base = normalizeText(rawTag.startsWith('#') ? rawTag.slice(1) : rawTag);
          if (!base) {
            return null;
          }
          return {
            id: String(item?.id ?? base ?? index),
            name: base,
            display: `#${base}`,
            subText: undefined,
          };
        })
        .filter(Boolean) as SuggestionItem[];
    } catch (error) {
      console.warn('searchHashTag failed', error);
      return [];
    }
  }, []);

  const focusEditor = useCallback(() => {
    requestAnimationFrame(() => {
      mentionInputRef.current?.focus?.();
    });
  }, []);

  const createEditorEntries = useCallback(
    (assets: ImagePicker.ImagePickerAsset[]) =>
      (assets ?? [])
        .filter((asset) => !!asset?.uri)
        .map((asset, index) => ({
          id: asset.assetId ?? `${asset.uri}-${Date.now()}-${index}`,
          uri: asset.uri,
          asset,
        })),
    [],
  );

  const handlePickImages = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showMessage({
        type: 'caution',
        title: '사진 접근 권한이 필요합니다',
        description: '설정에서 갤러리 접근을 허용해주세요.',
      });
      focusEditor();
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (result.canceled) {
      focusEditor();
      return;
    }

    const newEntries = createEditorEntries(result.assets ?? []);
    if (newEntries.length === 0) {
      focusEditor();
      return;
    }

    setEditorImages((prev) => {
      if (type === 'board') {
        const existingUris = new Set(prev.map((img) => img.uri));
        const deduped = newEntries.filter((img) => !existingUris.has(img.uri));
        return [...prev, ...deduped];
      }
      const latest = newEntries[newEntries.length - 1];
      return latest ? [latest] : prev;
    });
    focusEditor();
  }, [createEditorEntries, focusEditor, showMessage, type]);

  const handleRemoveImage = useCallback((id: string) => {
    setEditorImages((prev) => prev.filter((img) => img.id !== id));
    focusEditor();
  }, [focusEditor]);

  useEffect(() => {
    console.log('CreatePostReNew mounted');
    const timeoutId = setTimeout(() => {
      focusEditor();
    }, 120);
    return () => clearTimeout(timeoutId);
  }, [focusEditor]);

  useEffect(() => {
    if (!original) {
      setContent('');
      setIsLikeVisible(true);
      setIsReplyAllowed(true);
      setEditorImages([]);
      return;
    }

    setContent(original.content ?? '');
    setIsLikeVisible(
      original.isLikeVisible !== undefined ? original.isLikeVisible : true,
    );
    setIsReplyAllowed(
      original.isReplyAllowed !== undefined ? original.isReplyAllowed : true,
    );
    const imageList = Array.isArray(original.images) ? original.images : [];
    const seeded = imageList.map((uri, index) => ({
      id: `persisted-${index}-${uri}`,
      uri,
    }));
    setEditorImages(type === 'board' ? seeded : seeded.slice(0, 1));
  }, [original, type]);

    useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates?.height ?? 0);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);


  const handleToolPress = useCallback(
    (type: ToolType) => {
      switch (type) {
        case 'morePicture':
          handlePickImages();
          break;
        case 'tags':
          setContent((prev) => {
            const needsSpace = prev.length > 0 && !prev.endsWith(' ');
            const nextValue = `${prev}${needsSpace ? ' ' : ''}#`;
            return nextValue;
          });
          focusEditor();
          break;
        case 'likeVisible':
          setIsLikeVisible((prev) => !prev);
          break;
        case 'replyAllowed':
          setIsReplyAllowed((prev) => !prev);
          break;
        default:
          break;
      }
    },
    [focusEditor, handlePickImages],
  );

  const tools = useMemo<PostToolDescriptor[]>(
    () => [
      { type: 'morePicture', value: {} },
      { type: 'tags', value: {} },
      { type: 'likeVisible', value: { isLikeVisible } },
      { type: 'replyAllowed', value: { isReplyAllowed } },
    ],
    [isLikeVisible, isReplyAllowed],
  );

  // Mentions hook-based config for '@' and '#'
  const mentionTextStyle = useMemo(
    () => ({ color: palette.themeColor, fontWeight: '600' }),
    [palette.themeColor],
  );
  const hashtagTextStyle = useMemo(
    () => ({ color: colors.textPrimary, fontWeight: '600' }),
    [colors.textPrimary],
  );

  const triggersConfig = useMemo<TriggersConfig<'mention' | 'hashtag'>>(
    () => ({
      mention: {
        trigger: '@',
        textStyle: mentionTextStyle,
        markup: '@__display__',
      },
      hashtag: {
        trigger: '#',
        textStyle: hashtagTextStyle,
        markup: '#__display__',
      },
    }),
    [hashtagTextStyle, mentionTextStyle],
  );

  const handleMentionChange = useCallback(
    (nextValue: string) => {
      const rawValue = nextValue ?? '';
      try {
        const configs = getConfigsArray(triggersConfig);
        const state = parseValue(rawValue, configs);
        const plainCandidate = state?.plainText ?? rawValue;
        const plain = normalizeText(plainCandidate);
        if (plain.length > MAX_LENGTH) {
          return;
        }
      } catch {}
      setContent(rawValue);
    },
    [triggersConfig],
  );

  useEffect(() => {   
    console.log(content,'s')
  }, [content]);

  const { textInputProps, triggers, mentionState } = useMentions({
    value: content,
    onChange: handleMentionChange,
    triggersConfig,
  });

  // Deprecated MentionInput partTypes removed in favor of useMentions

  const extractMentionsAndTags = useCallback(() => {
    try {
      const configs = getConfigsArray(triggersConfig);
      const state = mentionState ?? parseValue(content, configs);
      const parts = state?.parts ?? [];
      const mentions: string[] = [];
      const tags: string[] = [];
      parts.forEach((p) => {
        const trig = (p as any)?.data?.trigger;
        const name = normalizeText(((p as any)?.data?.name as string | undefined) ?? '');
        if (!name || !trig) return;
        if (trig === '@') {
          if (!mentions.includes(name)) mentions.push(name);
        } else if (trig === '#') {
          const tagValue = name.startsWith('#') ? name : `#${name}`;
          if (!tags.includes(tagValue)) tags.push(tagValue);
        }
      });
      const plain = normalizeText(state?.plainText ?? content);
      return { plain, mentions, tags };
    } catch {
      return { plain: normalizeText(content), mentions: [], tags: [] };
    }
  }, [content, mentionState, triggersConfig]);

  const editorSnapshot = useMemo(() => {
    const { plain, mentions, tags } = extractMentionsAndTags();
    return {
      plain,
      mentions: normalizeListForComparison(mentions, '@'),
      tags: normalizeListForComparison(tags, '#'),
    };
  }, [extractMentionsAndTags]);
  const {
    plain: editorPlain,
    mentions: editorMentions,
    tags: editorTags,
  } = editorSnapshot;

  const arraysEqualMultiset = useCallback((a: string[] = [], b: string[] = []) => {
    if (a.length !== b.length) return false;
    const map = new Map<string, number>();
    a.forEach((v) => map.set(v, (map.get(v) ?? 0) + 1));
    for (const v of b) {
      const c = map.get(v) ?? 0;
      if (c === 0) return false;
      map.set(v, c - 1);
    }
    return true;
  }, []);

  const persistedImageUris = useMemo(
    () => editorImages.filter((img) => !img.asset).map((img) => img.uri),
    [editorImages],
  );
  const normalizedPersistedImageUris = useMemo(
    () => persistedImageUris.map((uri) => normalizeText(uri)),
    [persistedImageUris],
  );
  const hasNewImages = useMemo(() => editorImages.some((img) => !!img.asset), [editorImages]);

  const normalizedOriginalMentions = useMemo(
    () => normalizeListForComparison(original?.mentions, '@'),
    [original],
  );
  const normalizedOriginalTags = useMemo(
    () => normalizeListForComparison(original?.tags, '#'),
    [original],
  );
  const normalizedOriginalContent = useMemo(
    () => normalizeText(original?.content ?? ''),
    [original],
  );
  const normalizedOriginalImages = useMemo(
    () => (original?.images ?? []).map((uri) => normalizeText(uri)),
    [original],
  );
  const isEditMode = Boolean(original);

  const isEditPristine = useMemo(() => {
    if (!isEditMode) {
      return false;
    }
    const contentChanged = editorPlain !== normalizedOriginalContent;
    const mentionsChanged = !arraysEqualMultiset(normalizedOriginalMentions, editorMentions);
    const tagsChanged = !arraysEqualMultiset(normalizedOriginalTags, editorTags);
    const imagesChanged =
      hasNewImages || !arraysEqualMultiset(normalizedOriginalImages, normalizedPersistedImageUris);
    const likeVisibleChanged =
      original?.isLikeVisible !== undefined && original.isLikeVisible !== isLikeVisible;
    const replyAllowedChanged =
      original?.isReplyAllowed !== undefined && original.isReplyAllowed !== isReplyAllowed;

    return !(
      contentChanged ||
      mentionsChanged ||
      tagsChanged ||
      imagesChanged ||
      likeVisibleChanged ||
      replyAllowedChanged
    );
  }, [
    editorMentions,
    editorPlain,
    editorTags,
    hasNewImages,
    isEditMode,
    isLikeVisible,
    isReplyAllowed,
    normalizedOriginalContent,
    normalizedOriginalImages,
    normalizedOriginalMentions,
    normalizedOriginalTags,
    normalizedPersistedImageUris,
    original?.isLikeVisible,
    original?.isReplyAllowed,
  ]);

  const normalizeAsset = (asset: ImagePicker.ImagePickerAsset, index: number) => {
    const uri = asset.uri;
    const name = (asset as any).fileName || `image_${index}.jpg`;
    const type = asset.mimeType || 'image/jpeg';
    return { uri, name, type } as any;
  };

  
  const buildBoardFormData = () => {
    const formData = new FormData();
    formData.append('content', editorPlain);
    formData.append('isLikeVisible', String(isLikeVisible));
    formData.append('isReplyAllowed', String(isReplyAllowed));
    const mentionList = buildPrefixedList(editorMentions, '@');
    if (mentionList !== null) formData.append('mentions', mentionList);
    const tagList = buildPrefixedList(editorTags, '#');
    if (tagList !== null) formData.append('tags', tagList);
    const newAssets = editorImages.filter((img) => img.asset);
    newAssets.forEach((img, idx) => {
      formData.append('boardImages', normalizeAsset(img.asset!, idx));
    });
    return formData;
  };

  const buildReplyFormData = () => {
    const formData = new FormData();
    if (bno) formData.append('bno', String(bno));
    if (parentRno) formData.append('parentRno', String(parentRno));
    formData.append('content', editorPlain);
    const mentionList = buildPrefixedList(editorMentions, '@');
    if (mentionList !== null) formData.append('mentions', mentionList);
    const tagList = buildPrefixedList(editorTags, '#');
    if (tagList !== null) formData.append('tags', tagList);
    const newImage = editorImages.find((img) => img.asset);
    if (newImage?.asset) {
      formData.append('commentImage', normalizeAsset(newImage.asset, 0));
    }
    return formData;
  };

  const buildEditBoardFormData = () => {
    const formData = new FormData();
    if (bno) formData.append('bno', String(bno));
    if (editorPlain !== normalizedOriginalContent) {
      formData.append('content', editorPlain);
    }
    if (
      original?.isLikeVisible !== undefined &&
      original.isLikeVisible !== isLikeVisible
    ) {
      formData.append('isLikeVisible', String(isLikeVisible));
    }
    if (
      original?.isReplyAllowed !== undefined &&
      original.isReplyAllowed !== isReplyAllowed
    ) {
      formData.append('isReplyAllowed', String(isReplyAllowed));
    }
    if (!arraysEqualMultiset(normalizedOriginalMentions, editorMentions)) {
      formData.append('mentions', buildPrefixedList(editorMentions, '@', true) ?? '');
    }
    if (!arraysEqualMultiset(normalizedOriginalTags, editorTags)) {
      formData.append('tags', buildPrefixedList(editorTags, '#', true) ?? '');
    }
    const imagesChanged = !arraysEqualMultiset(
      normalizedOriginalImages,
      normalizedPersistedImageUris,
    );
    if (persistedImageUris.length > 0 || imagesChanged) {
      formData.append('originImages', persistedImageUris.join(','));
    }
    const newAssets = editorImages.filter((img) => img.asset);
    newAssets.forEach((img, idx) => {
      formData.append('newImages', normalizeAsset(img.asset!, idx));
    });
    return formData;
  };

  const buildEditCommentFormData = () => {
    const formData = new FormData();
    if (bno) formData.append('bno', String(bno));
    if (rno) formData.append('rno', String(rno));
    if (editorPlain !== normalizedOriginalContent) {
      formData.append('content', editorPlain);
    }
    if (!arraysEqualMultiset(normalizedOriginalMentions, editorMentions)) {
      formData.append('mentions', buildPrefixedList(editorMentions, '@', true) ?? '');
    }
    if (!arraysEqualMultiset(normalizedOriginalTags, editorTags)) {
      formData.append('tags', buildPrefixedList(editorTags, '#', true) ?? '');
    }
    const imagesChanged = !arraysEqualMultiset(
      normalizedOriginalImages,
      normalizedPersistedImageUris,
    );
    if (persistedImageUris.length > 0 || imagesChanged) {
      formData.append('originImages', persistedImageUris.join(','));
    }
    const newImage = editorImages.find((img) => img.asset);
    if (newImage?.asset) {
      formData.append('newImage', normalizeAsset(newImage.asset, 0));
    }
    return formData;
  };

  const handleSubmit = useCallback(async () => {
    if (isEditMode && isEditPristine) {
      return;
    }
    const emptyText = !content.trim();
    const noImages = editorImages.length === 0;
    if (!original && type === 'board' && emptyText && noImages) {
      showMessage({
        type: 'caution',
        title: '작성할 내용을 입력해주세요',
        description: '텍스트나 이미지를 추가하면 게시할 수 있어요.',
      });
      return;
    }

    try {
      onRequestClose?.();
      let successMessage: Parameters<typeof showMessage>[0] | null = null;
      if (type === 'board') {
        if (original) {
          // Edit board: send only changed fields
          const fd = buildEditBoardFormData();
          await SocialService.modificateBoard(fd);
          successMessage = {
            type: 'success',
            title: '수정 완료',
            description: '게시물이 수정됐어요.',
          };
        } else {
          // Create board
          const fd = buildBoardFormData();
          await SocialService.createBoard(fd);
          successMessage = {
            type: 'success',
            title: '게시 완료',
            description: '새 게시물이 등록됐어요.',
          };
        }
      } else {
        // reply or nestRe
        if (original) {
          const fd = buildEditCommentFormData();
          await SocialService.modificateComment(fd);
          successMessage = {
            type: 'success',
            title: '수정 완료',
            description: '댓글이 수정됐어요.',
          };
        } else {
          const fd = buildReplyFormData();
          await SocialService.createReplyOrNestRe(fd);
          successMessage = {
            type: 'success',
            title: '등록 완료',
            description: '댓글이 등록됐어요.',
          };
        }
      }
      if (successMessage) {
        showMessage(successMessage);
      }
    } catch (e) {
      showMessage({ type: 'error', title: '요청 실패', description: '잠시 후 다시 시도해주세요.' });
    }
  }, [
    buildBoardFormData,
    buildEditBoardFormData,
    buildEditCommentFormData,
    buildReplyFormData,
    content,
    editorImages.length,
    isEditMode,
    isEditPristine,
    onRequestClose,
    showMessage,
    type,
  ]);

  const placeholderText = currentUser
    ? `${currentUser.nickName}님의 새로운 소식이 있나요?`
    : '새로운 소식을 알려주세요';
  const mentionKeyword = triggers.mention?.keyword?.trim() ?? '';
  const hashtagKeyword = triggers.hashtag?.keyword?.trim() ?? '';
  const showMentionSuggestions =
    !suggestionsDismissed && mentionKeyword.length > 0;
  const showHashtagSuggestions =
    !suggestionsDismissed && !showMentionSuggestions && hashtagKeyword.length > 0;

  useEffect(() => {
    if (
      suggestionsDismissed &&
      mentionKeyword.length === 0 &&
      hashtagKeyword.length === 0
    ) {
      setSuggestionsDismissed(false);
    }
  }, [hashtagKeyword.length, mentionKeyword.length, suggestionsDismissed]);
  const submitLabel = isEditMode ? '편집' : '게시';
  const isCreateDisabled = !content.trim() && editorImages.length === 0;
  const isSubmitDisabled = isEditMode ? isEditPristine : isCreateDisabled;
  const bottomPadding = Math.max(insets.bottom, 12);



  
  const Context_Area = replyTarget ? (
    <>
      <View style={styles.context_line_container}>
        <View style={styles.context_line} />
      </View>
      <View style={styles.replyContext}>
        <View style={styles.replyContextBody}>
          <ProfileContainer
            nickName={replyTarget.nickName}
            profileImg={replyTarget.profilePicture}
            size={48}
            isClickable={false}
          />
          <View style={styles.replyContextText}>
            <Text style={[styles.nickName, { color: colors.textPrimary }]} numberOfLines={1}>
              {replyTarget.nickName}
            </Text>
            {replyTarget.contents ? (
              <Text style={[styles.input, { color: colors.textPrimary }]} numberOfLines={2}>
                {replyTarget.contents}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </>
  ) : null;

  return (
     <View style={styles.container}>

      <View style={styles.inner}>
        {Context_Area}
          <ScrollView
              contentContainerStyle={[styles.mainContent, { paddingBottom: bottomPadding }]}
              keyboardDismissMode="none"
              keyboardShouldPersistTaps="always"
            >
            <View style={styles.composeRow}>
              <ProfileContainer
                nickName={currentUser?.nickName ?? 'Guest'}
                profileImg={currentUser?.profilePicture}
                size={48}
                isClickable={false}
              />
              <View style={styles.content_container}>
                <Text style={[styles.nickName, { color: colors.textPrimary }]}>
                  {currentUser?.nickName ?? 'Guest'}
                </Text>

                <View style={styles.textField_container}>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      {...textInputProps}
                      ref={mentionInputRef}
                      placeholder={placeholderText}
                      placeholderTextColor={colors.placeholder}
                      style={[styles.input, { color: colors.textPrimary }]}
                      autoFocus
                      multiline
                      maxLength={MAX_LENGTH}
                      selectionColor={palette.themeColor}
                      returnKeyType="default"
                      enablesReturnKeyAutomatically
                      scrollEnabled={false}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardAppearance={themeMode === 'dark' ? 'dark' : 'light'}
                      onBlur={() => mentionInputRef.current?.focus?.()}
                    />
                  </View>
                </View>

                {editorImages.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.previewContent}
                    style={styles.previewScroll}
                  >
                    {editorImages.map((item) => (
                      <View key={item.id} style={styles.previewItem}>
                        <Image source={{ uri: item.uri }} style={styles.previewImage} />
                        <TouchableOpacity
                          onPress={() => handleRemoveImage(item.id)}
                          style={styles.removeImageButton}
                          accessibilityRole="button"
                        >
                          <Ionicons name="close" size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                ) : null}
                <View style={styles.toolbarRow}>
                  {tools.map((tool) => (
                    <PostTool
                      key={tool.type}
                      typeOfTool={tool}
                      isDark={themeMode === 'dark'}
                      onPress={handleToolPress}
                    />
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={[styles.footerAvoider, { paddingBottom:Platform.OS === 'ios'?  keyboardHeight :0 }]}>
            <View style={styles.footerRow}>
              <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                {content.length}/{MAX_LENGTH}
              </Text>
              <ThemedButton
                label={submitLabel}
                onPress={handleSubmit}
                disabled={isSubmitDisabled}
                style={styles.submitButton}
              />
            </View>
            {(showMentionSuggestions || showHashtagSuggestions) && (
              <View
                style={[styles.suggestionOverlay, { paddingBottom: Platform.OS === 'ios'?keyboardHeight+bottomPadding + 24  :bottomPadding + 24 }]}
                pointerEvents="box-none"
              >
                <View style={styles.overlayListWrapper} pointerEvents="auto">
                  <TouchableOpacity
                    style={styles.suggestionCloseButton}
                    onPress={() => setSuggestionsDismissed(true)}
                    accessibilityRole="button"
                    hitSlop={8}
                  >
                    <Ionicons name="close" size={15} color={colors.textPrimary} />
                  </TouchableOpacity>
                  {showMentionSuggestions ? (
                    <MentionSuggestionList
                      keyword={mentionKeyword}
                      onSelect={(s) => {
                        const sanitized = s.name.replace(/^@/, '');
                        triggers.mention?.onSelect?.({
                          id: s.id,
                          name: sanitized,
                        });
                      }}
                      fetcher={fetchUserSuggestions}
                      type="user"
                    />
                  ) : null}
                  {showHashtagSuggestions ? (
                    <MentionSuggestionList
                      keyword={hashtagKeyword}
                      onSelect={(s) => {
                        const sanitized = s.name.startsWith('#') ? s.name.slice(1) : s.name;
                        triggers.hashtag?.onSelect?.({
                          id: s.id,
                          name: sanitized,
                        });
                      }}
                      fetcher={fetchHashTagSuggestions}
                      type="hashtag"
                    />
                  ) : null}
                </View>
              </View>
            )}
     
      </View>
      </View>
       </View>

  );
};

// The library's exported MentionSuggestionsProps typing can vary by version.
// We only rely on 'keyword' and 'onSuggestionPress'.
type MentionSuggestionListProps = {
  keyword?: string;
  onSelect: (suggestion: SuggestionItem) => void;
  fetcher: SuggestionFetcher;
  type: 'user' | 'hashtag';
};


const MentionSuggestionList: React.FC<MentionSuggestionListProps> = ({ keyword, onSelect, fetcher, type }) => {
  const { colors, palette } = useAppTheme();
  const styles = useMemo(() => createSuggestionStyles(colors, palette), [colors, palette]);
  const [items, setItems] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const activeKeywordRef = useRef<string>('');
  const mountedRef = useRef(true);
  const trimmedKeyword = useMemo(() => normalizeText(keyword?.trim() ?? ''), [keyword]);
  const normalizedKeyword = useMemo(() => {
    const withoutHash = trimmedKeyword.replace(/^#/, '');
    return normalizeText(withoutHash);
  }, [trimmedKeyword]);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  React.useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (!trimmedKeyword) {
      setItems([]);
      setLoading(false);
      return;
    }

    activeKeywordRef.current = trimmedKeyword;
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      fetcher(trimmedKeyword)
        .then((result) => {
          if (mountedRef.current && activeKeywordRef.current === trimmedKeyword) {
            setItems(result);
          }
        })
        .finally(() => {
          if (mountedRef.current && activeKeywordRef.current === trimmedKeyword) {
            setLoading(false);
          }
        });
    }, 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [fetcher, trimmedKeyword]);

  const augmentedItems = useMemo(() => {
    if (type !== 'hashtag' || normalizedKeyword.length === 0) {
      return items;
    }

    if (items.length > 0) {
      return items;
    }

    const sanitized = normalizeText(normalizedKeyword);
    const lower = sanitized.toLowerCase();
    const alreadyExists = items.some((item) => (item.name ?? '').toLowerCase() === lower);
    if (alreadyExists) {
      return items;
    }

    const createItem: SuggestionItem = {
      id: sanitized,
      name: sanitized,
      display: `#${sanitized}`,
      subText: '+새로운 주제 태그하기',
      kind: 'create',
    };

    return [createItem];
  }, [items, normalizeText, normalizedKeyword, type]);

  if (!trimmedKeyword) {
    return null;
  }

  const data = augmentedItems;

  const renderItem = ({ item }: { item: SuggestionItem }) => (
    <TouchableOpacity style={styles.row} onPress={() => onSelect(item)} accessibilityRole="button">
      {type === 'user' ? (
        <View style={styles.avatarWrapper}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: colors.card }]}>
              <Text style={[styles.avatarInitial, { color: palette.themeColor }]}>
                {(item.display ?? item.name ?? '?').slice(0, 1).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={[styles.hashIcon, { borderColor: colors.border }]}>
          <Text style={[styles.hashText, { color: colors.textSecondary }]}>#</Text>
        </View>
      )}
      <View style={styles.rowText}>
        <Text style={[styles.primaryLabel, { color: colors.textPrimary }]} numberOfLines={1}>
          {item.display ?? (type === 'hashtag' ? `${item.name}` : item.name)}
        </Text>
        {item.subText ? (
          <Text style={[styles.secondaryLabel, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.subText}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  let content: React.ReactNode;
  if (loading) {
    content = (
      <View style={styles.loadingRow}>
        <ActivityIndicator size="small" color={palette.themeColor} />
      </View>
    );
  } else if (type === 'user') {
    content =
      data.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          검색 결과가 없어요
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="always"
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
          )}
        />
      );
  } else {
    content = (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="always"
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {content}
    </View>
  );
};

const createStyles = (
  colors: ReturnType<typeof useAppTheme>['colors'],
  palette: ReturnType<typeof useAppTheme>['palette'],
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      position: 'relative',
    },
    inner: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 20,
      position: 'relative',
      justifyContent: 'space-between',
    },
    context_line_container:{
      position:'absolute',
      left:20,
      top:64,
      width:48,
      height: 24,
      alignItems:'center',
    },
    context_line:{
      width:3,
      borderRadius:5,
      margin:'auto',
      height:'90%',
      backgroundColor: palette.themeColor,
    },
    mainContent: {
      paddingBottom: 24,
      rowGap: 20,
    },
    composeRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      
    },
    content_container: {
      gap: 5,
      flex: 1,
    },
    nickName: {
      fontSize: 18,
      fontWeight: '600',
    },
    textField_container: {
      justifyContent: 'flex-start',
    
    },
    inputWrapper: {
      position: 'relative',
      flex: 1,
   
    },
    input: {
      fontSize: 18,
      lineHeight: 26,
      textAlignVertical: 'top',
      padding: 0,
    },
    previewScroll: {
      width: '100%',
    },
    previewContent: {
      paddingRight: 20,
    },
    previewItem: {
      width: 120,
      height: 140,
      borderRadius: 16,
      overflow: 'hidden',
      marginRight: 12,
    },
    previewImage: {
      width: '100%',
      height: '100%',
    },
    removeImageButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'rgba(0,0,0,0.6)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    toolbarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    footerAvoider: {
      paddingTop: 12,
      width: '100%',
    },
    footerRow: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',

    },
    charCount: {
      fontSize: 13,
    },
    submitButton: {
      paddingHorizontal: 24,
    },
      suggestionOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      bottom: 0,
      zIndex: 2000,
      elevation: 12,
    },
    overlayListWrapper: {
      width: '100%',
      gap: 12,
      alignItems: 'stretch',
      position: 'relative',
      paddingTop: 32,
    },
    suggestionCloseButton: {
      position: 'absolute',
      top: 23,
      right: -6,
      padding: 1,
      borderRadius: 16,
            zIndex: 2001,
      backgroundColor: colors.card,
    },
    replyContext: {  
      flexDirection: 'row',
      gap: 12,
    },
    replyContextLine: {
      width: 2,
      borderRadius: 999,
      backgroundColor: palette.themeColor,
    },
    replyContextBody: {
      flex: 1,
      flexDirection: 'row',
      gap: 12,
    },
    replyContextText: {
      flex: 1,
      justifyContent: 'center',
      gap: 4,
    },
    replyContextContent: {
      fontSize: 13,
    },
  });

const createSuggestionStyles = (
  colors: ReturnType<typeof useAppTheme>['colors'],
  palette: ReturnType<typeof useAppTheme>['palette'],
) =>
  StyleSheet.create({
    container: {
      marginTop: 0,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      maxHeight: 220,
      overflow: 'hidden',
      // Keep suggestions above surrounding views and keyboard overlays
      zIndex: 1000,
      elevation: 10,
            alignSelf: 'stretch',
      width: '100%',
    },
    loadingRow: {
      paddingVertical: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      paddingVertical: 16,
      textAlign: 'center',
      fontSize: 13,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    rowText: {
      flex: 1,
    },
    primaryLabel: {
      fontSize: 15,
      fontWeight: '600',
    },
    secondaryLabel: {
      marginTop: 2,
      fontSize: 12,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      width: '100%',
    },
    avatarWrapper: {
      width: 40,
      height: 40,
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    avatarFallback: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitial: {
      fontSize: 16,
      fontWeight: '700',
    },
    hashIcon: {
      width: 30,
      height: 30,
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      alignItems: 'center',
      justifyContent: 'center',
    },
    hashText: {
      fontSize: 20,
      fontWeight: '700',
    },
  });

export default CreatePostReNew;
