//通过位运算提高区分vnode、children类型的性能

export const enum shapeFlags {
  ELEMENT = 1, //0001
  STATEFUL_COMPONENT = 1 << 1, //0010
  TEXT_CHILDREN = 1 << 2, //0100
  ARRAY_CHILDREN = 1 << 3, //1000
  SLOT_CHILDREN = 1 << 4,
}
