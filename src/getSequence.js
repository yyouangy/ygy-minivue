// 最长的递增子序列
function getSequence(arr) {
    const len = arr.length;
    const min_arr = [0]; // 存储最小的索引，以索引0为基准
    const prev_arr = arr.slice(); // 储存前面的索引，slice为浅复制一个新的数组
    let last_index;
    let start;
    let end;
    let middle;
    for (let i = 0; i < len; i++) {
        let arrI = arr[i];
        if (arrI !== 0) {
            // vue中为0，表示直接创建
            // 1. 如果当前n比min_arr最后一项大
            last_index = min_arr[min_arr.length - 1];
            if (arr[last_index] < arrI) {
                min_arr.push(i);
                prev_arr[i] = last_index; // 前面的索引
                continue;
            }
            // 2. 如果当前n比min_arr最后一项小（二分类查找）
            start = 0;
            end = min_arr.length - 1;
            while (start < end) {
                middle = (start + end) >> 1; // 相当于Math.floor((start + end)/2)
                if (arr[min_arr[middle]] < arrI) {
                    start = middle + 1;
                } else {
                    end = middle;
                }
            }
            if (arr[min_arr[end]] > arrI) {
                min_arr[end] = i;
                if (end > 0) {
                    prev_arr[i] = min_arr[end - 1]; // 前面的索引
                }
            }
        }
    }

    // 从最后一项往前查找
    let result = [];
    let i = min_arr.length;
    let last = min_arr[i - 1];
    while (i-- > 0) {
        result[i] = last;
        last = prev_arr[last];
    }

    return result;
}

console.log(getSequence([4, 2, 3]));