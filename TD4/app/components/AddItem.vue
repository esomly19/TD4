<template>
  <Page>
    <StackLayout>
      <Label text="Add new item"></Label>
      <TextField v-model="content" hint="Enter TODOS content"></TextField>
      <Button text="Save" @tap="onSaveTap"></Button>
    </StackLayout>
  </Page>
</template>
<script>
export default {
  props: ["id"],
  data: function() {
    return {
      content: " "
    };
  },
  methods: {
    onSaveTap() {
      const newItem = {
        id: this.id,
        content: this.content
      };
      this.$modal.close(newItem);
    }
  }
};
</script>
