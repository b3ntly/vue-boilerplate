import Vue from 'vue';
import {MdMenu,MdButton,MdList} from 'vue-material/dist/components'
import {Component,Watch} from 'vue-typed';
import Introduction from './models';

Vue.use(MdMenu)
Vue.use(MdButton)
Vue.use(MdList)

Vue.config.devtools = true;
Vue.config.performance = true;

enum Display { Split, Table }
enum Network { Active, Inactive }

const devId = "0050G000009tEC8QAM";
const authorization = "f81b246b32da2dfb1bccd7a28182dafd";

let defaultFilter = {
    "where":{  
        "Introduction_active__c":true,
        "Ownership_Filter__c":"All Introductions",
        "Stage__c":""
     },
     "sortKey":"CreatedDate",
     "sortValue":"DESC",
     "userId":"0050G000009tEC8QAM",
     "search":""
}

declare var Notification: any;

@Component({
    template: require('./index.jade')()
})
class App extends Vue {
    host = 'https://api.lionsforce.com/intros/'
    display: Display = Display.Table
    network: Network = Network.Inactive;

    introductionsCount = 0;
    introductions: Introduction[] = [];
    selectedIntroduction: Introduction = {};
    
    queryFilter =  { ...defaultFilter }
    lastQuery = '';

    created(){
        this.fetch(this.queryFilter)
    }

    fetch(q?){
       fetch(this.host, {
            method: "POST",
            headers: { authorization },
            body: JSON.stringify(this.queryFilter)
        })
        .then(response => response.json())
        .then(data => { if(q.search !== this.queryFilter.search) return; this.introductionsCount = data.count; this.introductions = data.records || []; this.pauseNetwork(1000); })
        .catch(err => { this.pauseNetwork(1000); this.notify(err)})
    }

    @Watch('queryFilter', true)
    queryChanged(newQuery, oldQuery){
        this.network = Network.Active;
        this.fetch(newQuery);
    }

    update(field: string, value: any){
        if (this.network === Network.Active){
            this.notify("You are doing that too quickly");
            return 
        }

        this.network = Network.Active;
        this.notify(`Successfully updated ${field} with ${value}!`)
        this.pauseNetwork(1000);
    }

    clearFilter(){
        this.selectedIntroduction = {}; 
        this.queryFilter = {...defaultFilter}
    }

    changeDisplay(){
        this.display = this.display === Display.Table ? Display.Split : Display.Table
    }

    formatDate(timestamp: string): string {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleString();
    }

    notify(message:string){
        if (!("Notification" in window)) alert("This browser does not support desktop notifications");
        else if (Notification['permission'] === "granted") new Notification(message, {silent: true});
        else if (Notification['permission'] !== "denied") Notification.requestPermission(permission => permission === "granted" ? new Notification(message): undefined);
    }

    pauseNetwork(timeout: Number){
        setTimeout(() => this.network = Network.Inactive, timeout)
    }
}

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
})