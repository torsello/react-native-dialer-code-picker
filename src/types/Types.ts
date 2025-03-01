import { ViewStyle, TextStyle } from 'react-native';
import { DialerCode } from '../constants/dialerCodes';
import { ContentStyle } from '@shopify/flash-list';

/**
 * Props for the item template component in the Dialer.
 * @template T - Generic type for the item.
 */
export interface DialerItemTemplateProps<T = DialerCode> {
  /**
   * The item to be displayed.
   */
  item: T;

  /**
   * The name of the country or region.
   */
  name: string;

  /**
   * Custom styles for the item.
   */
  style?: DialerStyle;

  /**
   * Function to be called when the item is pressed.
   */
  onPress?: (arg: any) => void;
}

/**
 * Props for the list header component in the Dialer.
 */
export interface DialerListHeaderComponentProps {
  /**
   * Array of countries to be displayed.
   */
  countries: DialerCode[];

  /**
   * Selected language for the list.
   */
  lang: string;

  /**
   * Function to be called when a country is pressed.
   */
  onPress: (item: DialerCode) => void;
}

/**
 * Style object for customizing the Dialer UI components.
 */
export type DialerStyle = Partial<{
  backdrop: ViewStyle;
  modal: ViewStyle;
  line: ViewStyle;
  searchNotFoundMessageText: TextStyle;
  itemsList: ContentStyle;
  searchNotFoundContainer: ViewStyle;
  textInput: TextStyle;
  dialerButtonStyles: ViewStyle;
  flag: TextStyle;
  dialCode: TextStyle;
  dialerName: TextStyle;
  otherCountriesHeaderTitleStyle: TextStyle;
  searchContainerStyle: ViewStyle;
}>;
