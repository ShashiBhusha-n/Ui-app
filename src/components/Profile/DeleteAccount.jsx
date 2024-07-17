import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import BackButtonHandler from '../BackButtonHandler/BackButtonHandler';
import {Colors} from '../../utils/Colors';
import {UserType} from '../../UserContext';
import axios from 'axios';
import {handleRequest} from '../../utils/RequestUser';
import Service_URL from '../../utils/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeleteAccount = () => {
  const route = useRoute();
  const [email, setEmail] = useState(route.params.email);
  const {userId} = useContext(UserType);
  const navigation = useNavigation();

  const deleteAccount = async () => {
    try {
      const response = await axios.get(
        `${Service_URL}/user/deleteAccount/${userId}`,
      );
      if (response.status === 200) {
        Alert.alert('Account deleted successfully');
        await AsyncStorage.clear();
        navigation.navigate('LogIn');
      }
    } catch (error) {
      console.log('Failed to delete account', error);
    }
  };
  return (
    <BackButtonHandler>
      <View
        style={{
          padding: 10,
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 16, color: Colors.black7}}>
            Delete Account
          </Text>
          {/* <Text>
            Are you sure you want to delete your account with email: {email}?
          </Text> */}
        </View>
        <View
          style={{
            width: '100%',
            marginTop: 20,
            marginBottom: 30,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 15,
          }}>
          <View style={{width: '100%', flexDirection: 'row', gap: 10}}>
            <Text
              style={{fontSize: 16, color: Colors.black7, fontWeight: '500'}}>
              Email:
            </Text>

            <Text style={{color: Colors.green, fontSize: 17}}>{email}</Text>
          </View>
          <TouchableOpacity
            onPress={deleteAccount}
            style={{
              borderWidth: 0.8,
              borderRadius: 15,
              backgroundColor: 'red',
            }}>
            <Text
              style={{
                paddingHorizontal: 20,
                paddingVertical: 8,
                color: '#fff',
                fontWeight: '500',
              }}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View>
          <TouchableOpacity>
            <Text>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>No</Text>
          </TouchableOpacity>
        </View> */}

        {/* <Text>This action cannot be undone.</Text>

        <Text>Please contact support for further assistance.</Text> */}

        <Text style={{fontSize: 15, color: Colors.black7}}>
          If you have any questions or concerns, please contact support at{' '}
          <Text
            style={{fontWeight: 'bold'}}
            onPress={() => Linking.openURL('mailto:support@astrogini.com')}>
            support@astrogini.com
          </Text>
        </Text>

        <Text style={{fontSize: 15, color: Colors.black7}}>
          Your account will be permanently deleted.
        </Text>

        <Text style={{fontSize: 15, color: Colors.black7}}>
          You will lose access to your account and any associated data.
        </Text>

        <Text></Text>
      </View>
    </BackButtonHandler>
  );
};

export default DeleteAccount;

const styles = StyleSheet.create({});
