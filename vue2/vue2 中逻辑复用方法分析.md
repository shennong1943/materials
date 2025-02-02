在 Vue 2 中，复用逻辑的常见方法有以下几种：

### 1. **Mixins**
   - **Mixins** 是 Vue 2 中最常用的逻辑复用方式之一。通过将可复用的逻辑封装到一个对象中，然后在组件中通过 `mixins` 选项引入。
   - **优点**：简单易用，适合复用小型逻辑。
   - **缺点**：容易导致命名冲突，逻辑分散，难以追踪和维护。

   ```javascript
   const myMixin = {
     data() {
       return {
         mixinData: 'Hello from mixin!'
       };
     },
     methods: {
       mixinMethod() {
         console.log('Method from mixin');
       }
     }
   };

   export default {
     mixins: [myMixin],
     mounted() {
       console.log(this.mixinData); // Hello from mixin!
       this.mixinMethod(); // Method from mixin
     }
   };
   ```

### 2. **自定义指令**
   - **自定义指令** 可以用于封装 DOM 操作逻辑，适合复用与 DOM 相关的逻辑。
   - **优点**：适合处理 DOM 相关的逻辑。
   - **缺点**：不适合处理与 DOM 无关的逻辑。

   ```javascript
   Vue.directive('focus', {
     inserted(el) {
       el.focus();
     }
   });

   // 使用
   <input v-focus>
   ```

### 3. **插件**
   - **插件** 可以封装全局功能，如全局方法、指令、过滤器等。
   - **优点**：适合封装全局逻辑。
   - **缺点**：不适合组件级别的逻辑复用。

   ```javascript
   const MyPlugin = {
     install(Vue) {
       Vue.prototype.$myMethod = function () {
         console.log('MyPlugin method');
       };
     }
   };

   Vue.use(MyPlugin);

   // 使用
   this.$myMethod(); // MyPlugin method
   ```

### 4. **Scoped Slots**
   - **Scoped Slots** 可以通过插槽的方式将逻辑传递给子组件，适合复用复杂的 UI 逻辑。
   - **优点**：灵活，适合复用复杂的 UI 逻辑。
   - **缺点**：语法相对复杂。

   ```javascript
   // 父组件
   <template>
     <Child>
       <template v-slot:default="{ data }">
         <div>{{ data }}</div>
       </template>
     </Child>
   </template>

   // 子组件
   <template>
     <div>
       <slot :data="someData"></slot>
     </div>
   </template>
   ```

### 5. **高阶组件（HOC）**
   - **高阶组件** 是通过函数包装组件的方式来实现逻辑复用，类似于 React 中的 HOC。
   - **优点**：适合复用复杂的逻辑。
   - **缺点**：语法复杂，容易导致组件层级过深。

   ```javascript
   function withLogging(WrappedComponent) {
     return {
       mounted() {
         console.log('Component mounted');
       },
       render(h) {
         return h(WrappedComponent, {
           on: this.$listeners,
           attrs: this.$attrs,
           scopedSlots: this.$scopedSlots
         });
       }
     };
   }

   const MyComponent = {
     template: '<div>My Component</div>'
   };

   export default withLogging(MyComponent);
   ```

### 6. **Event Bus**
   - **Event Bus** 是一个全局的事件总线，用于组件之间的通信和逻辑复用。
   - **优点**：适合跨组件通信。
   - **缺点**：容易导致事件混乱，难以维护。

   ```javascript
   // 创建 Event Bus
   export const eventBus = new Vue();

   // 发送事件
   eventBus.$emit('my-event', 'Hello from Event Bus!');

   // 接收事件
   eventBus.$on('my-event', (data) => {
     console.log(data); // Hello from Event Bus!
   });
   ```

### 最常用的方法
在 Vue 2 中，**Mixins** 是最常用的逻辑复用方式，因为它简单易用，适合大多数场景。然而，随着项目复杂度的增加，Mixins 的缺点（如命名冲突、逻辑分散）会变得更加明显，因此在高复杂度项目中，**Scoped Slots** 和 **高阶组件** 可能会更受欢迎。

### 总结
- **Mixins**：适合小型逻辑复用，简单易用。
- **Scoped Slots**：适合复杂的 UI 逻辑复用。
- **高阶组件**：适合复杂的逻辑复用，但语法复杂。
- **Event Bus**：适合跨组件通信。

根据项目的复杂度和需求，选择合适的方式来实现逻辑复用。