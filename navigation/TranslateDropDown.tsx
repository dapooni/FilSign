import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SelectCountry } from 'react-native-element-dropdown';

const local_data = [
  {
    value: '1',
    lable: 'FSL GESTURE',
  },
  {
    value: '2',
    lable: 'TEXT/SPEECH',
  }
];

const SelectCountryScreen = () => {
  const [country, setCountry] = useState<string>();

  return (
    <SelectCountry
      style={styles.dropdown}
      selectedTextStyle={styles.selectedTextStyle}
      placeholderStyle={styles.placeholderStyle}
      maxHeight={200}
      value={country}
      data={local_data}
      valueField="value"
      labelField="lable"
      placeholder="SELECT TRANSLATE"
      imageField="image"
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
    height: 20,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'white',
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 8,
    color: 'Black',
  },
  labelFieldStyle: {
    fontSize: 16,
    color: 'white',
  },
});
