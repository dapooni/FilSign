import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

type TranslateDropdownProps = {
  selectedValue: string;
  onSelect: (value: string) => void;
};

const local_data = [
  { value: '1', label: 'FSL GESTURE' },
  { value: '2', label: 'TEXT/SPEECH' },
];

const Translate: React.FC<TranslateDropdownProps> = ({
  selectedValue,
  onSelect,
}) => {
  return (
    <Dropdown
      style={styles.dropdown}
      selectedTextStyle={styles.selectedTextStyle}
      placeholderStyle={styles.placeholderStyle}
      itemTextStyle={styles.itemTextStyle}
      containerStyle={styles.dropdownContainer}
      maxHeight={200}
      value={selectedValue}
      data={local_data}
      valueField="value"
      labelField="label"
      placeholder="SELECT"
      activeColor="transparent"
      onChange={(item) => {
        onSelect(item.value);
      }}
      renderItem={(item) => {
        const isSelected = item.value === selectedValue;
        return (
          <View style={styles.item}>
            <Text
              style={[
                styles.itemTextStyle,
                isSelected && styles.underlinedText,
              ]}
            >
              {item.label}
            </Text>
          </View>
        );
      }}
    />
  );
};

export default Translate;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 20,
  },
  placeholderStyle: {
    fontSize: 14,
    color: 'white',
    backgroundColor: 'transparent',
  },
  selectedTextStyle: {
    fontSize: 14,
    marginLeft: 8,
    color: 'white',
    fontFamily: 'Akatab-SemiBold',
  },
  itemTextStyle: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Akatab-SemiBold',
  },
  dropdownContainer: {
    backgroundColor: 'rgba(8, 48, 129, 0.7)',
    borderRadius: 10,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  underlinedText: {
    textDecorationLine: 'underline',
  },
});
