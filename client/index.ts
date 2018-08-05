import Vue from 'vue';
import {Component,Watch} from 'vue-typed';

Vue.config.devtools = true;
Vue.config.performance = true;

const template = require('./index.jade')();

@Component({
    template
})
class App extends Vue {
    created(){
        alert('hello, world.');
    }
}

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
})