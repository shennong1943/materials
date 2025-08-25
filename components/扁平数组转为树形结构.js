/**
 * 将扁平数组转换为父子级结构数组
 * @param {Array} data - 输入的扁平数组
 * @param {Array} levelProps - 层级属性数组，按顺序指定层级，例如 ['aaaa', 'bbbb', 'cc']
 * @returns {Array} 转换后的层级结构数组
 */
function flattenToHierarchy(data, levelProps) {
    // 输入验证
    if (!Array.isArray(data)) {
        console.error('输入数据必须是数组');
        return [];
    }
    
    if (!Array.isArray(levelProps) || levelProps.length === 0) {
        console.error('必须提供有效的层级属性数组');
        return [];
    }
    
    // 用于跟踪已创建的节点，避免重复创建
    const nodeMap = new Map();
    const root = [];
    
    data.forEach((item, index) => {
        // 跳过非对象元素
        if (typeof item !== 'object' || item === null) {
            console.warn(`跳过无效元素（索引：${index}）：元素必须是对象`);
            return;
        }
        
        let parentPath = '';
        let parentNode = null;
        let hasValue = false;
        
        levelProps.forEach(prop => {
            // 确保属性存在，避免undefined
            const value = item.hasOwnProperty(prop) ? item[prop] : '';
            // 跳过空值和undefined
            if (value === '' || value === undefined || value === null) return;
            
            hasValue = true;
            // 创建唯一路径标识，用于检查节点是否已存在
            const currentPath = parentPath ? `${parentPath}-${value}` : value;
            
            // 如果节点不存在，则创建新节点
            if (!nodeMap.has(currentPath)) {
                const newNode = {
                    label: String(value), // 确保是字符串类型
                    value: String(value),
                    children: []
                };
                
                // 将新节点添加到父节点或根节点
                if (parentNode) {
                    parentNode.children.push(newNode);
                } else {
                    root.push(newNode);
                }
                
                // 存储节点到映射中
                nodeMap.set(currentPath, newNode);
            }
            
            // 更新父节点和路径，为下一层级做准备
            parentNode = nodeMap.get(currentPath);
            parentPath = currentPath;
        });
        
        // 如果节点没有子节点，将children设置为null
        if (hasValue && parentNode && parentNode.children.length === 0) {
            parentNode.children = null;
        }
    });
    
    return root;
}

// 测试用例：使用自定义属性名
const testData = [
    { aaaa: '销售', bbbb: '商品', cc: '价格' },
    { aaaa: '销售', bbbb: '商品', cc: '数量' },
    { aaaa: '销售', bbbb: '销售员', cc: '年龄' },
    { aaaa: '销售', bbbb: '销售员', cc: '性别' },
    { aaaa: '行政', bbbb: '会计', cc: '' },
    { aaaa: '行政', bbbb: '出纳', cc: '' }
];

// 指定层级属性顺序（第一个是顶级，依次是子级）
const levelProperties = ['aaaa', 'bbbb', 'cc'];

// 转换数据
const result = flattenToHierarchy(testData, levelProperties);

// 输出结果
console.log(JSON.stringify(result, null, 2));

// 其他测试用例
function runOtherTests() {
    // 测试用例1：不同的属性名和层级
    const testCase1 = [
        { category: '电子', type: '手机', brand: '苹果' },
        { category: '电子', type: '手机', brand: '华为' },
        { category: '电子', type: '电脑', brand: '联想' },
        { category: '家居', type: '家具', brand: '宜家' }
    ];
    console.log("\n=== 测试用例1 结果 ===");
    console.log(JSON.stringify(flattenToHierarchy(testCase1, ['category', 'type', 'brand']), null, 2));
    
    // 测试用例2：2层级结构
    const testCase2 = [
        { country: '中国', city: '北京' },
        { country: '中国', city: '上海' },
        { country: '美国', city: '纽约' }
    ];
    console.log("\n=== 测试用例2 结果 ===");
    console.log(JSON.stringify(flattenToHierarchy(testCase2, ['country', 'city']), null, 2));
}

// 运行其他测试
runOtherTests();
