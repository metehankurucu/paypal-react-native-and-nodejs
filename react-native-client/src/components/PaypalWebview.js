import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import { urlParseParams } from '../helpers/functions';

const PaypalWebview = ({
  visible,
  url,
  successUrl,
  cancelUrl,
  onSuccess,
  onCancel,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);

  const onNavigationStateChange = webViewState => {
    console.log('Webview State => ', webViewState);

    if (webViewState.url.includes(successUrl)) {
      const params = urlParseParams(webViewState.url);
      // Params are Token and PayerID
      onSuccess(params);
    } else if (webViewState.url.includes(cancelUrl)) {
      onCanceled();
    }
  };

  const onCanceled = () => {
    onCancel();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onCanceled}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onCanceled}>
          <Text>Close</Text>
        </TouchableOpacity>
        <View style={styles.titleView}>
          <Text style={styles.title}>Pay with PayPal</Text>
        </View>
      </View>
      <WebView
        source={{ uri: url }}
        onNavigationStateChange={onNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      {loading && (
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size={'large'} color="darkblue" />
        </View>
      )}
    </Modal>
  );
};

PaypalWebview.defaultProps = {
  visible: false,
  url: '',
  successUrl: '',
  cancelUrl: '',
  onSuccess: () => {},
  onCancel: () => {},
  onClose: () => {},
};

PaypalWebview.propTypes = {
  visible: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  successUrl: PropTypes.string.isRequired,
  cancelUrl: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 80,
    backgroundColor: '#ECF0F1',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  spinnerWrapper: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  closeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    zIndex: 100,
  },
  title: {
    color: '#333',
    textAlign: 'center',
    fontSize: 20,
  },
  titleView: {
    flex: 1,
    marginLeft: -35,
    marginBottom: 10,
  },
});

export default PaypalWebview;
