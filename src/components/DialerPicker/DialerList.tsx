import { FlatList, Keyboard, Platform, StyleSheet } from 'react-native';
import { type CountryName, type DialerCode } from '../../constants/dialerCodes';
import { removeDiacritics } from '../../helpers/diacriticsRemover';
import { useCallback, useMemo } from 'react';
import { dialerRemover } from '../../helpers/dialerRemover';
import type {
  DialerItemTemplateProps,
  DialerListHeaderComponentProps,
  DialerStyle,
} from '../../types';
import { DialerButton } from '../DialerButton';
import { getCountryName } from '../../helpers/getCountryName';

interface DialerListProps {
  lang: keyof CountryName;
  searchValue?: string;
  excludedCountries?: string[];
  popularCountries?: string[];
  showOnly?: string[];
  ListHeaderComponent?: (props: DialerListHeaderComponentProps) => JSX.Element;
  itemTemplate?: (props: DialerItemTemplateProps) => JSX.Element;
  pickerButtonOnPress: (item: DialerCode) => any;
  style?: DialerStyle;
}

export const DialerList = ({
  showOnly,
  popularCountries,
  lang = 'en',
  searchValue = '',
  excludedCountries,
  style,
  pickerButtonOnPress,
  ListHeaderComponent,
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
    if (showOnly?.length) {
      const showOnlySet = new Set(showOnly.map((short) => short.toUpperCase()));
      return filteredCodes?.filter((dialer) => showOnlySet.has(dialer?.code));
    }
    return filteredCodes;
  }, [showOnly, filteredCodes]);

  const resultCountries = useMemo(() => {
    const lowerSearchValue = searchValue.toLowerCase().trim();

    return codes
      .filter((dialer) => {
        const countryName = getCountryName(dialer?.name, lang).toLowerCase();
        return (
          dialer?.dial_code.includes(searchValue) ||
          countryName.includes(lowerSearchValue) ||
          removeDiacritics(countryName).includes(lowerSearchValue)
        );
      })
      .filter(Boolean);
  }, [searchValue, lang, codes]);

  const handleOnPressItem = useCallback(
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
          item={item}
          style={style}
          name={itemName}
          onPress={() => handleOnPressItem(item)}
        />
      );
    },
    [lang, ItemTemplate, style, handleOnPressItem]
  );

  const onPressHandler = useCallback(
    (item: DialerCode) => {
      Keyboard.dismiss();
      pickerButtonOnPress?.(item);
    },
    [pickerButtonOnPress]
  );

  const renderHeaderComponent = () => {
    if (popularCountries && ListHeaderComponent) {
      return (
        <ListHeaderComponent
          countries={preparedPopularCountries}
          lang={lang}
          onPress={onPressHandler}
        />
      );
    }
    return null;
  };

  const flatListStyle = useMemo(
    () => [style?.itemsList].filter(Boolean),
    [style]
  );

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={resultCountries || codes}
      keyExtractor={(item) => item?.dial_code}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      style={flatListStyle}
      keyboardShouldPersistTaps="handled"
      renderItem={renderItem}
      ListHeaderComponent={renderHeaderComponent()}
      {...rest}
    />
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
});
