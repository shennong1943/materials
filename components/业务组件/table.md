### 基于 Element UI 封装 Table 业务组件

**一、 概述**

本文档设计一个基于 Element UI 封装的、高度可配置的前端 Table 业务组件，支持表格展示、分页、排序、筛选、操作列等功能，适用于各种业务场景。

---

**二、 组件目标**

1. **功能全面**：支持表格常用功能，如分页、排序、筛选、多选、操作列等。
2. **高度可配置**：通过属性配置表格样式、列信息、数据源、分页等。
3. **易于扩展**：提供插槽支持自定义列内容、表头、表尾等。
4. **性能优化**：支持大数据量渲染优化（如虚拟滚动）。
5. **代码简洁**：封装复杂逻辑，提供清晰的 API。

---

**三、 组件设计**

### 1. 组件结构

```
├── TableComponent.vue         // 组件主文件
├── TableColumn.vue            // 列配置组件 (可选)
├── types.ts                   // 类型定义文件
├── index.ts                   // 组件入口文件
└── README.md                  // 组件使用文档
```

---

### 2. 组件属性 (Props)

| 属性名                  | 类型            | 默认值                                               | 说明                                                   |
| ----------------------- | --------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| data                    | Array           | []                                                   | 表格数据源，数组格式，每个元素为一行数据。             |
| columns                 | Array           | []                                                   | 表格列配置，详细配置见下方 `列配置` 部分。             |
| pagination              | Object          | { currentPage: 1, pageSize: 10, total: 0 }           | 分页配置，包括当前页、每页条数、总条数。               |
| loading                 | Boolean         | false                                                | 表格是否处于加载状态。                                 |
| height                  | String/Number   | 'auto'                                               | 表格高度，支持固定高度或自适应。                       |
| max-height              | String/Number   | -                                                    | 表格最大高度。                                         |
| stripe                  | Boolean         | false                                                | 是否显示斑马纹。                                       |
| border                  | Boolean         | false                                                | 是否显示边框。                                         |
| show-header             | Boolean         | true                                                 | 是否显示表头。                                         |
| highlight-current-row   | Boolean         | false                                                | 是否高亮当前行。                                       |
| row-key                 | String/Function | 'id'                                                 | 行数据的唯一标识字段。                                 |
| selection               | Object          | { type: 'selection', width: 55 }                     | 是否显示多选列，支持配置列宽。                         |
| index                   | Object          | { type: 'index', width: 55 }                         | 是否显示索引列，支持配置列宽。                         |
| expand                  | Object          | -                                                    | 是否支持展开行，支持配置展开列的宽度和自定义内容。     |
| sort                    | Object          | { prop: '', order: '' }                              | 默认排序字段和排序方式（ascending/descending）。       |
| filter                  | Object          | -                                                    | 默认筛选条件。                                         |
| row-class-name          | String/Function | -                                                    | 自定义行类名。                                         |
| cell-class-name         | String/Function | -                                                    | 自定义单元格类名。                                     |
| header-row-class-name   | String/Function | -                                                    | 自定义表头行类名。                                     |
| header-cell-class-name  | String/Function | -                                                    | 自定义表头单元格类名。                                 |
| show-summary            | Boolean         | false                                                | 是否显示表尾合计行。                                   |
| sum-text                | String          | '合计'                                               | 表尾合计行的标题。                                     |
| summary-method          | Function        | -                                                    | 自定义表尾合计行计算方法。                             |
| span-method             | Function        | -                                                    | 合并行或列的方法。                                     |
| select-on-indeterminate | Boolean         | true                                                 | 在多选表格中，当只有部分行被选中时，点击表头是否全选。 |
| indent                  | Number          | 16                                                   | 树形表格中每一级的缩进宽度。                           |
| lazy                    | Boolean         | false                                                | 是否懒加载子节点数据（用于树形表格）。                 |
| load                    | Function        | -                                                    | 加载子节点数据的函数（用于树形表格）。                 |
| tree-props              | Object          | { children: 'children', hasChildren: 'hasChildren' } | 树形表格的配置项。                                     |

---

### 3. 列配置 (Column)

