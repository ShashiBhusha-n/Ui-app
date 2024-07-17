import {View, Text, Image, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('PhoneLogin');
    }, 2000);
  });
  const imageUrl =
    'https://cf.ltkcdn.net/horoscopes/images/orig/235242-1600x1030-evolutionary-astrology-beginners.jpg';
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icons/Logo/main3.png')}
        style={styles.image}
      />
      <Image source={require('../assets/icons/Logo/main9.png')} />
      {/* <Text
        style={{
          fontSize: 35,
          fontWeight: '800',
          color: '#000000',
          marginTop: 10,
        }}>
        Astrogini
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',
    backgroundColor: '#FFFFB2', // Center horizontally
    gap: 20,
  },
  image: {
    width: 250,
    height: 250,
    aspectRatio: 'auto',
  },
});

export default Splash;
