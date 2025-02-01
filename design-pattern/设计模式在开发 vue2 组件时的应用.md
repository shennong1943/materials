在开发 Vue 2 业务组件时，合理应用设计模式可以提高代码的可维护性、可扩展性和复用性。以下是如何在 Vue 2 中应用设计模式的具体说明和代码示例，重点以开发一个 Table 组件为例。

---

### **1. 单例模式 (Singleton Pattern)**
**应用场景**：全局状态管理（如 Vuex Store）或全局工具类。

**示例**：全局消息通知组件。
```javascript
// Message.js
class Message {
  constructor() {
    if (!Message.instance) {
      Message.instance = this;
    }
    return Message.instance;
  }

  show(message) {
    console.log(`Message: ${message}`);
  }
}

const messageInstance = new Message();
export default messageInstance;

// 在 Vue 组件中使用
import message from './Message';

export default {
  methods: {
    showMessage() {
      message.show('Hello, Singleton!');
    },
  },
};
```

---

### **2. 观察者模式 (Observer Pattern)**
**应用场景**：组件间的数据通信或事件监听。

**示例**：Table 组件中监听行点击事件。
```vue
<template>
  <table>
    <tr v-for="row in data" :key="row.id" @click="handleRowClick(row)">
      <td>{{ row.name }}</td>
      <td>{{ row.age }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  props: ['data'],
  methods: {
    handleRowClick(row) {
      this.$emit('row-click', row);
    },
  },
};
</script>

<!-- 父组件中使用 -->
<TableComponent :data="tableData" @row-click="handleRowClick" />
```

---

### **3. 发布-订阅模式 (Pub/Sub Pattern)**
**应用场景**：跨组件通信或事件驱动的架构。

**示例**：Table 组件中通过事件总线实现跨组件通信。
```javascript
// eventBus.js
import Vue from 'vue';
export const eventBus = new Vue();

// TableComponent.vue
<template>
  <table>
    <tr v-for="row in data" :key="row.id" @click="handleRowClick(row)">
      <td>{{ row.name }}</td>
      <td>{{ row.age }}</td>
    </tr>
  </table>
</template>

<script>
import { eventBus } from './eventBus';

export default {
  props: ['data'],
  methods: {
    handleRowClick(row) {
      eventBus.$emit('row-click', row);
    },
  },
};
</script>

<!-- 其他组件中监听事件 -->
<script>
import { eventBus } from './eventBus';

export default {
  created() {
    eventBus.$on('row-click', row => {
      console.log('Row clicked:', row);
    });
  },
};
</script>
```

---

### **4. 工厂模式 (Factory Pattern)**
**应用场景**：动态创建组件或根据条件生成不同的对象。

**示例**：动态生成不同类型的 Table 列。
```javascript
// ColumnFactory.js
class ColumnFactory {
  createColumn(type) {
    switch (type) {
      case 'text':
        return { type: 'text', render: (value) => value };
      case 'button':
        return { type: 'button', render: (value) => `<button>${value}</button>` };
      default:
        throw new Error('Unknown column type');
    }
  }
}

export default new ColumnFactory();

// TableComponent.vue
<template>
  <table>
    <tr v-for="row in data" :key="row.id">
      <td v-for="column in columns" :key="column.prop">
        <span v-html="column.render(row[column.prop])"></span>
      </td>
    </tr>
  </table>
</template>

<script>
import columnFactory from './ColumnFactory';

export default {
  props: ['data'],
  data() {
    return {
      columns: [
        columnFactory.createColumn('text'),
        columnFactory.createColumn('button'),
      ],
    };
  },
};
</script>
```

---

### **5. 策略模式 (Strategy Pattern)**
**应用场景**：表单验证或动态选择算法。

**示例**：Table 组件中根据列类型动态选择渲染策略。
```javascript
// RenderStrategy.js
const renderStrategies = {
  text: (value) => value,
  button: (value) => `<button>${value}</button>`,
};

export default renderStrategies;

// TableComponent.vue
<template>
  <table>
    <tr v-for="row in data" :key="row.id">
      <td v-for="column in columns" :key="column.prop">
        <span v-html="renderCell(row, column)"></span>
      </td>
    </tr>
  </table>
</template>

<script>
import renderStrategies from './RenderStrategy';

export default {
  props: ['data'],
  data() {
    return {
      columns: [
        { prop: 'name', type: 'text' },
        { prop: 'action', type: 'button' },
      ],
    };
  },
  methods: {
    renderCell(row, column) {
      return renderStrategies[column.type](row[column.prop]);
    },
  },
};
</script>
```

---

### **6. 代理模式 (Proxy Pattern)**
**应用场景**：图片懒加载或 API 请求拦截。

**示例**：Table 组件中实现图片懒加载。
```vue
<template>
  <table>
    <tr v-for="row in data" :key="row.id">
      <td><img :src="row.image" ref="lazyImage" /></td>
    </tr>
  </table>
</template>

<script>
export default {
  props: ['data'],
  mounted() {
    this.$refs.lazyImage.forEach(img => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            img.src = img.dataset.src;
            observer.unobserve(img);
          }
        });
      });
      observer.observe(img);
    });
  },
};
</script>
```

---

### **7. 装饰器模式 (Decorator Pattern)**
**应用场景**：高阶组件或功能扩展。

**示例**：为 Table 组件添加排序功能。
```javascript
function withSorting(TableComponent) {
  return {
    extends: TableComponent,
    methods: {
      sortData(column) {
        this.data.sort((a, b) => (a[column] > b[column] ? 1 : -1));
      },
    },
  };
}

// 使用装饰器
const EnhancedTable = withSorting(TableComponent);
export default EnhancedTable;
```

---

### **8. 组合模式 (Composite Pattern)**
**应用场景**：树形结构或嵌套组件。

**示例**：Table 组件中支持嵌套表头。
```vue
<template>
  <table>
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.prop">
          {{ column.label }}
          <TableHeader v-if="column.children" :columns="column.children" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in data" :key="row.id">
        <td v-for="column in columns" :key="column.prop">
          {{ row[column.prop] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'TableHeader',
  props: ['columns'],
};
</script>
```

---

### **总结**
在 Vue 2 业务组件开发中，设计模式可以帮助我们更好地组织代码。通过单例模式、观察者模式、工厂模式、策略模式等，可以实现高内聚、低耦合的组件设计。以上示例展示了如何在 Table 组件中应用这些设计模式。
