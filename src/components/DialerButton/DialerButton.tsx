import { Text, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import { DialerItemTemplateProps } from '../../types';

export const DialerButton = ({
  item,
  name,
  style,
  ...rest
}: DialerItemTemplateProps) => (
  <TouchableOpacity
    style={[styles.dialerButton, style?.dialerButtonStyles]}
    testID="dialerCodesPickerDialerButton"
    {...rest}
  >
    <Text style={[styles.flag, style?.flag]}>{item?.flag}</Text>
    <Text style={[styles.dialCode, style?.dialCode]}>{item?.dial_code}</Text>
    <Text style={[styles.dialerName, style?.dialerName]}>{name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  dialerButton: {
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    width: '100%',
    minHeight: 50,
    maxHeight: 62,
    paddingHorizontal: 25,
    alignItems: 'center',
    marginVertical: 2,
    flexDirection: 'row',
    borderRadius: 10,
  },
  flag: {
    flex: 0.2,
  } as TextStyle,
  dialCode: {
    flex: 0.3,
  } as TextStyle,
  dialerName: {
    flex: 1,
  } as TextStyle,
});
