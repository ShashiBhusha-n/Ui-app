import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  BackHandler,
} from 'react-native';
import {Colors} from '../utils/Colors'; // Ensure you have this Colors file or replace with your actual color values
import {useFocusEffect, useRoute} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserType} from '../UserContext';

const {height} = Dimensions.get('screen');

const OtpScreen = ({navigation}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const refs = Array(6)
    .fill()
    .map(() => useRef(null));

  const route = useRoute();
  const data = route.params;

  const {userId, setUserId, addToWallet, setWalletBalance} =
    useContext(UserType);

  console.log('first phone number: ' + data.otp);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Focus next input if current one is filled
      if (text && index < 5) {
        refs[index + 1].current.focus();
      }

      // Combine OTP to a single string
      const otpString = newOtp.join('');
      if (otpString.length === 6) {
        console.log(`OTP Entered: ${otpString}`);
        // You can handle the OTP verification here

        if (otpString == data.otp) {
          AsyncStorage.setItem('authToken', data.token);
          AsyncStorage.setItem('role', data.role);
          AsyncStorage.setItem('userId', data.userId);

          Alert.alert('Otp verified');
          setUserId(data.userId);

          if (data.role === 'user') {
            navigation.navigate('Parent');
          } else if (data.role === 'verified') {
            navigation.navigate('AstrologerHome');
          } else if (data.role === 'disabled') {
            Alert.alert('Your account is disabled by Admin');
          } else if (data.role === 'pending') {
            Alert.alert(
              'You are not verified or disabled by the Admin',
              'Kindly contact to Admin',
            );
          }
        }
      }
    }
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Please enter a 6-digit OTP');
    } else {
      // Proceed with OTP verification logic
      console.log(`Verified OTP: ${otpString}`);
      // Example navigation after successful OTP verification
      // navigation.navigate('HomeScreen');
    }
  };

  // Handle the "Resend OTP" button press
  const handleResendOtp = () => {
    if (canResend) {
      console.log('Resending OTP...');
      setResendTimer(30); // Reset timer
      setCanResend(false);
      // Here you would trigger the OTP resend logic

      console.log('OTP Resend', phoneNumber);
    }
  };
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

  // useEffect(() => {
  //   const checkLogInStatus = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('authToken');
  //       if (token) {
  //         const storedUserId = await AsyncStorage.getItem('userId');
  //         const role = await AsyncStorage.getItem('role');
  //         if (storedUserId) {
  //           // Set the userId from AsyncStorage
  //           // const name = 'user_' + storedUserId;
  //           const userName = 'Anonymous';
  //           onUserLogin(storedUserId, userName);
  //           setUserId(storedUserId);
  //           if (role === 'user') {
  //             navigation.navigate('Parent');
  //           } else if (role === 'verified') {
  //             navigation.navigate('AstrologerHome');
  //           } else {
  //             // Handle other roles if needed
  //             // Alert.alert(JSON.stringify(error));
  //           }
  //         }
  //       } else {
  //         // Token not found, show the login screen
  //       }
  //     } catch (error) {
  //       console.log('Error', error);
  //     }
  //   };
  //   checkLogInStatus();
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Enter OTP</Text>
      </View>
      <View style={styles.otpContainer}>
        <Text style={styles.instructionText}>
          A 6-digit OTP has been sent to your phone number.
        </Text>
        <View style={styles.otpBoxesContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={refs[index]}
              value={digit}
              onChangeText={text => handleOtpChange(text, index)}
              placeholder="0"
              keyboardType="number-pad"
              maxLength={1}
              style={styles.otpBox}
              textAlign="center"
              returnKeyType="next"
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleVerifyOtp} style={styles.verifyButton}>
          <Text style={styles.verifyButtonText}>Verify OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleResendOtp}
          disabled={!canResend}
          style={[
            styles.resendButton,
            !canResend && styles.resendButtonDisabled,
          ]}>
          <Text style={styles.resendButtonText}>
            {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: height / 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryYellow,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  otpContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.grey3,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20, // Add padding for better spacing
  },
  otpBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  otpBox: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    width: 50,
    fontSize: 18,
    borderColor: Colors.grey4,
    paddingHorizontal: 10,
    textAlign: 'center', // Ensure text is centered
  },
  verifyButton: {
    backgroundColor: Colors.lightYellow,
    width: '80%',
    height: 40,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.7,
    borderRadius: 10,
    borderColor: Colors.grey4,
  },
  verifyButtonText: {
    fontSize: 16,
    color: '#000',
  },
  resendButtonText: {
    fontSize: 16,
    marginTop: 20,
    color: Colors.grey3,
  },
});
