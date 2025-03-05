import React from 'react';
import { Keyboard, StyleProp, Text, View, ViewStyle } from 'react-native';
import { type CountryName, type DialerCode } from '../../constants/dialerCodes';
import { useCallback, useMemo } from 'react';
import { dialerRemover } from '../../helpers/dialerRemover';
import type {
  DialerItemTemplateProps,
  DialerListHeaderComponentProps,
  DialerStyle,
} from '../../types';
import DialerButton from '../DialerButton';
import { getCountryName } from '../../helpers/getCountryName';
import { FlashList } from '@shopify/flash-list';
import { removeDiacritics } from '../../helpers/diacriticsRemover';

/**
 * DialerList Component
 *
 * A high-performance list component for displaying country dialing codes with search, filtering, and customization options.
 * Uses `FlashList` from '@shopify/flash-list' for optimized rendering of large datasets.
 *
 * @param {string[]} [excludedCountries] - Array of country codes to be excluded from the list.
 * @param {string[]} [showOnly] - Array of country codes to be exclusively shown.
 * @param {string[]} [popularCountries] - Array of popular country codes to be displayed at the top.
 * @param {keyof CountryName} lang - Language code for displaying country names (e.g., 'en', 'es'). Default is `'en'`.
 * @param {string} [otherCountriesHeaderTitle] - Custom title for the section listing other countries. Default is `'Other Countries'`.
 * @param {boolean} [showVerticalScrollIndicator] - Whether to show the vertical scroll indicator. Default is `false`.
 * @param {string} [searchValue] - Text input for filtering countries by name or dial code.
 * @param {Function} onDialCodeSelect - Callback function triggered when a dial code is selected. Receives the selected item as an argument.
 * @example
 * onDialCodeSelect={(item) => console.log(item)}
 *
 * @param {(props: DialerItemTemplateProps) => JSX.Element | React.MemoExoticComponent<(props: DialerItemTemplateProps) => JSX.Element>} [itemTemplate]
 * Custom component for rendering each item in the list.
 * @example
 * itemTemplate={(props) => <CustomItemComponent {...props} />}
 *
 * @param {(props: DialerListHeaderComponentProps) => JSX.Element} [headerComponent]
 * Custom component for rendering the list header, usually for popular countries.
 * @example
 * headerComponent={(props) => <CustomHeader {...props} />}
 *
 * @param {DialerStyle} [style] - Customizable styles for the component.
 * The `DialerStyle` object allows partial overrides of specific elements:
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
 * @param {StyleProp<ViewStyle>} [searchContainerStyle] - Custom styles for the search container.
 * @param {object} [rest] - Any additional props passed to the internal `FlashList` component.
 */

interface DialerListProps {
  excludedCountries?: string[];
  popularCountries?: string[];
  showOnly?: string[];
  onDialCodeSelect: (item: DialerCode) => any;
  style?: DialerStyle;
  searchContainerStyle?: StyleProp<ViewStyle>;
  itemTemplate?:
    | ((props: DialerItemTemplateProps) => JSX.Element)
    | React.MemoExoticComponent<
        (props: DialerItemTemplateProps) => JSX.Element
      >;
  headerComponent?: (props: DialerListHeaderComponentProps) => JSX.Element;
  lang: keyof CountryName;
  otherCountriesHeaderTitle?: string;
  showVerticalScrollIndicator?: boolean;
  searchValue?: string;
}

export const DialerList = ({
  excludedCountries,
  popularCountries,
  showOnly,
  onDialCodeSelect,
  lang = 'en',
  style,
  otherCountriesHeaderTitle,
  showVerticalScrollIndicator = false,
  searchValue,
  headerComponent: HeaderComponent,
  itemTemplate: ItemTemplate = DialerButton,
  ...rest
}: DialerListProps) => {
  const filteredCodes = useMemo(
    () => dialerRemover(excludedCountries),
    [excludedCountries]
  );

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

  const filteredResults = useMemo(() => {
    if (!searchValue) return codes;

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

  const onPressHeaderItem = useCallback(
    (item: DialerCode) => {
      Keyboard.dismiss();
      onDialCodeSelect?.(item);
    },
    [onDialCodeSelect]
  );

  const renderHeaderComponent = useMemo(() => {
    if (popularCountries && HeaderComponent) {
      return (
        <View>
          <HeaderComponent
            countries={preparedPopularCountries}
            lang={lang}
            onPress={onPressHeaderItem}
          />
          <Text style={style?.otherCountriesHeaderTitleStyle}>
            {otherCountriesHeaderTitle || 'Other Countries'}
          </Text>
        </View>
      );
    }
    return null;
  }, [
    popularCountries,
    HeaderComponent,
    preparedPopularCountries,
    lang,
    onPressHeaderItem,
    style?.otherCountriesHeaderTitleStyle,
    otherCountriesHeaderTitle,
  ]);

  const keyExtractor = useCallback(
    (item: any) => String(item.code || item.dial_code),
    []
  );

  const renderItemOnPress = useCallback(
    (item: DialerCode) => {
      Keyboard.dismiss();
      onDialCodeSelect?.(item);
    },
    [onDialCodeSelect]
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
    [ItemTemplate, lang, renderItemOnPress, style]
  );

  return (
    <FlashList
      showsVerticalScrollIndicator={showVerticalScrollIndicator}
      data={filteredResults}
      keyExtractor={keyExtractor}
      contentContainerStyle={style?.itemsList}
      estimatedItemSize={54}
      keyboardShouldPersistTaps="handled"
      renderItem={renderItem}
      testID="dialerCodesPickerFlashList"
      ListHeaderComponent={renderHeaderComponent}
      extraData={searchValue}
      removeClippedSubviews={true}
      {...rest}
    />
  );
};
