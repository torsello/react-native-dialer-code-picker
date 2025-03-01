# react-native-dialer-code-picker ⚡⚡⚡

This library offers a multi-language country dialer code picker with advanced search functionality, delivering a smooth and high-performance user experience. Designed to be fully cross-platform, it supports React Native and Expo out of the box.

🚀 **Built for Performance:** Enhanced with optimized rendering and efficient animations for seamless navigation using FlashList.  
🐞 **Issue-Free Experience:** Developed with careful attention to detail, addressing common issues found in similar libraries.  
🔄 **Flexible & Customizable:** Easily adaptable to your design needs with custom templates and styling options.

> **Inspired by the popular `react-native-country-codes-picker`, but enhanced with better performance and stability.** If you're looking for a modern alternative with optimized rendering and customization capabilities, this is the picker for you.

**Looking for a specific country or locale? Feel free to contribute with a PR. ⚡⚡⚡**

---

## 🚀 Installation

You can install it using **npm** or **yarn**:

```sh
# Using npm
npm install react-native-dialer-code-picker @shopify/flash-list

# Using yarn
yarn add react-native-dialer-code-picker @shopify/flash-list
```

> **Note:** This library uses `FlashList` from `@shopify/flash-list` for improved performance, so make sure to install it as a dependency.

---

## ⚙️ Basic Usage

### Using `DialerPicker` (Built-in Modal)

The `DialerPicker` component includes a built-in modal, so you can directly use it without handling modal logic manually.

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

## 💡 Advanced Usage

### Using `DialerList` (Custom Modal or Bottom Sheet)

If you want to use your own modal (e.g., `BottomSheetModal`), you can import `DialerList` and handle the modal separately.

```tsx
import React, { useState, useCallback } from 'react';
import { View, Button } from 'react-native';
import { DialerList } from 'react-native-dialer-code-picker';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

const BottomSheetDialer = () => {
  const [bottomSheetRef, setBottomSheetRef] = useState(null);

  const openSheet = useCallback(() => {
    bottomSheetRef?.present();
  }, [bottomSheetRef]);

  return (
    <BottomSheetModalProvider>
      <View>
        <Button title="Open Dialer" onPress={openSheet} />
        <BottomSheetModal
          ref={setBottomSheetRef}
          index={0}
          snapPoints={['50%']}
        >
          <DialerList
            onDialCodeSelect={(item) => {
              console.log(item.dial_code);
              bottomSheetRef?.dismiss();
            }}
            lang="en"
          />
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};
```

### Comparison: `DialerPicker` vs. `DialerList`

| Feature                | `DialerPicker` (Built-in Modal) | `DialerList` (Standalone) |
| ---------------------- | ------------------------------- | ------------------------- |
| Includes a modal?      | ✅ Yes                          | ❌ No                     |
| Manages its own state? | ✅ Yes                          | ❌ No                     |
| Custom modal support?  | ❌ No, uses default modal       | ✅ Yes                    |
| Ideal for...?          | Quick implementation            | Full customization        |

---

## 📚 Props and API Details

### DialerPicker Props

| Prop                | Type                                                     | Description                                   | Required | Default       |
| ------------------- | -------------------------------------------------------- | --------------------------------------------- | -------- | ------------- |
| `isVisible`         | `boolean`                                                | Controls the visibility of the modal.         | ✅       | `false`       |
| `onDialCodeSelect`  | `(item: DialerCode) => void`                             | Callback when a dialer code is selected.      | ✅       | `-`           |
| `onClose`           | `() => void`                                             | Callback when the modal is closed.            | ❌       | `-`           |
| `searchPlaceholder` | `string`                                                 | Placeholder text for the search input.        | ❌       | `"Search..."` |
| `lang`              | `string`                                                 | Selected language for country names.          | ❌       | `"en"`        |
| `popularCountries`  | `string[]`                                               | List of popular countries to show at the top. | ❌       | `[]`          |
| `headerComponent`   | `(props: DialerListHeaderComponentProps) => JSX.Element` | Custom component for the list header.         | ❌       | `-`           |
| `style`             | `DialerStyle`                                            | Style object to customize the picker.         | ❌       | `-`           |

### DialerList Props

| Prop                | Type                                                     | Description                                         | Required | Default |
| ------------------- | -------------------------------------------------------- | --------------------------------------------------- | -------- | ------- |
| `excludedCountries` | `string[]`                                               | List of country codes to exclude.                   | ❌       | `[]`    |
| `showOnly`          | `string[]`                                               | List of country codes to exclusively show.          | ❌       | `[]`    |
| `popularCountries`  | `string[]`                                               | List of popular country codes displayed at the top. | ❌       | `[]`    |
| `onDialCodeSelect`  | `(item: DialerCode) => void`                             | Callback triggered when a dial code is selected.    | ✅       | `-`     |
| `lang`              | `string`                                                 | Language code for country names.                    | ✅       | `"en"`  |
| `headerComponent`   | `(props: DialerListHeaderComponentProps) => JSX.Element` | Custom component for the list header.               | ❌       | `-`     |

---

## 📝 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for more details.

---

## 🤝 Contributions

Contributions are welcome!  
If you find a bug or want to add a new feature, please open an **Issue** or a **Pull Request**.
