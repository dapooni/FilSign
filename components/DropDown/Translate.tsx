import React from 'react';
import { StyleSheet } from 'react-native';
import { SelectCountry } from 'react-native-element-dropdown';

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
    <SelectCountry
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
      imageField="image"
      placeholder="SELECT"
      onChange={(item) => {
        onSelect(item.value);
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
  },
  itemTextStyle: {
    fontSize: 14,
    color: 'white',
  },
  dropdownContainer: {
    backgroundColor: 'rgba(8, 48, 129, 0.7)',
    borderRadius: 10,
  },
});
