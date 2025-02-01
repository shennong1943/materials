在 Vue 2 开发中，良好的组件封装思想可以提高代码的复用性、可维护性和可扩展性。以下是一些常见的组件封装思想及其代码示例：

---

### **1. 单一职责原则 (Single Responsibility Principle)**
**思想**：每个组件只负责一个功能，避免功能过于复杂。

**示例**：将 Table 组件的表头和表体拆分为两个子组件。
```vue
<!-- TableHeader.vue -->
<template>
  <thead>
    <tr>
      <th v-for="column in columns" :key="column.prop">{{ column.label }}</th>
    </tr>
  </thead>
</template>

<script>
export default {
  props: ['columns'],
};
</script>

<!-- TableBody.vue -->
<template>
  <tbody>
    <tr v-for="row in data" :key="row.id">
      <td v-for="column in columns" :key="column.prop">{{ row[column.prop] }}</td>
    </tr>
  </tbody>
</template>

<script>
export default {
  props: ['data', 'columns'],
};
</script>

<!-- TableComponent.vue -->
<template>
  <table>
    <TableHeader :columns="columns" />
    <TableBody :data="data" :columns="columns" />
  </table>
</template>

<script>
import TableHeader from './TableHeader';
import TableBody from './TableBody';

export default {
  components: { TableHeader, TableBody },
  props: ['data', 'columns'],
};
</script>
```

---

### **2. 可配置性 (Configurability)**
**思想**：通过 `props` 和 `slots` 提供灵活的配置选项，使组件适应不同场景。

**示例**：可配置的 Table 组件。
```vue
<template>
  <table>
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.prop">
          {{ column.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in data" :key="row.id">
        <td v-for="column in columns" :key="column.prop">
          <slot :name="column.prop" :row="row">
            {{ row[column.prop] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    data: { type: Array, required: true },
    columns: { type: Array, required: true },
  },
};
</script>

<!-- 使用示例 -->
<TableComponent :data="tableData" :columns="tableColumns">
  <template #status="{ row }">
    <span :class="`status-${row.status}`">{{ row.status }}</span>
  </template>
</TableComponent>
```

---

### **3. 组合优于继承 (Composition over Inheritance)**
**思想**：通过组合多个小组件来实现复杂功能，而不是通过继承。

**示例**：将分页功能与 Table 组件分离。
```vue
<!-- Pagination.vue -->
<template>
  <div class="pagination">
    <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
  },
  methods: {
    prevPage() {
      this.$emit('page-change', this.currentPage - 1);
    },
    nextPage() {
      this.$emit('page-change', this.currentPage + 1);
    },
  },
};
</script>

<!-- TableComponent.vue -->
<template>
  <div>
    <table>
      <!-- Table content -->
    </table>
    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script>
import Pagination from './Pagination';

export default {
  components: { Pagination },
  data() {
    return {
      currentPage: 1,
      totalPages: 10,
    };
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page;
      // Fetch new data based on page
    },
  },
};
</script>
```

---

### **4. 插槽机制 (Slots)**
**思想**：通过插槽提供灵活的内容分发机制，使组件更通用。

**示例**：支持自定义表头和表尾的 Table 组件。
```vue
<template>
  <table>
    <thead>
      <tr>
        <slot name="header" :columns="columns">
          <th v-for="column in columns" :key="column.prop">{{ column.label }}</th>
        </slot>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in data" :key="row.id">
        <td v-for="column in columns" :key="column.prop">
          <slot :name="column.prop" :row="row">
            {{ row[column.prop] }}
          </slot>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <slot name="footer" :data="data" />
    </tfoot>
  </table>
</template>

<script>
export default {
  props: {
    data: { type: Array, required: true },
    columns: { type: Array, required: true },
  },
};
</script>

<!-- 使用示例 -->
<TableComponent :data="tableData" :columns="tableColumns">
  <template #header="{ columns }">
    <th v-for="column in columns" :key="column.prop">
      {{ column.label.toUpperCase() }}
    </th>
  </template>
  <template #footer="{ data }">
    <tr>
      <td colspan="3">Total: {{ data.length }} rows</td>
    </tr>
  </template>
</TableComponent>
```

---

### **5. 高阶组件 (Higher-Order Components, HOC)**
**思想**：通过高阶组件增强现有组件的功能。

**示例**：为 Table 组件添加排序功能。
```javascript
function withSorting(TableComponent) {
  return {
    extends: TableComponent,
    data() {
      return {
        sortColumn: '',
        sortOrder: 'asc',
      };
    },
    methods: {
      sortData(column) {
        if (this.sortColumn === column) {
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = column;
          this.sortOrder = 'asc';
        }
        this.data.sort((a, b) => {
          if (a[column] > b[column]) return this.sortOrder === 'asc' ? 1 : -1;
          if (a[column] < b[column]) return this.sortOrder === 'asc' ? -1 : 1;
          return 0;
        });
      },
    },
  };
}

// 使用高阶组件
const EnhancedTable = withSorting(TableComponent);
export default EnhancedTable;
```

---

### **6. 依赖注入 (Provide/Inject)**
**思想**：通过 `provide` 和 `inject` 实现跨层级组件通信。

**示例**：在 Table 组件中提供主题配置。
```vue
<!-- TableComponent.vue -->
<template>
  <div :class="`table-${theme}`">
    <slot></slot>
  </div>
</template>

<script>
export default {
  provide() {
    return {
      theme: this.theme,
    };
  },
  props: {
    theme: { type: String, default: 'light' },
  },
};
</script>

<!-- TableRow.vue -->
<template>
  <tr :class="`row-${theme}`">
    <slot></slot>
  </tr>
</template>

<script>
export default {
  inject: ['theme'],
};
</script>
```

---

### **7. 状态提升 (Lifting State Up)**
**思想**：将共享状态提升到父组件中管理，避免子组件之间的直接耦合。

**示例**：Table 组件中管理选中行状态。
```vue
<template>
  <table>
    <tr
      v-for="row in data"
      :key="row.id"
      :class="{ selected: selectedRow === row.id }"
      @click="handleRowClick(row.id)"
    >
      <td>{{ row.name }}</td>
      <td>{{ row.age }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  props: {
    data: { type: Array, required: true },
    selectedRow: { type: Number, default: null },
  },
  methods: {
    handleRowClick(rowId) {
      this.$emit('row-select', rowId);
    },
  },
};
</script>

<!-- 父组件中使用 -->
<TableComponent :data="tableData" :selected-row="selectedRow" @row-select="handleRowSelect" />
```

---

### **总结**
在 Vue 2 开发中，良好的组件封装思想包括单一职责原则、可配置性、组合优于继承、插槽机制、高阶组件、依赖注入和状态提升等。通过这些思想，可以开发出高复用性、高可维护性的组件。
