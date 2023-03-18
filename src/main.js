import { createApp } from 'vue';
import App from './App.vue';

import 'vuetify/styles';
import './assets/main.css';
import { createVuetify } from "vuetify";
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import colors from 'vuetify/lib/util/colors';

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
    }
})

createApp(App).use(vuetify).mount('#app')
