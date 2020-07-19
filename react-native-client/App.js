import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import { Header, Colors } from 'react-native/Libraries/NewAppScreen';
import PaypalWebview from './src/components/PaypalWebview';

const App = () => {
  const [paypalValues, setPaypalValues] = useState({
    orderId: '',
    approvalUrl: '',
    returnUrl: '',
    cancelUrl: '',
  });
  const [webviewVisible, setWebviewVisible] = useState(false);

  const onPaypalCheckout = async () => {
    try {
      const response = await (await fetch(
        'http://localhost:3000/paypal/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currency_code: 'USD', value: '10' }),
        },
      )).json();

      console.log(response);
      if (response.result) {
        setPaypalValues({
          orderId: response.orderId,
          approvalUrl: response.approvalUrl,
          returnUrl: response.returnUrl,
          cancelUrl: response.cancelUrl,
        });
        setWebviewVisible(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSuccess = async () => {
    setWebviewVisible(false);
    try {
      const response = await (await fetch(
        `http://localhost:3000/paypal/orders/${paypalValues.orderId}/capture/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )).json();

      console.log(response);
      if (response.result) {
        //Payment capture success
        console.warn('Payment Success, show to user');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView style={styles.scrollView}>
          <Header />
          <View style={styles.content}>
            <Text style={styles.text}>PayPal Checkout</Text>
            <Text style={styles.text}>100 USD</Text>
            <TouchableOpacity onPress={onPaypalCheckout} style={styles.btn}>
              <Text style={styles.btnText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <PaypalWebview
          url={paypalValues.approvalUrl}
          visible={webviewVisible}
          onSuccess={onSuccess}
          onCancel={() => console.log('Payment Canceled')}
          onClose={() => setWebviewVisible(false)}
          successUrl={paypalValues.returnUrl}
          cancelUrl={paypalValues.cancelUrl}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: 'tomato',
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
  },
  btnText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#fff',
  },
  text: {
    fontSize: 22,
    margin: 5,
  },
});

export default App;
