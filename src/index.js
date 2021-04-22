import { createApp } from 'vue';
import App from './components/App.vue';
import BorrowerControl from './components/BorrowerControl.vue';
import BorrowerDetails from './components/BorrowerDetails.vue';
import Section from './components/Section.vue';
import CheckoutSession from './components/CheckoutSession.vue';
import Checkout from './components/Checkout.vue';
import './style.scss';

const myApp = createApp(App);

myApp.component('tind-borrower-control', BorrowerControl);
myApp.component('tind-borrower-details', BorrowerDetails);
myApp.component('tind-section', Section);
myApp.component('tind-checkout-session', CheckoutSession);
myApp.component('tind-checkout', Checkout);
myApp.mount(document.body);
