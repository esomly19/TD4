<template>
  <Page>
    <StackLayout>
      <Label text="Add new item"></Label>
      <TextField v-model="nom" ></TextField>
          <Button
      @tap="toggle"
      :text="statusText"
      width="250"
      height="50"
      style="text-align:center;"
    />
          <Button text="Save" @tap="onSaveTap"></Button>
    </StackLayout>
  </Page>
</template>
<script>
export default {
  props: ["item"],
  data: function() {
    return {
     nom:this.item.content,
    fait:this.item.done
    };
  },
  methods: {
     toggle() {
this.fait = !this.fait;
},
    onSaveTap() {
    
      const updateItem = {
        name: this.nom,
        done: this.fait

      };
      this.$modal.close(updateItem);
    }
  },
computed: {
    statusText: function() {
      return this.fait ? "Done" : "Not done";
    }
  }
};
</script>
