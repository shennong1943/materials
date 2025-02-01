在 Vue 2 开发中，提取公共逻辑或代码分离是提高代码复用性和可维护性的重要手段。以下是几种常见的方式及其代码示例：

---

### **1. Mixins**
**说明**：Mixins 是一种将公共逻辑提取到单独文件并在多个组件中复用的方式。

**示例**：提取表单验证逻辑。
```javascript
// formValidationMixin.js
export default {
  data() {
    return {
      errors: {},
    };
  },
  methods: {
    validateField(field, value) {
      if (!value) {
        this.errors[field] = 'This field is required';
      } else {
        delete this.errors[field];
      }
    },
  },
};

<!-- 在组件中使用 -->
<script>
import formValidationMixin from './formValidationMixin';

export default {
  mixins: [formValidationMixin],
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    submitForm() {
      this.validateField('username', this.username);
      this.validateField('password', this.password);
      if (Object.keys(this.errors).length === 0) {
        // Submit form
      }
    },
  },
};
</script>
```

---

### **2. 自定义指令 (Custom Directives)**
**说明**：通过自定义指令封装 DOM 操作逻辑。

**示例**：实现一个自动聚焦的指令。
```javascript
// focusDirective.js
export default {
  inserted(el) {
    el.focus();
  },
};

<!-- 在组件中使用 -->
<template>
  <input v-focus />
</template>

<script>
import focusDirective from './focusDirective';

export default {
  directives: {
    focus: focusDirective,
  },
};
</script>
```

---

### **3. 插件 (Plugins)**
**说明**：通过插件封装全局功能，如全局方法、指令或组件。

**示例**：封装一个全局 Toast 插件。
```javascript
// toastPlugin.js
export default {
  install(Vue) {
    Vue.prototype.$toast = function (message) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    };
  },
};

<!-- 在 main.js 中使用 -->
import Vue from 'vue';
import toastPlugin from './toastPlugin';

Vue.use(toastPlugin);

<!-- 在组件中使用 -->
<script>
export default {
  methods: {
    showToast() {
      this.$toast('Hello, Toast!');
    },
  },
};
</script>
```

---

### **4. 高阶组件 (Higher-Order Components, HOC)**
**说明**：通过高阶组件增强现有组件的功能。

**示例**：为组件添加加载状态。
```javascript
// withLoading.js
export default function withLoading(Component) {
  return {
    data() {
      return {
        isLoading: false,
      };
    },
    methods: {
      startLoading() {
        this.isLoading = true;
      },
      stopLoading() {
        this.isLoading = false;
      },
    },
    render(h) {
      return h(Component, {
        props: {
          ...this.$props,
          isLoading: this.isLoading,
        },
        on: {
          ...this.$listeners,
        },
      });
    },
  };
}

<!-- 在组件中使用 -->
<script>
import withLoading from './withLoading';
import MyComponent from './MyComponent';

export default withLoading(MyComponent);
</script>
```

---

### **5. 组合式函数 (Composable Functions)**
**说明**：将逻辑提取到独立的函数中，类似于 Vue 3 的 Composition API。

**示例**：提取数据获取逻辑。
```javascript
// useFetch.js
export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(true);

  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      data.value = json;
    })
    .catch((err) => {
      error.value = err;
    })
    .finally(() => {
      loading.value = false;
    });

  return { data, error, loading };
}

<!-- 在组件中使用 -->
<script>
import { useFetch } from './useFetch';

export default {
  setup() {
    const { data, error, loading } = useFetch('https://api.example.com/data');

    return {
      data,
      error,
      loading,
    };
  },
};
</script>
```

---

### **6. 工具函数 (Utility Functions)**
**说明**：将通用的工具函数提取到单独的文件中。

**示例**：提取日期格式化函数。
```javascript
// dateUtils.js
export function formatDate(date, format = 'YYYY-MM-DD') {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  return new Date(date).toLocaleDateString(undefined, options);
}

<!-- 在组件中使用 -->
<script>
import { formatDate } from './dateUtils';

export default {
  data() {
    return {
      date: '2023-10-01',
    };
  },
  computed: {
    formattedDate() {
      return formatDate(this.date);
    },
  },
};
</script>
```

---

### **7. 状态管理 (Vuex)**
**说明**：通过 Vuex 管理全局状态，分离业务逻辑。

**示例**：将用户信息存储到 Vuex 中。
```javascript
// store.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    fetchUser({ commit }) {
      return fetch('/api/user')
        .then((response) => response.json())
        .then((user) => {
          commit('setUser', user);
        });
    },
  },
});

<!-- 在组件中使用 -->
<script>
export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    fetchUser() {
      this.$store.dispatch('fetchUser');
    },
  },
};
</script>
```

---

### **8. 插槽 (Slots)**
**说明**：通过插槽分离 UI 和逻辑。

**示例**：封装一个可复用的 Modal 组件。
```vue
<!-- Modal.vue -->
<template>
  <div class="modal">
    <div class="modal-content">
      <slot name="header"></slot>
      <slot name="body"></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<!-- 在组件中使用 -->
<template>
  <Modal>
    <template #header>
      <h2>Modal Title</h2>
    </template>
    <template #body>
      <p>Modal content goes here.</p>
    </template>
    <template #footer>
      <button @click="closeModal">Close</button>
    </template>
  </Modal>
</template>
```

---

### **总结**
在 Vue 2 开发中，提取公共逻辑或代码分离的方式包括 Mixins、自定义指令、插件、高阶组件、组合式函数、工具函数、状态管理和插槽等。通过这些方式，可以提高代码的复用性和可维护性。
