import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import axios from 'axios';
import {CFPaymentGatewayService} from 'react-native-cashfree-pg-sdk';
import {
  CFDropCheckoutPayment,
  CFEnvironment,
  CFPaymentComponentBuilder,
  CFPaymentModes,
  CFSession,
  CFThemeBuilder,
} from 'cashfree-pg-api-contract';
import {UserType} from '../../UserContext'; // Adjust the import based on your context setup
import Service_URL from '../../utils/Constant';
import {walletRecharge} from '../../utils/UpdateWallet';
import {useNavigation, useRoute} from '@react-navigation/native';

const Payment = () => {
  const {userId, addToWallet, setWalletBalance, walletBalance} =
    useContext(UserType);
  const route = useRoute();

  const value = route?.params;
  const [order, setOrder] = useState({
    payment_session_id: '',
    order_id: '',
    order_expiry_time: '',
  });
  const [orderStatus, setOrderStatus] = useState();
  const [name, setName] = useState('swapnil');
  const [email, setEmail] = useState('swapnil@gmail.com');
  const [phone, setPhone] = useState('7836003419');
  const [description, setDescription] = useState('Test payment');
  const [totalAmount, setTotalAmount] = useState(value[0]); // Example amount
  const gst = 18;
  const totalAmountPaid = totalAmount + (totalAmount * gst) / 100;
  const navigation = useNavigation();

  useEffect(() => {
    // Setting up the event listeners for payment callbacks
    const onReceivedEvent = (eventName, map) => {
      console.log(
        'Event received: ' + eventName + ' map: ' + JSON.stringify(map),
      );
    };

    const onVerify = async orderId => {
      console.log('Order ID for verification: ' + orderId);
      try {
        const response = await walletRecharge({
          transactionId: orderId,
          walletId: value[1],
          userId: userId,
          amount: totalAmount,
          description: description,
        });
        console.log('Wallet recharge successful:', response.data);
        updateStatus('Payment successful: ' + orderId);
        // Update wallet balance in context or state if needed
        //setWalletBalance(walletBalance + totalAmount);
        navigation.navigate('WalletTransaction');
      } catch (err) {
        console.error('Failed to update wallet:', err);
        updateStatus('Failed to update wallet after payment.');
      }
    };

    const onError = (error, orderId) => {
      console.log(
        'Error during payment: ' +
          JSON.stringify(error) +
          ' Order ID: ' +
          orderId,
      );
      updateStatus('Payment failed: ' + JSON.stringify(error));
      // Additional code to handle payment failure
    };

    CFPaymentGatewayService.setEventSubscriber({onReceivedEvent});
    CFPaymentGatewayService.setCallback({onVerify, onError});

    return () => {
      CFPaymentGatewayService.removeCallback();
      CFPaymentGatewayService.removeEventSubscriber();
    };
  }, []);

  const updateStatus = message => {
    setOrderStatus(message);
    Alert.alert('Payment Status', message);
  };

  const handlePayment = async () => {
    try {
      const res = await axios.post(`${Service_URL}/payment`, {
        name,
        email,
        amount: totalAmountPaid,
        userId,
        phone,
        description,
      });

      if (res.data) {
        setOrder({
          payment_session_id: res.data.payment_session_id,
          order_id: res.data.order_id,
          order_expiry_time: res.data.order_expiry_time,
        });
        startCheckout(res.data);
      }
    } catch (error) {
      console.log('Handle Payment Error: ' + error);
      Alert.alert('Error', 'Payment initiation failed. Please try again.');
    }
  };

  const startCheckout = async orderData => {
    try {
      const session = new CFSession(
        orderData.payment_session_id,
        orderData.order_id,
        CFEnvironment.SANDBOX,
      );

      const paymentModes = new CFPaymentComponentBuilder()
        .add(CFPaymentModes.CARD)
        .add(CFPaymentModes.UPI)
        .add(CFPaymentModes.NB)
        .add(CFPaymentModes.WALLET)
        .add(CFPaymentModes.PAY_LATER)
        .build();

      const theme = new CFThemeBuilder()
        .setNavigationBarBackgroundColor('#94ee95')
        .setNavigationBarTextColor('#FFFFFF')
        .setButtonBackgroundColor('#FFC107')
        .setButtonTextColor('#FFFFFF')
        .setPrimaryTextColor('#212121')
        .setSecondaryTextColor('#757575')
        .build();

      const dropPayment = new CFDropCheckoutPayment(
        session,
        paymentModes,
        theme,
      );
      CFPaymentGatewayService.doPayment(dropPayment);
    } catch (error) {
      console.log('Checkout Error: ' + error);
      Alert.alert('Error', 'Failed to start payment. Please try again.');
    }
  };

  console.log('value', value[1], value[0]);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=800',
        }}
        style={styles.image}
      />
      <View style={styles.card}>
        <TextInput
          label="Name"
          value={name}
          mode="outlined"
          style={styles.input}
          onChangeText={text => setName(text)}
        />
        <TextInput
          label="Email"
          value={email}
          mode="outlined"
          style={styles.input}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          label="Phone Number"
          value={phone}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          onChangeText={text => setPhone(text)}
        />
        <TextInput
          label="Description"
          value={description}
          mode="outlined"
          style={styles.input}
          onChangeText={text => setDescription(text)}
        />
        <TouchableOpacity style={styles.btn} onPress={handlePayment}>
          <Text>Pay ₹{totalAmountPaid}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: '90%',
  },
  input: {
    marginVertical: 10,
    width: '100%',
  },
  btn: {
    marginTop: 20,
    backgroundColor: '#94ee95',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
