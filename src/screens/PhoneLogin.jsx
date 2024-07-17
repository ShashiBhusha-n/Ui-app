import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  BackHandler,
  Image,
  Linking,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {Colors} from '../utils/Colors';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import BackButtonHandler from '../components/BackButtonHandler/BackButtonHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Service_URL from '../utils/Constant';
import {UserType} from '../UserContext';
const {height, width} = Dimensions.get('screen');

const PhoneLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const {userId, setUserId, addToWallet, setWalletBalance} =
    useContext(UserType);
  const navigation = useNavigation();
  const handleLogin = async () => {
    try {
      if (!phoneNumber) return Alert.alert('Please enter a phone number');
      if (phoneNumber.length != 10)
        return Alert.alert('Please enter valid phone number');
      const digitOnlyPattern = /^\d{10}$/;

      if (!digitOnlyPattern.test(phoneNumber)) {
        return Alert.alert(
          'Please enter a valid 10-digit phone number containing only numbers',
        );
      }

      const response = await axios.get(
        `${Service_URL}/otp/otp-login/${phoneNumber}`,
      );

      // console.log(response.data.response.responseCode);
      if (response.status === 200) {
        navigation.navigate('OtpScreen', response.data);
      }

      // navigation.navigate('OtpScreen', {phoneNumber: phoneNumber});
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('role');

      navigation.navigate('Parent');
    } catch (error) {
      console.log('Skip error', error);
    }
  };

  useEffect(() => {
    const checkLogInStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const storedUserId = await AsyncStorage.getItem('userId');
          const role = await AsyncStorage.getItem('role');
          if (storedUserId) {
            // Set the userId from AsyncStorage
            // const name = 'user_' + storedUserId;
            const userName = 'Anonymous';
            // onUserLogin(storedUserId, userName);
            setUserId(storedUserId);
            if (role === 'user') {
              navigation.navigate('Parent');
            } else if (role === 'verified') {
              navigation.navigate('AstrologerHome');
            } else {
              // Handle other roles if needed
              // Alert.alert(JSON.stringify(error));
            }
          }
        } else {
          // Token not found, show the login screen
        }
      } catch (error) {
        console.log('Error', error);
      }
    };
    checkLogInStatus();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const checkAuthentication = async () => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const role = await AsyncStorage.getItem('role');
          if (role === 'user') {
            navigation.navigate('Parent');
          } else if (role === 'verified') {
            navigation.navigate('AstrologerHome');
          }

          //Handle the Android back button press to exit the app
          if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => {
              BackHandler.exitApp(); // Exit the app when the back button is pressed
              return true; // Prevent default behavior (i.e., navigating back)
            });
          }
        }
      };
      checkAuthentication();
    }, []),
  );

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://www.astrogini.org/home/privacy-policy/');
  };

  const handleTermsOfUse = () => {
    Linking.openURL('https://www.astrogini.org/home/terms-of-use/');
  };

  return (
    <BackButtonHandler>
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            height: height / 2,
          }}>
          <TouchableOpacity
            onPress={handleSkip}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              padding: 20,
            }}>
            <Text style={{color: '#ffa000', fontSize: 16, fontWeight: '600'}}>
              Skip &gt;&gt;
            </Text>
          </TouchableOpacity>

          <View style={{alignItems: 'center', marginTop: 10}}>
            <Image
              source={require('../assets/icons/Logo/main5.png')}
              style={{
                height: 285,
                width: 300,
              }}
            />
          </View>
        </View>

        <View
          style={{
            width: '100%',
            backgroundColor: Colors.title2,
            height: '50%',
          }}>
          <View
            style={{
              height: 40,
              marginTop: -20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '70%',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                borderWidth: 1,
                paddingVertical: 4,
                paddingHorizontal: 25,
                borderRadius: 20,
                borderColor: Colors.yellow2,
                color: Colors.black8,
                position: 'absolute',
                marginBottom: 30,
                marginTop: -15,
                alignSelf: 'center',
                backgroundColor: '#fff',
                fontWeight: '500',
              }}>
              First Chat With Astrologer Is{' '}
              <Text style={{color: Colors.yellow2, fontWeight: '700'}}>
                FREE !
              </Text>
            </Text>
          </View>
          <TextInput
            onChangeText={text => {
              setPhoneNumber(text);
            }}
            placeholder="Enter Mobile number"
            placeholderTextColor={'#000'}
            keyboardType={'number-pad'}
            maxLength={10}
            style={{
              backgroundColor: '#ffffff',
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderRadius: 30,
              width: 300,
              marginTop: 5,
              color: '#000',
              borderColor: Colors.primaryYellow,
              borderWidth: 1,
              marginBottom: 5,
              alignSelf: 'center',
              marginTop: 40,
              textAlign: 'center',
            }}
          />
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: Colors.title1,
              width: '80%',
              height: 40,
              marginTop: 20,
              alignSelf: 'center',
              paddingLeft: 10,
              borderWidth: 0.7,
              borderRadius: 20,
              borderColor: Colors.grey4,
              justifyContent: 'center',
              alignItems: 'center',
              color: Colors.black7,
            }}>
            <Text style={{fontSize: 16, color: '#000', fontWeight: '500'}}>
              Get OTP
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{alignSelf: 'center', marginTop: 30}}
            onPress={() => navigation.navigate('LogIn')}>
            <Text
              style={{fontSize: 15, color: Colors.grey2, fontWeight: '500'}}>
              Login with Email
            </Text>
          </TouchableOpacity>

          <View style={{alignSelf: 'center', marginTop: 30}}>
            <Text
              style={{
                textAlign: 'center',
                paddingHorizontal: 20,
                color: Colors.grey2,
              }}>
              By Signing up, you agree to our
              <Text
                style={{color: Colors.yellow2, fontWeight: '600'}}
                onPress={handleTermsOfUse}>
                {' '}
                Terms of Use
              </Text>{' '}
              and
              <Text
                style={{color: Colors.yellow2, fontWeight: '600'}}
                onPress={handlePrivacyPolicy}>
                {' '}
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </BackButtonHandler>
  );
};

export default PhoneLogin;

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    flexDirection: 'row',
    borderTopWidth: '0.7px',
  },
});
