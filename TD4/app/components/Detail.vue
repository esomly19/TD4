<template>
  <Page>  <ActionBar>
<NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="onBackTap"/>
  <ActionItem text="Update todo" @tap="update"></ActionItem>
 </ActionBar>  <GridLayout colums="50, 50" rows="50,50,50">
      <Label col="0" row="0"   :text="item.content"></Label>
     <Button
      @tap="toggle"
       :text="statusText"
     col="0" row="1" 
      style="text-align:center;"
    />

    </GridLayout>
  </Page>
</template>
<script>
import axios from "axios";
import * as btoa from 'btoa';
import {encode, decode} from "base-64";
import * as utf8 from "utf8";
import UpdateItem from "./UpdateItem";
export default {
  props: ["item","method"],
 components: { UpdateItem },
  data: function() {
    return {
    uuid:  JSON.parse(localStorage.getItem("uuid")),
    token: JSON.parse(localStorage.getItem("token")),
    fait:this.item.done

    };
  },
  computed: {
    statusText: function() {
      return this.fait ? "Done" : "Not done";
    }
  },
  methods: {
   toggle() {
    axios({
        method: "patch",
        url: "https://api.todolist.sherpa.one/users/"+this.uuid+"/todos/"+this.item.uuid,
        headers: { Authorization: `Bearer ${this.token}`
        },
    data:{ "done":!this.item.done}
      })
        .then(result => {
          console.log(result.data);
        this.fait=!this.fait;
        
        })
        .catch(err => {
          console.error(err.response.request._response);
           
                 console.log(err);
        })
        .finally(() => {

       
          
        });  
},
    onBackTap() {

    this.$navigateBack();
    },
update(){

      this.$showModal(UpdateItem, { props: { item: this.item } }).then(updateItem => {
        if (updateItem) {
           axios({
        method: "patch",
        url: "https://api.todolist.sherpa.one/users/"+this.uuid+"/todos/"+this.item.uuid,
        headers: { Authorization: `Bearer ${this.token}`
        },
    data:{ "content": updateItem.name, "done":updateItem.done}
      })
        .then(result => {
          console.log(result.data);

        })
        .catch(err => {
          console.error(err.response.request._response);
       
                 console.log(err);
        })
        .finally(() => {
        this.method();
        });  
        }
      });
},
  
   
    }
  
};
</script>
