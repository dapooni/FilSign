import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SelectCountry } from 'react-native-element-dropdown';

const local_data = [
  {
    value: '1',
    label: 'FSL GESTURE',
  },
  {
    value: '2',
    label: 'TEXT/SPEECH',
  }
];

const SelectCountryScreen = () => {
  const [country, setCountry] = useState<string>();

  return (
    <SelectCountry
      style={styles.dropdown}
      selectedTextStyle={styles.selectedTextStyle}
      placeholderStyle={styles.placeholderStyle}
      itemTextStyle={styles.itemTextStyle}  

      containerStyle={styles.dropdownContainer}
      maxHeight={200}
      value={country}
      data={local_data}
      valueField="value"
      labelField="label"
      imageField="image"
      placeholder="SELECT"
      onChange={(e) => {
        setCountry(e.value);
      }}
    />
  );
};

export default SelectCountryScreen;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 20
    
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent'
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 8,
    color: 'white',
    
  },
  itemTextStyle: {
    fontSize: 16,
    color: 'white', 
  },
  dropdownContainer: {
    backgroundColor: 'rgba(8, 48, 129, 0.7)', 
    borderRadius: 10
  },
});
