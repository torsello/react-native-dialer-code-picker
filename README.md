
# 📞 react-native-dialer-code-picker

A performant and customizable dialer code picker for React Native apps.  
Easily integrate country dialer codes into your React Native application with a flexible and easy-to-use component.

---

## 🚀 Installation

You can install it using **npm** or **yarn**:

```sh
# Using npm
npm install react-native-dialer-code-picker

# Using yarn
yarn add react-native-dialer-code-picker
```

---

## ⚙️ Basic Usage

```tsx
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { DialerPicker } from 'react-native-dialer-code-picker';

const App = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDialer, setSelectedDialer] = useState('');

  const handleDialerSelect = (item) => {
    setSelectedDialer(item.dial_code);
    setIsVisible(false);
  };

  return (
    <View>
      <Button title="Select Dialer Code" onPress={() => setIsVisible(true)} />
      <Text>Selected Dialer Code: {selectedDialer}</Text>
      <DialerPicker
        isVisible={isVisible}
        onDialCodeSelect={handleDialerSelect}
        onClose={() => setIsVisible(false)}
        searchPlaceholder="Search by country or code"
        lang="en"
      />
    </View>
  );
};

export default App;
```

---

## 💡 Advanced Examples

### With `headerComponent`

```tsx
<DialerPicker
  lang="en"
  isVisible={isVisible}
  onDialCodeSelect={handleDialerSelect}
  onClose={() => setIsVisible(false)}
  headerComponent={({ countries, lang, onPress }) => (
    <View>
      <Text>Popular Countries:</Text>
      {countries.map((item) => (
        <Button
          key={item.code}
          title={item.name[lang]}
          onPress={() => onPress(item)}
        />
      ))}
    </View>
  )}
  popularCountries={['US', 'GB', 'CA']}
  otherCountriesHeaderTitle="Countries"
/>
```

### With Custom Item Template

```tsx
<DialerPicker
  lang="en"
  isVisible={isVisible}
  onDialCodeSelect={handleDialerSelect}
  onClose={() => setIsVisible(false)}
  itemTemplate={({ item, name, onPress }) => (
    <TouchableOpacity onPress={onPress} style={{ padding: 10 }}>
      <Text>{item.flag} {name} ({item.dial_code})</Text>
    </TouchableOpacity>
  )}
/>
```

---

## 📚 Props and API Details

| Prop                         | Type                                      | Description                                         | Required | Default         |
|-------------------------------|-------------------------------------------|-----------------------------------------------------|-----------|-----------------|
| `isVisible`                   | `boolean`                                 | Shows or hides the dialer picker.                    | ✅        | `false`         |
| `onDialCodeSelect`            | `(item: DialerCode) => void`               | Callback when a dialer code is selected.              | ✅        | `-`             |
| `onClose`                     | `() => void`                              | Callback when the modal is closed.                   | ❌        | `-`             |
| `searchPlaceholder`           | `string`                                  | Placeholder text for the search input.               | ❌        | `"Search..."`   |
| `lang`                        | `string` (`'en' | 'es' | 'fr' | 'de'`)     | Selected language for country names.                 | ❌        | `"en"`          |
| `excludedCountries`           | `string[]`                                | List of country codes to exclude from the picker.     | ❌        | `[]`            |
| `popularCountries`            | `string[]`                                | List of popular countries to show at the top.        | ❌        | `[]`            |
| `headerComponent`         | `(props: DialerListHeaderComponentProps) => JSX.Element` | Custom component for the list header.               | ❌        | `-`             |
| `itemTemplate`                | `(props: DialerItemTemplateProps) => JSX.Element` | Custom template to render each item.                | ❌        | `DialerButton`  |
| `style`                       | `DialerStyle`                             | Style object to customize the picker.                 | ❌        | `-`             |

---

## 🎨 Customizable Styles

You can customize the styles using the `style` prop by passing a `DialerStyle` object. Example:

```tsx
<DialerPicker
  lang="en"
  isVisible={isVisible}
  onDialCodeSelect={handleDialerSelect}
  onClose={() => setIsVisible(false)}
  style={{
    modal: { backgroundColor: '#fff' },
    dialerButtonStyles: { paddingVertical: 15 },
    dialerName: { color: '#007bff' },
  }}
/>
```

---

## 🔗 Inspiration

This component was inspired by [react-native-country-codes-picker](https://www.npmjs.com/package/react-native-country-codes-picker), which served as a base to develop a more updated version with enhanced performance and customization.

**There is no official affiliation with the developers of the original library.**  
This version includes additional functionalities and optimizations for a better React Native experience.

---

## 📝 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for more details.

---

## 🤝 Contributions

Contributions are welcome!  
If you find a bug or want to add a new feature, please open an **Issue** or a **Pull Request**.
