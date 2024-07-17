import {
  Button,
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {UserType} from '../../UserContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import Service_URL from '../../utils/Constant';
import EvilIcons from 'react-native-vector-icons/Feather';
import {Colors} from '../../utils/Colors';
import BackButtonHandler from '../BackButtonHandler/BackButtonHandler';
import {getBalance} from '../../utils/UpdateWallet';

const UserProfile = () => {
  const {userId, setUserId} = useContext(UserType);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const [wallet, setWallet] = useState([]);
  const dobDate = new Date(userData?.dateOfBirth);

  const day = String(dobDate.getUTCDate()).padStart(2, '0');
  const month = String(dobDate.getUTCMonth() + 1).padStart(2, '0');
  const year = String(dobDate.getUTCFullYear());

  const formattedDOB = `${day}/${month}/${year}`;

  const navigation = useNavigation();
  const imageUrl = `${Service_URL}/${userData?.image}`;

  //getting user info based on userId

  useEffect(() => {
    if (!userId) {
      setError('User ID not provided');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${Service_URL}/userInfo/${userId}`);
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
    getBalance(userId)
      .then(response => {
        setWallet(response);
      })
      .catch(error => {
        console.log(error);
      });

    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const handlePress = () => {
    navigation.navigate('EditUserInfo', {userData});
  };

  if (!userId) {
    return (
      <View
        style={{
          padding: 20,
          marginTop: '50%',
          width: 'auto',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 17,
            color: '#858585',
            marginBottom: 10,
            fontWeight: '700',
          }}>
          Please Login...!!!
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('LogIn')}
          style={{
            paddingVertical: 15,
            backgroundColor: '#141414',
            alignItems: 'center',
            alignContent: 'center',
            borderRadius: 15,
            width: 150,
          }}>
          <Text style={{color: '#ffffff', fontSize: 15, fontWeight: '700'}}>
            Log In
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <BackButtonHandler>
      <ScrollView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 15,
            paddingTop: 12,
            paddingRight: 10,
          }}>
          <Icon
            name="square-edit-outline"
            size={24}
            color={Colors.pink1}
            onPress={handlePress}
          />
        </View>
        <View style={[styles.userInfoSection, {flexDirection: 'row', flex: 1}]}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              flex: 0.7,
            }}>
            <View
              style={{
                padding: 2,
                borderWidth: 1,
                borderRadius: 45,
                borderColor: Colors.yellow,
              }}>
              <Avatar.Image source={{uri: imageUrl}} size={80} style={{}} />
            </View>

            <View style={{marginLeft: 12}}>
              <Title style={[styles.title, {marginTop: 15, marginBottom: 5}]}>
                {userData?.name}
              </Title>
              <Caption style={styles.caption}>{userData?.bio}</Caption>
            </View>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Icon name="email-outline" color={Colors.black6} size={23} />
            <Text
              style={{color: Colors.pink2, marginLeft: 20, fontWeight: 600}}>
              {userData?.email}
            </Text>
          </View>
          <View style={styles.row}>
            <Fontisto name="date" color={Colors.black6} size={20} />
            <Text style={{color: Colors.black1, marginLeft: 20}}>
              {formattedDOB}
            </Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="call-outline" size={20} color={Colors.black6} />
            <Text style={{color: Colors.black1, marginLeft: 20}}>
              {userData?.phoneNumber}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon name="map-marker-outline" size={20} color={Colors.black6} />
            <Text style={{color: Colors.black1, marginLeft: 20}}>
              {userData?.city}
            </Text>
          </View>
          <View style={styles.row}>
            <FontAwesome name="globe" size={20} color="#000000" />
            <Text style={{color: Colors.black1, marginLeft: 20}}>
              {userData?.country}
            </Text>
          </View>
        </View>

        <View style={styles.infoBoxWrapper}>
          <View
            style={[
              styles.infoBox,
              {
                borderRightColor: '#dddddd',
                borderRightWidth: 1,
              },
            ]}>
            <Title style={{color: Colors.pink1, fontWeight: 500}}>
              ₹ {wallet?.balance}
            </Title>
            <Caption style={{color: Colors.black1, fontSize: 15}}>
              Wallet Balance
            </Caption>
          </View>
          <View style={styles.infoBox}>
            <Button
              title="Add Amount"
              onPress={() => navigation.navigate('AddMoney')}
            />
          </View>
        </View>

        <View style={{marginTop: 10}}>
          <TouchableRipple
            onPress={() => navigation.navigate('WalletTransaction')}>
            <View style={styles.menuItem}>
              <Icon name="credit-card" color="#ff6347" size={25} />
              <Text style={styles.menuItemText}>Payment</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => navigation.navigate('CustomerSupport')}>
            <View style={styles.menuItem}>
              <Icon name="account-check-outline" color="#ff6347" size={25} />
              <Text style={styles.menuItemText}>Support</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple
            onPress={() =>
              navigation.navigate('DeleteAccount', {email: userData?.email})
            }>
            <View style={styles.menuItem}>
              <AntDesign name="delete" color="red" size={25} />
              <Text style={[styles.menuItemText, {color: 'red'}]}>
                Delete account
              </Text>
            </View>
          </TouchableRipple>
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 60,
          }}>
          <Pressable
            onPress={() =>
              navigation.navigate('DeleteAccount', {email: userData?.email})
            }>
            <Text style={{fontSize: 16, color: 'blue'}}>Delete account</Text>
          </Pressable>
        </View> */}
      </ScrollView>
    </BackButtonHandler>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
    marginTop: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14,
    color: Colors.black1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: Colors.black1,
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});
