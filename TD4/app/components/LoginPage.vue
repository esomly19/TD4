<template>
  <Page>
    <FlexboxLayout class="page">
      <StackLayout class="form">
        <Label class="header" text="TD4" />

        <StackLayout  class="input-field" marginBottom="25">
          <TextField
            class="input"
            hint="Email"
            keyboardType="email"
          :isEnabled="!processing"
            autocorrect="false"
            autocapitalizationType="none"
            v-model="email"
            returnKeyType="next"
            @returnPress="focusPassword"
            fontSize="18"
          />
          <StackLayout class="hr-light" />
        </StackLayout>
<ActivityIndicator :busy="processing" rowSpan="3"></ActivityIndicator>
        <StackLayout  v-show="isLoggingIn" class="input-field" marginBottom="25">
          <TextField
            ref="password"
          :isEnabled="!processing"
            class="input"
            hint="Mot de passe"
            secure="true"
            v-model="password"
            :returnKeyType="isLoggingIn ? 'fait' : 'suivant'"
            @returnPress="focusConfirmPassword"
            fontSize="18"
          />
          <StackLayout class="hr-light" />
        </StackLayout>

      

           <StackLayout  v-show="!isLoggingIn" class="input-field">
          <TextField
            ref="firstname"
            class="input"
            hint="firstname"
            v-model="firstname"
        :isEnabled="!processing"
            returnKeyType="done"
            fontSize="18"
          />
          <StackLayout class="hr-light" />
        </StackLayout>
        <StackLayout  v-show="!isLoggingIn" class="input-field">
          <TextField
            ref="lastname"
            class="input"
            hint="lastname"
      :isEnabled="!processing"
            v-model="lastname"
            returnKeyType="done"
            fontSize="18"
          />
          <StackLayout class="hr-light" />
        </StackLayout>

        <Button :isEnabled="!processing"
          :text="isLoggingIn ? 'Se connecter' : 'S\'inscrire'"
          @tap="submit"
          class="btn btn-primary m-t-20"
        />
      </StackLayout>

      <Label class="login-label sign-up-label" @tap="toggleForm">
        <FormattedString>
          <Span
            :text="
              isLoggingIn
                ? 'Vous n\'avez pas de compte ? '
                : 'Retour à la page de connexion'
            "
          />
          <Span :text="isLoggingIn ? 'S\'inscrire' : ''" class="bold" />
        </FormattedString>
      </Label>

    </FlexboxLayout>

  </Page>
</template>

<script>
import axios from "axios";
// A stub for a service that authenticates users.
import * as localStorage from "nativescript-localstorage";
import * as btoa from 'btoa';
import {encode, decode} from "base-64";
import * as utf8 from "utf8";
// A stub for the main page of your app. In a real app you’d put this page in its own .vue file.
import Home from "./Home";
export default {
  data() {
    return {
      isLoggingIn: true,
        email: "",
        password: "",
        firstname : "",
        lastname: "",
        genders:["male","female"],
        uuid: "",   
        passwordkk: "",
        Reponse: "",
        token:"",
        name:"",
        lastname:"",
      processing : false

    };
  },
  methods: {
    toggleForm() {
      this.isLoggingIn = !this.isLoggingIn;
    },

    submit() {
     
      if (this.isLoggingIn) {
        this.login();
      } else {
        this.inscrire();
      }
    },

    login() {
  this.processing = true;
 axios({
        method: "post",
        url: "https://api.todolist.sherpa.one/users/signin",
      auth: {
          "username": this.email,
          "password":this.password
 }
      })
        .then(result => {
         console.log(result);
        this.processing = false;
        this.token=result.data.token;
      localStorage.setItem("token", JSON.stringify(this.token));
        this.uuid=result.data.user.uuid;
          this.name=result.data.user.firstname;
                this.lastname=result.data.user.lastname;
      localStorage.setItem("lastname", JSON.stringify(this.lastname));
        localStorage.setItem("name", JSON.stringify(this.firstname));
     localStorage.setItem("uuid", JSON.stringify(this.uuid));
          this.$navigateTo(Home ,{
  transition: {},
  transitioniOS: {},
  transitionAndroid: {},

  props: {
    token: this.token,
    uuid: this.uuid,
    nom : this.lastname,
    prenom: this.name
   }} );
 
        })
        .catch(err => {
          console.error(err.message);
 this.processing = false;
      this.alert("Malheureusement nous n'avons pas trouvé votre compte.");

        })
        .finally(() => {});
    },

    inscrire() {
 this.processing = true;
    axios({
        method: "post",
        url: "https://api.todolist.sherpa.one/users/signup",
        data: {
          email: this.email,
          firstname: this.firstname,
          lastname: this.lastname,
          gender: "male",
     
        }
      })
        .then(result => {
 this.processing = false;
          this.Reponse = result.data;
          console.log(result.data);
          this.passwordkk = result.data.password;
          this.uuid = result.data.uuid;
          alert("Votre mot de passe : " + this.passwordkk);
        })
        .catch(err => {
 this.processing = false;
          this.Reponse = err.message;
          console.error(err.message);
        })
        .finally(() => {
        
        });    
    },

    focusPassword() {
      this.$refs.password.nativeView.focus();
    },
    checkToken(){

       if (localStorage.getItem("token")) {
 this.processing = true;
        this.token = JSON.parse(localStorage.getItem("token"));
        this.uuid = JSON.parse(localStorage.getItem("uuid"));
        this.lastname=JSON.parse(localStorage.getItem("lastname"));
       this.name=JSON.parse(localStorage.getItem("name"));
 axios({
        method: "post",
        url: "https://api.todolist.sherpa.one/users/check-token",
            headers: { Authorization: `Bearer ${this.token}`
        },
      })
        .then(result => {
 this.processing = false;
     this.$navigateTo(Home ,{
  transition: {},
  transitioniOS: {},
  transitionAndroid: {},

  props: {
    token: this.token,
    uuid: this.uuid,
    nom : this.lastname,
    prenom: this.name
   }} );
       
        })
        .catch(err => {
  console.log("ouille");
 this.processing = false;
        })
        .finally(() => {
         this.processing = false;
        });    

       
  }},
   
    alert(message) {
      return alert({
        title: "TD4",
        okButtonText: "OK",
        message: message
      });
    }
  },mounted() {
  this.checkToken();
    if(!global.btoa) {
        global.btoa = encode;
    }
  }
};
</script>

<style scoped>
.page {
  align-items: center;
  flex-direction: column;
}

.form {
  margin-left: 30;
  margin-right: 30;
  flex-grow: 2;
  vertical-align: middle;
}

.logo {
  margin-bottom: 12;
  height: 90;
  font-weight: bold;
}

.header {
  horizontal-align: center;
  font-size: 25;
  font-weight: 600;
  margin-bottom: 70;
  text-align: center;
  color: lightblue;
}

.input-field {
  margin-bottom: 25;
}

.input {
  font-size: 18;
  placeholder-color: #a8a8a8;
}

.input-field .input {
  font-size: 54;
}

.btn-primary {
  height: 50;
  margin: 30 5 15 5;
  background-color: lightblue;
  color: black;
  border-radius: 5;
  font-size: 20;
  font-weight: 600;
}

.login-label {
  horizontal-align: center;
  color: #a8a8a8;
  font-size: 16;
}

.sign-up-label {
  margin-bottom: 20;
}

.bold {
  color: #000000;
}
:disabled {
  opacity: 0.5;
}
</style>
