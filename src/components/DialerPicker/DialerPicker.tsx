import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { DialerButton } from '../DialerButton';
import { dialerRemover } from '../../helpers/dialerRemover';
import { useKeyboardStatus } from '../../helpers/useKeyboardStatus';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { removeDiacritics } from '../../helpers/diacriticsRemover';
import { CountryName, DialerCode } from '../../constants/dialerCodes';
import {
  DialerStyle,
  DialerItemTemplateProps,
  DialerListHeaderComponentProps,
} from '../../types';
import { getCountryName } from '../../helpers/getCountryName';

const height = Dimensions.get('window').height;

/**
 * Dialer picker component
 * @param {?boolean} show Hide or show component by using this props
 * @param {?boolean} disableBackdrop Hide or show component by using this props
 * @param {?boolean} enableModalAvoiding Is modal should avoid keyboard ? On android to work required to use with androidWindowSoftInputMode with value pan, by default android will avoid keyboard by itself
 * @param {?string} androidWindowSoftInputMode Hide or show component by using this props
 * @param {?string} inputPlaceholder Text to showing in input
 * @param {?string} searchMessage Text to show user when no dialer to show
 * @param {?string} lang Current selected lang by user
 * @param {?string} initialState Here you should define initial dial code
 * @param {?array} excludedCountries Array of countries which should be excluded from picker
 * @param {Function} pickerButtonOnPress Function to receive selected dialer
 * @param {Function} onBackdropPress Function to receive selected dialer
 * @param {Function} onRequestClose Function to receive selected dialer
 * @param {?Object} style Styles
 * @param {?React.ReactNode} itemTemplate Dialer list template
 * @param rest
 */

interface Props {
  excludedCountries?: string[];
  showOnly?: string[];
  popularCountries?: string[];
  style?: DialerStyle;
  show: boolean;
  enableModalAvoiding?: boolean;
  disableBackdrop?: boolean;
  onBackdropPress?: (...args: any) => any;
  pickerButtonOnPress: (item: DialerCode) => any;
  itemTemplate?: (props: DialerItemTemplateProps) => JSX.Element;
  ListHeaderComponent?: (props: DialerListHeaderComponentProps) => JSX.Element;
  onRequestClose?: (...args: any) => any;
  lang: keyof CountryName;
  inputPlaceholder?: string;
  inputPlaceholderTextColor?: TextStyle['color'];
  searchMessage?: string;
  androidWindowSoftInputMode?: string;
  initialState?: string;
  otherCountriesHeaderTitle?: string;
  otherCountriesHeaderTitleStyle?: TextStyle;
  searchContainerStyle?: StyleProp<ViewStyle>;
}

