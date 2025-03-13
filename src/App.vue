<script setup lang="ts">
import { ref } from "vue";
import Button from "./components/Button/Button.vue";
import Collapse from "./components/Collapse/Collapse.vue";
import CollapseItem from "./components/Collapse/CollapseItem.vue";
import Icon from "./components/Icon/Icon.vue";
import Alert from "./components/Alert/Alert.vue";

const collapseOpenedVal = ref(["a"]);
</script>

<template>
  <div class="button">
    <div class="basic block">
      <Button> hello </Button>
      <Button type="primary"> Primary </Button>
      <Button type="success"> Success </Button>
      <Button type="warning"> Warning </Button>
      <Button type="danger"> Danger </Button>
      <Button type="info"> Info </Button>
    </div>

    <div class="plain block">
      <Button plain> hello </Button>
      <Button type="primary" plain> Primary </Button>
      <Button type="success" plain> Success </Button>
      <Button type="warning" plain> Warning </Button>
      <Button type="danger" plain> Danger </Button>
      <Button type="info" plain> Info </Button>
    </div>

    <div class="round block">
      <Button round> hello </Button>
      <Button type="primary" round> Primary </Button>
      <Button type="success" round> Success </Button>
      <Button type="warning" round> Warning </Button>
      <Button type="danger" round> Danger </Button>
      <Button type="info" round> Info </Button>
    </div>

    <div class="circle block">
      <Button circle> <Icon icon="star" /> </Button>
      <Button type="primary" circle> <Icon icon="star" /> </Button>
      <Button type="success" circle> <Icon icon="star" /> </Button>
      <Button type="warning" circle> <Icon icon="star" /> </Button>
      <Button type="danger" circle> <Icon icon="star" /> </Button>
      <Button type="info" circle> <Icon icon="star" /> </Button>
      <Button loading> Loading </Button>
      <Button size="large" type="primary"> Large </Button>
    </div>
  </div>

  <div class="collapse">
    <Collapse v-model="collapseOpenedVal">
      <CollapseItem name="a">
        <template #title>
          <h1>Consistency</h1>
        </template>
        <div>Consistent with real life: in line with the process and logic of real
          life, and comply with languages and habits that the users are used to</div>
      </CollapseItem>
      <CollapseItem name="b" title="Feedback">
        <div>Operation feedback: enable the users to clearly perceive their
          operations by style updates and interactive effects</div>
      </CollapseItem>
      <CollapseItem name="c" title="Efficiency" disabled>
        <div>he is content in c</div>
      </CollapseItem>
    </Collapse>
  </div>

  <div class="alert">
    <Alert closable>Hello World</Alert>
    <Alert closable type="warning">Hello World</Alert>
    <Alert closable type="danger" effect="dark">Hello Dark</Alert>
    <Alert closable type="success" effect="light">Hello Light</Alert>
  </div>
</template>

<style lang="scss" scoped>
.block {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
</style>
