import {
  Animated,
  Dimensions,
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
import DialerButton from '../DialerButton';
import { dialerRemover } from '../../helpers/dialerRemover';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { removeDiacritics } from '../../helpers/diacriticsRemover';
import { CountryName, DialerCode } from '../../constants/dialerCodes';
import {
  DialerStyle,
  DialerItemTemplateProps,
  DialerListHeaderComponentProps,
} from '../../types';
import { getCountryName } from '../../helpers/getCountryName';
import { DialerList } from './DialerList';

const height = Dimensions.get('window').height;

/**
 * DialerPicker Component
 *
 * A customizable dialer picker component with modal support, allowing users to:
 * - Search countries by name or dial code.
 * - Exclude or include specific countries.
 * - Customize the modal, search field, and list appearance.
 *
 * @param {boolean} isVisible - Controls the visibility of the modal.
 * @param {boolean} [enableModalAvoiding] - Enables keyboard avoiding behavior on Android when used with `androidWindowSoftInputMode="pan"`.
 * @param {boolean} [disableBackdrop] - If `true`, disables the backdrop behind the modal.
 * @param {string} [androidWindowSoftInputMode] - Defines keyboard behavior on Android (e.g., `"pan"`).
 * @param {string} [searchPlaceholder] - Placeholder text for the search input field.
 * @param {string} [searchPlaceholderTextColor] - Color of the placeholder text in the search input field.
 * @param {string} [searchNotFoundMessage] - Message displayed when no results are found.
 * @param {keyof CountryName} lang - Selected language for country names (e.g., `'en'`, `'es'`). Default is `'en'`.
 * @param {string} [defaultDialCode] - Default dial code to be pre-selected.
 * @param {string} [otherCountriesHeaderTitle] - Title for the "Other Countries" section.
 * @param {TextStyle} [otherCountriesHeaderTitleStyle] - Styles for the "Other Countries" header title.
 * @param {StyleProp<ViewStyle>} [searchContainerStyle] - Custom styles for the search input container.
 *
 * @param {string[]} [excludedCountries] - Array of country codes to be excluded from the picker.
 * @param {string[]} [showOnly] - Array of country codes to be exclusively shown.
 * @param {string[]} [popularCountries] - Array of popular countries to be displayed at the top.
 *
 * @param {Function} onDialCodeSelect - Callback function triggered when a dial code is selected. Receives the selected item as an argument.
 * @example
 * onDialCodeSelect={(item) => console.log(item)}
 *
 * @param {Function} [onBackdropPress] - Callback function triggered when the backdrop is pressed (only if `disableBackdrop` is `false`).
 * @param {Function} [onClose] - Callback function triggered when the modal is closed.
 *
 * @param {(props: DialerItemTemplateProps) => JSX.Element | React.MemoExoticComponent<(props: DialerItemTemplateProps) => JSX.Element>} [itemTemplate]
 * Custom component for rendering each item in the list.
 * @example
 * itemTemplate={(props) => <CustomItemComponent {...props} />}
 *
 * @param {(props: DialerListHeaderComponentProps) => JSX.Element} [headerComponent]
 * Custom component for rendering the list header, typically for popular countries.
 * @example
 * headerComponent={(props) => <CustomHeader {...props} />}
 *
 * @param {DialerStyle} [style] - Customizable styles for the component.
 * The `DialerStyle` object allows partial overrides of specific UI elements:
 * - `backdrop` (ViewStyle): Style for the background overlay (if used in a modal).
 * - `modal` (ViewStyle): Style for the modal container.
 * - `line` (ViewStyle): Style for the separator line between items.
 * - `searchNotFoundMessageText` (TextStyle): Style for the "No results found" message text.
 * - `itemsList` (ContentStyle): Style for the main list container.
 * - `searchNotFoundContainer` (ViewStyle): Style for the container wrapping the "No results found" message.
 * - `textInput` (TextStyle): Style for the search input field.
 * - `dialerButtonStyles` (ViewStyle): Style for the button representing a dialer item.
 * - `flag` (TextStyle): Style for the country flag icon (if applicable).
 * - `dialCode` (TextStyle): Style for the country dial code text.
 * - `dialerName` (TextStyle): Style for the country name text.
 * - `otherCountriesHeaderTitleStyle` (TextStyle): Style for the "Other Countries" header title.
 * - `searchContainerStyle` (ViewStyle): Style for the search bar container.
 *
 * @param {boolean} [showVerticalScrollIndicator] - Whether to show the vertical scroll indicator. Default is `false`.
 * @param {object} [rest] - Any additional props will be passed to the internal list component.
 */

interface Props {
  excludedCountries?: string[];
  showOnly?: string[];
  popularCountries?: string[];
  style?: DialerStyle;
  isVisible: boolean;
  disableBackdrop?: boolean;
  onBackdropPress?: (...args: any) => any;
  onDialCodeSelect: (item: DialerCode) => any;
  itemTemplate?:
    | ((props: DialerItemTemplateProps) => JSX.Element)
    | React.MemoExoticComponent<
        (props: DialerItemTemplateProps) => JSX.Element
      >;
  headerComponent?: (props: DialerListHeaderComponentProps) => JSX.Element;
  onClose?: (...args: any) => any;
  lang: keyof CountryName;
  searchPlaceholder?: string;
  searchPlaceholderTextColor?: TextStyle['color'];
  searchNotFoundMessage?: string;
  defaultDialCode?: string;
  otherCountriesHeaderTitle?: string;
  otherCountriesHeaderTitleStyle?: TextStyle;
  searchContainerStyle?: StyleProp<ViewStyle>;
  showVerticalScrollIndicator?: boolean;
}

export const DialerPicker = ({
  isVisible,
  popularCountries,
  onDialCodeSelect,
  searchPlaceholder,
  searchPlaceholderTextColor,
  searchNotFoundMessage,
  lang = 'en',
  style,
  onBackdropPress,
  disableBackdrop,
  excludedCountries,
  defaultDialCode,
  onClose,
  showOnly,
  headerComponent: HeaderComponent,
  itemTemplate: ItemTemplate = DialerButton,
  otherCountriesHeaderTitle,
  showVerticalScrollIndicator = false,
  ...rest
}: Props) => {
  const filteredCodes = useMemo(
    () => dialerRemover(excludedCountries),
    [excludedCountries]
  );
  const animationDriver = useRef(new Animated.Value(0)).current;
  const [searchValue, setSearchValue] = useState<string>(defaultDialCode || '');
  const [showModal, setShowModal] = useState<boolean>(false);

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
        duration: 200,
        useNativeDriver: false,
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
    if (isVisible && !showModal) {
      setShowModal(true);
    } else if (!isVisible && showModal) {
      closeModal();
    }
  }, [closeModal, isVisible, showModal]);

  const onStartShouldSetResponder = useCallback(() => {
    onBackdropPress?.();
    return false;
  }, [onBackdropPress]);

  const modalBackdropStyle = [
    { opacity: modalBackdropFade },
    styles.backdrop,
    style?.backdrop,
  ];

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

  const textInputStyle = useMemo(
    () => [styles.searchBar, style?.textInput],
    [style?.textInput]
  );

  const searchNotFoundMessageTextStyle = useMemo(
    () => [styles.searchMessage, style?.searchNotFoundMessageText],
    [style?.searchNotFoundMessageText]
  );

  const searchNotFoundContainerStyle = useMemo(
    () => [styles.dialerMessage, style?.searchNotFoundContainer],
    [style?.searchNotFoundContainer]
  );

  const lineStyle = useMemo(() => [styles.line, style?.line], [style?.line]);

  const searchContainerStyles = useMemo(
    () => [styles.searchContainer, style?.searchContainerStyle],
    [style?.searchContainerStyle]
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showModal}
      onShow={openModal}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {!disableBackdrop && (
          <Animated.View
            onStartShouldSetResponder={onStartShouldSetResponder}
            style={modalBackdropStyle}
          />
        )}
        <Animated.View style={modalStyle}>
          {showModal && (
            <>
              <View style={searchContainerStyles}>
                <TextInput
                  style={textInputStyle}
                  value={searchValue}
                  onChangeText={setSearchValue}
                  placeholder={searchPlaceholder || 'Search for a dial code'}
                  placeholderTextColor={searchPlaceholderTextColor || '#8c8c8c'}
                  testID="dialerCodesPickerSearchInput"
                  {...rest}
                />
              </View>
              <View style={lineStyle} />
              {resultCountries.length === 0 ? (
                <View style={searchNotFoundContainerStyle}>
                  <Text style={searchNotFoundMessageTextStyle}>
                    {searchNotFoundMessage ||
                      "We couldn't find any matching dialer codes."}
                  </Text>
                </View>
              ) : (
                <DialerList
                  excludedCountries={excludedCountries}
                  popularCountries={popularCountries}
                  showOnly={showOnly}
                  onDialCodeSelect={onDialCodeSelect}
                  style={style}
                  otherCountriesHeaderTitleStyle={
                    style?.otherCountriesHeaderTitleStyle
                  }
                  searchContainerStyle={style?.searchContainerStyle}
                  itemTemplate={ItemTemplate}
                  headerComponent={HeaderComponent}
                  lang={lang}
                  otherCountriesHeaderTitle={otherCountriesHeaderTitle}
                  showVerticalScrollIndicator={showVerticalScrollIndicator}
                  searchValue={searchValue}
                />
              )}
            </>
          )}
        </Animated.View>
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
