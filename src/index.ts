import Button from "./components/Button/Button.vue";
import Alert from "./components/Alert/Alert.vue";
import Collapse from "./components/Collapse/Collapse.vue";
import CollapseItem from "./components/Collapse/CollapseItem.vue";
import Form from "./components/Form/Form.vue";
import FormItem from "./components/Form/FormItem.vue";
import Dropdown from "./components/Dropdown/Dropdown.vue";
import Icon from "./components/Icon/Icon.vue";
import Input from "./components/Input/Input.vue";
import Message from "./components/Message/Message.vue";
import { createMessage } from "./components/Message";
import Select from "./components/Select/Select.vue";
import Switch from "./components/Switch/Switch.vue";
import Tooltip from "./components/Tooltip/Tooltip.vue";
import type { App } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

import "./styles/index.scss";
library.add(fas);

const components = [
  Button,
  Alert,
  Collapse,
  CollapseItem,
  Form,
  FormItem,
  Dropdown,
  Icon,
  Input,
  Message,
  Select,
  Switch,
  Tooltip,
];

const install = (app: App) => {
  components.forEach((component) => {
    app.component(component.name as string, component);
  });
};

export {
  Button,
  Alert,
  Collapse,
  CollapseItem,
  Form,
  FormItem,
  Dropdown,
  Icon,
  Input,
  Message,
  Select,
  Switch,
  Tooltip,
  install,
  createMessage,
};

export default {
  install,
};