export const DialerPicker = ({
  show,
  popularCountries,
  pickerButtonOnPress,
  inputPlaceholder,
  inputPlaceholderTextColor,
  searchMessage,
  lang = 'en',
  style,
  enableModalAvoiding,
  androidWindowSoftInputMode,
  onBackdropPress,
  disableBackdrop,
  excludedCountries,
  initialState,
  onRequestClose,
  showOnly,
  ListHeaderComponent,
  itemTemplate: ItemTemplate = DialerButton,
  otherCountriesHeaderTitle,
  otherCountriesHeaderTitleStyle,
  searchContainerStyle,
  ...rest
}: Props) => {
  const filteredCodes = useMemo(
    () => dialerRemover(excludedCountries),
    [excludedCountries]
  );
  const keyboardStatus = useKeyboardStatus();
  const animationDriver = useRef(new Animated.Value(0)).current;
  const animatedMargin = useRef(new Animated.Value(0)).current;
  const [searchValue, setSearchValue] = useState<string>(initialState || '');
  const [showModal, setShowModal] = useState<boolean>(false);

  const animateMargin = useCallback(
    (toValue: number) => {
      Animated.timing(animatedMargin, {
        toValue,
        duration: 190,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    },
    [animatedMargin]
  );

  useEffect(() => {
    if (
      enableModalAvoiding &&
      (keyboardStatus.keyboardPlatform === 'ios' ||
        (keyboardStatus.keyboardPlatform === 'android' &&
          androidWindowSoftInputMode === 'pan'))
    ) {
      animateMargin(keyboardStatus.isOpen ? keyboardStatus.keyboardHeight : 0);
    }
  }, [
    keyboardStatus.isOpen,
    keyboardStatus.keyboardHeight,
    enableModalAvoiding,
    animateMargin,
    keyboardStatus.keyboardPlatform,
    androidWindowSoftInputMode,
  ]);

  const preparedPopularCountries = useMemo(() => {
    const popularSet = new Set(
      popularCountries?.map((short) => short.toUpperCase())
    );

    return filteredCodes?.filter((dialer) => popularSet.has(dialer?.code));
  }, [popularCountries, filteredCodes]);

  const codes = useMemo(() => {
    let newCodes = filteredCodes;

    if (showOnly?.length) {
      const showOnlySet = new Set(showOnly.map((short) => short.toUpperCase()));
      newCodes = filteredCodes?.filter((dialer) =>
        showOnlySet.has(dialer?.code)
      );
    }

    return newCodes
      .slice()
      .sort((a, b) =>
        getCountryName(a?.name, lang).localeCompare(
          getCountryName(b?.name, lang)
        )
      );
  }, [showOnly, filteredCodes, lang]);

  const resultCountries = useMemo(() => {
    const lowerSearchValue = searchValue.toLowerCase().trim();

    return codes.filter((dialer) => {
      const countryName = getCountryName(dialer?.name, lang).toLowerCase();

      return (
        dialer?.dial_code.includes(searchValue) ||
        countryName.includes(lowerSearchValue) ||
        removeDiacritics(countryName).includes(lowerSearchValue)
      );
    });
  }, [searchValue, lang, codes]);

  const modalPosition = useMemo(
    () =>
      animationDriver.interpolate({
        inputRange: [0, 1],
        outputRange: [height, 0],
        extrapolate: 'clamp',
      }),
    [animationDriver]
  );

  const modalBackdropFade = useMemo(
    () =>
      animationDriver.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp',
      }),
    [animationDriver]
  );

  const animateModal = useCallback(
    (toValue: number, onComplete?: () => void) => {
      Animated.timing(animationDriver, {
        toValue,
        duration: 400,
        useNativeDriver: true,
      }).start(onComplete);
    },
    [animationDriver]
  );

  const openModal = useCallback(() => {
    animateModal(1);
  }, [animateModal]);

  const closeModal = useCallback(() => {
    animateModal(0, () => setShowModal(false));
  }, [animateModal]);

  useEffect(() => {
    if (show && !showModal) {
      setShowModal(true);
    } else if (!show && showModal) {
      closeModal();
    }
  }, [closeModal, show, showModal]);

  const renderItemOnPress = useCallback(
    (item: DialerCode) => {
      Keyboard.dismiss();
      pickerButtonOnPress?.(item);
    },
    [pickerButtonOnPress]
  );

  const renderItem = useCallback(
    ({ item }: { item: DialerCode }) => {
      const itemName = getCountryName(item?.name, lang);

      return (
        <ItemTemplate
          key={item.code}
          item={item}
          style={style}
          name={itemName}
          onPress={() => renderItemOnPress(item)}
        />
      );
    },
    [lang, ItemTemplate, style, renderItemOnPress]
  );

  const onStartShouldSetResponder = useCallback(() => {
    onBackdropPress?.();
    return false;
  }, [onBackdropPress]);

  const onPressHeaderItem = useCallback(
    (item: DialerCode) => {
      Keyboard.dismiss();
      pickerButtonOnPress?.(item);
    },
    [pickerButtonOnPress]
  );

  const renderHeaderComponent = useMemo(() => {
    if (popularCountries && ListHeaderComponent && !searchValue) {
      return (
        <View>
          <ListHeaderComponent
            countries={preparedPopularCountries}
            lang={lang}
            onPress={onPressHeaderItem}
          />
          <Text style={otherCountriesHeaderTitleStyle}>
            {otherCountriesHeaderTitle || 'Other Countries'}
          </Text>
        </View>
      );
    }
    return null;
  }, [
    popularCountries,
    ListHeaderComponent,
    searchValue,
    preparedPopularCountries,
    lang,
    onPressHeaderItem,
    otherCountriesHeaderTitleStyle,
    otherCountriesHeaderTitle,
  ]);

  const flatListStyle = useMemo(
    () => (style?.itemsList ? [style.itemsList] : undefined),
    [style]
  );

  const modalBackdropStyle = useMemo(
    () => [
      {
        opacity: modalBackdropFade,
      },
      styles.backdrop,
      style?.backdrop,
    ],
    [modalBackdropFade, style?.backdrop]
  );

  const modalStyle = useMemo(
    () => [
      styles.modal,
      style?.modal,
      {
        transform: [
          {
            translateY: modalPosition,
          },
        ],
      },
    ],
    [modalPosition, style?.modal]
  );

  const modalInnerStyle = useMemo(
    () => [styles.modalInner, style?.modalInner, { height: animatedMargin }],
    [style?.modalInner, animatedMargin]
  );

  const textInputStyle = useMemo(
    () => [styles.searchBar, style?.textInput],
    [style?.textInput]
  );

  const searchMessageTextStyle = useMemo(
    () => [styles.searchMessage, style?.searchMessageText],
    [style?.searchMessageText]
  );

  const dialerMessageContainerStyle = useMemo(
    () => [styles.dialerMessage, style?.dialerMessageContainer],
    [style?.dialerMessageContainer]
  );

  const lineStyle = useMemo(() => [styles.line, style?.line], [style?.line]);

  const searchContainerStyles = useMemo(
    () => [styles.searchContainer, searchContainerStyle],
    [searchContainerStyle]
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showModal}
      onShow={openModal}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        {!disableBackdrop && (
          <Animated.View
            onStartShouldSetResponder={onStartShouldSetResponder}
            style={modalBackdropStyle}
          />
        )}
        <Animated.View style={modalStyle}>
          <View style={searchContainerStyles}>
            <TextInput
              style={textInputStyle}
              value={searchValue}
              onChangeText={setSearchValue}
              placeholder={inputPlaceholder || 'Search your dialer'}
              placeholderTextColor={inputPlaceholderTextColor || '#8c8c8c'}
              testID="dialerCodesPickerSearchInput"
              {...rest}
            />
          </View>
          <View style={lineStyle} />
          {resultCountries.length === 0 ? (
            <View style={dialerMessageContainerStyle}>
              <Text style={searchMessageTextStyle}>
                {searchMessage || 'Sorry we cant find your dialer :('}
              </Text>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={resultCountries || codes}
              keyExtractor={(item) => item.code || item.dial_code}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              style={flatListStyle}
              keyboardShouldPersistTaps="handled"
              renderItem={renderItem}
              testID="dialerCodesPickerFlatList"
              ListHeaderComponent={renderHeaderComponent}
              {...rest}
            />
          )}
        </Animated.View>
        <Animated.View style={modalInnerStyle} />
      </View>
    </Modal>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 600 : undefined,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    padding: 10,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    bottom: 0,
    zIndex: 10,
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    // Elevation for Android
    elevation: 10,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  modalInner: {
    zIndex: 99,
    backgroundColor: 'white',
    width: '100%',
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    height: 40,
    padding: 5,
  },
  dialerMessage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
  },
  line: {
    width: '100%',
    height: 1.5,
    borderRadius: 2,
    backgroundColor: '#eceff1',
    alignSelf: 'center',
    marginVertical: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchMessage: {
    color: '#8c8c8c',
    fontSize: 16,
  },
});
