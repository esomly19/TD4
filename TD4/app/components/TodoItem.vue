<template>
 <StackLayout orientation="horizontal" width="500" height="50" >
    <Label
      :text="item.content"
        :class="{ 'line-through': item.done }"
      width="100"
    />
     <Label
      @tap="toggle"
      :text="statusText"

      width="100"
    />
       <Label   v-if="item.done" @tap="supprimer(item)">🗑️</Label>
  </StackLayout>
</template>
<script>
import * as localStorage from "nativescript-localstorage";
import axios from "axios";
import * as btoa from 'btoa';
import {encode, decode} from "base-64";
import * as utf8 from "utf8";
export default {
  props: ["item","method"],

  data() {
    return {
    uuid:  JSON.parse(localStorage.getItem("uuid")),
    token: JSON.parse(localStorage.getItem("token"))
    };
  },
  computed: {
    statusText: function() {
      return this.item.done ? "Done" : "Not done";
    }
  },
  methods: {
   toggle: function() {
      //this.status = this.status === 0 ? 1 : 0;
      this.$emit("toggleDone", this.item);
    },
   supprimer: function(element) {
confirm("Voulez vous vraiment supprimer " + this.item.content + " ?").then(
        result => {
          if (result) {
            axios({
        method: "DELETE",
        url: "https://api.todolist.sherpa.one/users/"+this.uuid+"/todos/"+this.item.uuid,
        headers: { Authorization: `Bearer ${this.token}`
        },
      })
        .then(result => {
          console.log("supprimer");
    
        })
        .catch(err => {
          console.error(err);
console.log("FAIL");
        })
        .finally(() => {
         this.method();
        });  
          }
        }
      );
               
          
        
    
    }
  },

};
</script>
<style lang="scss" scoped>

  Label {
    color: black;
    font-size: 20em;
  }
  .line-through {
    text-decoration: line-through;
  }


label {
  background-color: darkslategrey;
}
</style>
