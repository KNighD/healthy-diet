//index.js
const app = getApp()
let loading = false

const compositions = [
  {
    name: 'energy',
    cname: '能量',
    unit: '千卡/100g',
  },
  {
    name: 'fat',
    cname: '脂肪',
    unit: 'g/100g',
  },
  {
    name: 'cholesterol',
    cname: '胆固醇',
    unit: 'mg/100g',
  },
  {
    name: 'protein',
    cname: '蛋白质',
    unit: 'g/100g',
  },
  {
    name: 'carbohydrate',
    cname: '碳水化合物',
    unit: 'g/100g',
  },
]

const categoriesList = [
  {
    cname: '全部',
    categories: [],
  },
  {
    cname: '谷类',
    categories: ['11'],
  },
  {
    cname: '豆类',
    categories: ['21'],
  },
  {
    cname: '蔬菜类',
    categories: ['31', '32', '33'],
  },
  {
    cname: '菌藻类',
    categories: ['34'],
  },
  {
    cname: '水果类',
    categories: ['41'],
  },
  {
    cname: '水果类',
    categories: ['41'],
  },
  {
    cname: '水果类',
    categories: ['41'],
  },
  {
    cname: '水果类',
    categories: ['41'],
  },
  {
    cname: '坚果类',
    categories: ['42'],
  },
  {
    cname: '肉类',
    categories: ['51', '52'],
  },
  {
    cname: '乳类',
    categories: ['53'],
  },
  {
    cname: '蛋类',
    categories: ['54'],
  },
  {
    cname: '水产类',
    categories: ['61', '62', '63'],
  },
  {
    cname: '乳类',
    categories: ['53'],
  },
  {
    cname: '速食类',
    categories: ['71'],
  },
  {
    cname: '软饮料',
    categories: ['85'],
  },
  {
    cname: '调味品类',
    categories: ['82', '83', '84'],
  },
  {
    cname: '油脂类',
    categories: ['81'],
  },
  {
    cname: '酒精饮料',
    categories: ['86'],
  },
]

const orderList = [
  {
    cname: '默认排序',
    order: null,
  },
  {
    cname: '按能量升序',
    order: 'asc',
    name: 'energy',
  },
  {
    cname: '按能量降序',
    order: 'desc',
    name: 'energy',
  },
  {
    cname: '按脂肪升序',
    order: 'asc',
    name: 'fat',
  },
  {
    cname: '按脂肪降序',
    order: 'desc',
    name: 'fat',
  },
  {
    cname: '按胆固醇升序',
    order: 'asc',
    name: 'cholesterol',
  },
  {
    cname: '按胆固醇降序',
    order: 'desc',
    name: 'cholesterol',
  },
  {
    cname: '按蛋白质升序',
    order: 'asc',
    name: 'protein',
  },
  {
    cname: '按蛋白质降序',
    order: 'desc',
    name: 'protein',
  },
  {
    cname: '按碳水化合物降序',
    order: 'asc',
    name: 'carbohydrate',
  },
  {
    cname: '按碳水化合物降序',
    order: 'desc',
    name: 'carbohydrate',
  },
]

Page({
  data: {
    categoriesList,
    categoryIndex: 0,
    composition: compositions[0].name,
    compositionUnit: compositions[0].unit,
    // 成分含量排序
    compositionOrder: 0,
    searchKey: '',
    compositions,
    pageInfo: {
      size: 20,
      current: 0,
      count: null,
    },
    foods: [],
    showPicker: false,
    orderColumns: orderList.map((item) => item.cname),
  },
  onLoad: function () {
    this.fetchFoods({ init: true })
  },
  async onReachBottom() {
    const { foods, pageInfo } = this.data
    if (pageInfo.count && foods.length < pageInfo.count) {
      this.fetchFoods({ init: false })
    }
  },
  chooseCategory(e) {
    if (e.currentTarget.dataset.index === this.data.categoryIndex) {
      return
    }
    this.setData(
      {
        categoryIndex: e.currentTarget.dataset.index,
      },
      function () {
        this.fetchFoods({ init: true })
      }
    )
  },
  onSearch(e) {
    this.setData(
      {
        searchKey: e.detail,
      },
      function () {
        this.fetchFoods({
          init: true,
        })
      }
    )
  },
  onClear() {
    if (this.data.searchKey === '') {
      return
    }
    this.setData(
      {
        searchKey: '',
      },
      function () {
        this.fetchFoods({
          init: true,
        })
      }
    )
  },
  async fetchFoods({ init }) {
    const { pageInfo, searchKey, categoryIndex, compositionOrder } = this.data
    if (loading) {
      return
    }
    loading = true
    const db = wx.cloud.database()
    const _ = db.command
    let count = pageInfo.count
    const conditions = {}
    if (searchKey) {
      conditions.name = db.RegExp({
        regexp: searchKey,
      })
    }
    const categories = categoriesList[categoryIndex].categories
    if (categories && categories.length > 0) {
      conditions.category = _.in(categories)
    }
    if (init) {
      count = (await db.collection('foods').where(conditions).count()).total
    }
    const current = init ? 0 : pageInfo.current + 1

    let collection = db.collection('foods').where(conditions)

    if (compositionOrder !== 0) {
      const { name, order } = orderList[compositionOrder]
      collection = collection.orderBy(`composition.${name}`, order)
    }

    const res = await collection
      .skip(pageInfo.size * current)
      .limit(pageInfo.size)
      .get()
      .catch(console.error)
    this.setData(
      {
        pageInfo: {
          size: 20,
          current,
          count,
        },
        foods: init ? res.data : [...this.data.foods, ...res.data],
      },
      function () {
        loading = false
      }
    )
  },
  chooseComposition(e) {
    const name = e.currentTarget.dataset.name
    if (name === this.data.composition) {
      return
    }
    this.setData({
      composition: name,
      compositionUnit: this.data.compositions.find((item) => {
        return item.name === name
      }).unit,
    })
  },
  showPicker() {
    this.setData({
      showPicker: true,
    })
  },
  onPickerClose() {
    this.setData({
      showPicker: false,
    })
  },
  onOrderCancel(event) {
    this.setData(
      {
        showPicker: false,
      },
      function () {
        this.selectComponent('#orderPicker').setIndexes([this.data.compositionOrder])
      }
    )
  },
  onOrderConfirm(event) {
    const { index } = event.detail
    this.setData(
      {
        compositionOrder: index,
        showPicker: false,
      },
      function () {
        this.fetchFoods({
          init: true,
        })
      }
    )
  },
})
