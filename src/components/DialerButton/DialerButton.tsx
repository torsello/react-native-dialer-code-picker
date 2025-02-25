import { Text, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import { DialerItemTemplateProps } from '../../types';
import { useMemo } from 'react';

export const DialerButton = ({
  item,
  name,
  style,
  ...rest
}: DialerItemTemplateProps) => {
  const dialerButtonStyles = useMemo(
    () => [styles.dialerButton, style?.dialerButtonStyles],
    [style?.dialerButtonStyles]
  );

  const flagStyles = useMemo(() => [styles.flag, style?.flag], [style?.flag]);

  const dialCodeStyles = useMemo(
    () => [styles.dialCode, style?.dialCode],
    [style?.dialCode]
  );

  const dialerNameStyles = useMemo(
    () => [styles.dialerName, style?.dialerName],
    [style?.dialerName]
  );

  return (
    <TouchableOpacity
      style={dialerButtonStyles}
      testID="dialerCodesPickerDialerButton"
      {...rest}
    >
      <Text style={flagStyles}>{item?.flag}</Text>
      <Text style={dialCodeStyles}>{item?.dial_code}</Text>
      <Text style={dialerNameStyles}>{name}</Text>
    </TouchableOpacity>
  );
};

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