| 属性名                | 类型                  | 默认值 | 说明                                                       |
| --------------------- | --------------------- | ------ | ---------------------------------------------------------- |
| prop                  | String                | -      | 列对应数据的字段名。                                       |
| label                 | String                | -      | 列标题。                                                   |
| width                 | String/Number         | -      | 列宽度。                                                   |
| min-width             | String/Number         | -      | 列最小宽度。                                               |
| fixed                 | String/Boolean        | false  | 列是否固定（left/right/true）。                            |
| sortable              | Boolean               | false  | 是否可排序。                                               |
| sort-method           | Function              | -      | 自定义排序方法。                                           |
| sort-by               | String/Array/Function | -      | 指定排序字段或方法。                                       |
| resizable             | Boolean               | true   | 是否可调整列宽。                                           |
| formatter             | Function              | -      | 格式化列内容。                                             |
| show-overflow-tooltip | Boolean               | false  | 是否在内容过长时显示 Tooltip。                             |
| align                 | String                | 'left' | 列内容对齐方式（left/center/right）。                      |
| header-align          | String                | 'left' | 列标题对齐方式（left/center/right）。                      |
| class-name            | String                | -      | 自定义列类名。                                             |
| label-class-name      | String                | -      | 自定义列标题类名。                                         |
| filters               | Array                 | -      | 列筛选选项，数组格式，每个元素为 { text: '', value: '' }。 |
| filter-method         | Function              | -      | 自定义筛选方法。                                           |
| filter-placement      | String                | -      | 筛选框的弹出位置。                                         |
| filtered-value        | Array                 | -      | 列的筛选值。                                               |
| render-header         | Function              | -      | 自定义列标题渲染函数。                                     |
| children              | Array                 | -      | 多级表头配置，支持嵌套列。                                 |

---

### 4. 组件事件 (Events)

| 事件名           | 参数                      | 说明                 |
| ---------------- | ------------------------- | -------------------- |
| page-change      | { currentPage, pageSize } | 分页变化时触发。     |
| sort-change      | { column, prop, order }   | 排序变化时触发。     |
| filter-change    | { column, filters }       | 筛选条件变化时触发。 |
| selection-change | rows                      | 多选行变化时触发。   |
| row-click        | row, column, event        | 点击行时触发。       |
| row-dblclick     | row, column, event        | 双击行时触发。       |
| cell-click       | row, column, cell, event  | 点击单元格时触发。   |
| cell-dblclick    | row, column, cell, event  | 双击单元格时触发。   |
| header-click     | column, event             | 点击表头时触发。     |
| expand-change    | row, expanded             | 展开行变化时触发。   |

---

### 5. 组件方法 (Methods)

| 方法名             | 参数          | 说明                   |
| ------------------ | ------------- | ---------------------- |
| clearSelection     | -             | 清空多选行。           |
| toggleRowSelection | row, selected | 切换某一行的选中状态。 |
| toggleAllSelection | -             | 切换所有行的选中状态。 |
| setCurrentRow      | row           | 设置当前高亮行。       |
| clearSort          | -             | 清空排序状态。         |
| clearFilter        | -             | 清空筛选状态。         |
| doLayout           | -             | 重新布局表格。         |
| sort               | prop, order   | 手动排序。             |

---

### 6. 插槽 (Slots)

| 插槽名        | 说明                              |
| ------------- | --------------------------------- |
| header        | 自定义表头内容。                  |
| column:[prop] | 自定义列内容，`prop` 为列字段名。 |
| append        | 自定义表格底部内容。              |
| empty         | 自定义表格无数据时显示的内容。    |
| expand        | 自定义展开行内容。                |

---

**四、 使用示例**

```vue
<template>
  <TableComponent
    :data="tableData"
    :columns="columns"
    :pagination="pagination"
    @page-change="handlePageChange"
    @sort-change="handleSortChange"
  >
    <template #column:status="{ row }">
      <el-tag :type="row.status === 'success' ? 'success' : 'danger'">
        {{ row.status }}
      </el-tag>
    </template>
  </TableComponent>
</template>

<script>
import { TableComponent } from '@/components';

export default {
  components: { TableComponent },
  data() {
    return {
      tableData: [],
      columns: [
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄', sortable: true },
        { prop: 'status', label: '状态' },
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  methods: {
    handlePageChange({ currentPage, pageSize }) {
      // 处理分页变化
    },
    handleSortChange({ column, prop, order }) {
      // 处理排序变化
    },
  },
};
</script>
```

---

**五、 其他说明**

1. 可根据业务需求扩展功能，如支持虚拟滚动、导出数据、列拖拽等。
2. 建议使用 TypeScript 编写组件，提升代码可维护性。
3. 提供完善的单元测试和文档说明。

---

希望这份完整的设计文档能帮助您更好地封装 Table 组件！如果有其他问题，欢迎随时提问。