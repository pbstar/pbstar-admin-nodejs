//数组扁平化
export function flatten(arr, listKey = "children") {
  const result = []; // 存储扁平化后的数组
  const toChange = (arr) => {
    // 递归函数
    arr.forEach((item) => {
      // 遍历数组
      result.push(item); // 将当前项添加到结果数组中
      if (item[listKey] && Array.isArray(item[listKey])) {
        // 如果当前项是数组
        toChange(item[listKey]); // 递归调用
      }
    });
  };
  toChange(arr); // 调用递归函数
  return result;
}
// 数组结构化
export function structure(arr, pidKey = "parentId", idKey = "id") {
  const map = new Map();
  const tree = [];

  // 先构建映射关系
  arr.forEach((item) => {
    const id = item[idKey];
    const pid = item[pidKey];

    if (!map.has(id)) {
      map.set(id, { ...item });
    } else {
      map.set(id, { ...map.get(id), ...item });
    }

    if (pid === null || pid === undefined) {
      tree.push(map.get(id));
    } else {
      if (!map.has(pid)) {
        map.set(pid, { children: [] });
      }
      if (!map.get(pid).children) {
        map.get(pid).children = [];
      }
      map.get(pid).children.push(map.get(id));
    }
  });

  return tree;
}
