import React from "react";
import { View, TextInput, Image, StyleSheet, TouchableOpacity } from "react-native";
import { icons } from "@/constants/icons"; // Update this path to your icons source

interface Props {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
}

const SearchBar = ({ placeholder, value, onChangeText, onSubmitEditing }: Props) => {
  return (
    <View style={styles.container}>
      <Image
        source={icons.search}
        style={styles.icon}
        resizeMode="contain"
        tintColor="#AB8BFF"
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#A8B5DB"
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
        clearButtonMode="while-editing"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#23233a",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginVertical: 10,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#AB8BFF",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#fff",
    fontSize: 16,
  },
});

export default SearchBar;
