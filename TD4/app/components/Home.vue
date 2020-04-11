<template>
  <Page>
<ActionBar>
  <ActionItem text="Add todo"  @tap="onAddTap"></ActionItem>
  <ActionItem text="Sort" @tap="sort"></ActionItem>
</ActionBar>
   <BottomNavigation selectedIndex="0">

      <!-- The bottom tab UI is created via TabStrip (the containier) and TabStripItem (for each tab)-->
      <TabStrip>
        <TabStripItem class="special">
          <Label text="Home"></Label>
        </TabStripItem>
        <TabStripItem>
          <Label text="Compte"></Label>
        </TabStripItem>

      </TabStrip>

      <!-- The number of TabContentItem components should corespond to the number of TabStripItem components -->
      <TabContentItem>

            <GridLayout>
  <StackLayout>

   <ListView for="todo in todos" @itemTap="onItemTap">
    <v-template>
        <TodoItem :item="todo" :method="getTodos" @toggleDone="onToggleDone">
        </TodoItem> </v-template></ListView>
  
</StackLayout>

   </GridLayout>
      </TabContentItem>
      <TabContentItem>
        <GridLayout>
          <StackLayout>
 
          <Label > Compte : {{nom}} {{prenom}}</Label>
        <Button @tap="resetPassword">Reset de mot de passe </Button>
         <Button @tap="disconnect">Déconnexion </Button>
          
     </StackLayout>
    
   </GridLayout>
      </TabContentItem>
    

    </BottomNavigation>
  </Page>
</template>

<script>

import axios from "axios";
import AddItem from "./AddItem";
import Login from "./LoginPage";
import TodoItem from "./TodoItem";
import * as btoa from 'btoa';
import {encode, decode} from "base-64";
import * as utf8 from "utf8";
import Detail from "./Detail";
export default {
 components: { AddItem,TodoItem,Detail },
  props: ['token','uuid','nom','prenom'],
   data() {  return {Reponse:"",todos:"", networkStatus: "",  networkStatus: ""}},
  methods:{
 
  ok(){console.log(this.token);
console.log("---------------------------");
console.log(this.uuid);

},
onItemTap(args) {
      this.$navigateTo(Detail, {
        props: { item: args.item, method:this.getTodos() }
      });
    },
     onToggleDone(item) {
      
      axios({
        method: "patch",
        url: "https://api.todolist.sherpa.one/users/"+this.uuid+"/todos/"+item.uuid,
        headers: { Authorization: `Bearer ${this.token}`
        },
    data:{ "content": item.name, "done":!item.done}
      })
        .then(result => {
          console.log(result.data);

        })
        .catch(err => {
          console.error(err.response.request._response);
       
                 console.log(err);
        })
        .finally(() => {
        this.getTodos();
        });  
    },
 onAddTap() {
      const newId = new Date().getTime();
      this.$showModal(AddItem, { props: { id: newId } }).then(newItem => {
        if (newItem) {
           axios({
        method: "post",
        url: "https://api.todolist.sherpa.one/users/"+this.uuid+"/todos",
        headers: { Authorization: `Bearer ${this.token}`
        },
    data:{ "content": newItem.content}
      })
        .then(result => {
          console.log(result.data);
        })
        .catch(err => {
          console.error(err.response.request._response);
        })
        .finally(() => {
        this.getTodos();
        });    

        }
      });
    },
  getTodos(){
    axios({
        method: "get",
        url: "https://api.todolist.sherpa.one/users/"+this.uuid+"/todos",
        headers: { Authorization: `Bearer ${this.token}`}
      })
        .then(result => {
        this.todos=result.data.todos;
          console.log(result.data.todos);
        })
        .catch(err => {
          console.error(err.response.request._response);
        })
        .finally(() => {
        
        });    


}, 
   sort() {
      return this.todos.sort((x, y) => x.done - y.done);
    },
resetPassword(){
  axios({
        method: "post",
        url: "https://api.todolist.sherpa.one/users/"+this.uuid+"/reset/password",
        headers: { Authorization: `Bearer ${this.token}`
        },
      })
        .then(result => {
          console.log(result.data);
        alert(result.data.password);
        })
        .catch(err => {
          console.error(err.response.request._response);
        })
        .finally(() => {

        }); 

},disconnect(){
   localStorage.removeItem('token');
     localStorage.removeItem('uuid');
   localStorage.removeItem('lastname');
   localStorage.removeItem('name');
  this.$navigateTo(Login );
}
  },
mounted(){
this.ok();
this.getTodos();

  if(!global.btoa) {
        global.btoa = encode;
    }
},  watch() {
 this.getTodos();
  },

};
</script>