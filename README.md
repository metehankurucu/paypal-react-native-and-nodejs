# paypal-react-native-and-nodejs

Paypal integration example in React Native with Node.js

---

### Usage/Flow

#### 0. Set variables (according to use sandbox or production)

- Add your client id and client secret to .env file

```
  PAYPAL_CLIENT_ID=replace_client_id
  PAYPAL_CLIENT_SECRET=replace_client_secret
```

- Set returnUrl and cancelUrl in /routes/paypal.js (not necessary)
- Change environment (sandbox/production) in /helpers/paypalClient.js

#### 1. [Run](#nodejs-server)

#### 2. Create an order

```
Post request to http://localhost:3000/paypal/orders
Request body example { currency_code:'USD',value:'100'}
```

#### 3. Paypal approval page webview opens in the app

#### 4. The order is captured with the order ID, when the user approves the payment

```
Post request to http://localhost:3000/paypal/orders/ORDER_ID/capture
```

---

### Node.js Server

```
npm install && npm start
```

### React Native App

```
npm install && cd ios/ && pod install && cd .. && react-native run-ios
#or
npm install && react-native run-android
```
