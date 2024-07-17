import {StyleSheet, Text, View, SafeAreaView, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import Service_URL from '../../utils/Constant';
import axios from 'axios';
import {Button} from 'react-native-paper';
import {Colors} from '../../utils/Colors';
const {width} = Dimensions.get('screen');
const UsersAstrologyDetails = () => {
  const route = useRoute();
  const id = route.params.recipientId;
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Service_URL}/userInfo/${id}`);
        const data = response.data;

        if (!data) {
          setError('User not found');
        } else {
          setUserData(data);
          setError(null);
        }
      } catch (error) {
        setError('Error fetching user information');
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 15,
            fontSize: 16,
            color: Colors.grey2,
            textDecorationLine:"underline"
          }}>
          User Details
        </Text>
        <View
          style={{
            borderWidth: 1,
            paddingHorizontal: 30,
            paddingVertical: 10,
            marginTop: 10,
            alignContent: 'center',
            alignItems: 'center',
          }}>
          {userData.userDetail ? (
            <View>
              <View style={[styles.textContainer, {gap: 68}]}>
                <Text
                  style={{color: Colors.grey3, fontSize: 15, fontWeight: 500}}>
                  Name:
                </Text>
                <Text style={styles.text}>{userData.userDetail.name}</Text>
              </View>

              <View style={[styles.textContainer, {gap: 18}]}>
                <Text
                  style={{color: Colors.grey3, fontSize: 15, fontWeight: 500}}>
                  Place of Birth:
                </Text>
                <Text style={styles.text}>
                  {userData.userDetail.placeOfBirth}
                </Text>
              </View>

              <View style={[styles.textContainer, {gap: 18}]}>
                <Text
                  style={{color: Colors.grey3, fontSize: 15, fontWeight: 500}}>
                  Time Of Birth:
                </Text>
                <Text style={styles.text}>
                  {userData.userDetail.timeOfBirth}
                </Text>
              </View>

              <View style={[styles.textContainer, {gap: 24}]}>
                <Text
                  style={{color: Colors.grey3, fontSize: 15, fontWeight: 500}}>
                  Date of birth:
                </Text>
                <Text style={styles.text}>{userData.userDetail.dob}</Text>
              </View>
            </View>
          ) : (
            <Text>Loading user data...</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UsersAstrologyDetails;

const styles = StyleSheet.create({
  container: {
    width: width - 7,
    alignSelf: 'center',
    marginTop: 10,
    alignContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textDecorationLine: 'underline',
    textDecorationColor: '#000',
  },

  button: {
    backgroundColor: '#4d4dff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4d4dff',
  },
  text: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 5,
    color: '#000',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontSize: 16,
  },
});
