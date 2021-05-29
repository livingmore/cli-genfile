Component({
  options: {
    addGlobalClass: true
  },
  behaviors: [],
  properties: {
    myProperty: { // 属性名
      type: String,
      value: ''
    }
  },
  data: {
  }, // 私有数据，可用于模板渲染
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached() {
  },
  ready() { 
  },
  methods: {
  }
});
