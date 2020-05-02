//index.js
const app = getApp()
let loading = false

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

Page({
  data: {
    categoriesList,
    categoryIndex: 0,
    composition: 'energy',
    searchKey: '',
    compositions: [
      {
        name: 'energy',
        cname: '能量',
      },
      {
        name: 'fat',
        cname: '脂肪',
      },
      {
        name: 'cholesterol',
        cname: '胆固醇',
      },
      {
        name: 'protein',
        cname: '蛋白质',
      },
      {
        name: 'carbohydrate',
        cname: '碳水化合物',
      },
    ],
    pageInfo: {
      size: 20,
      current: 0,
      count: null,
    },
    foods: [],
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
    const { pageInfo, searchKey, categoryIndex } = this.data
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

    const res = await db
      .collection('foods')
      .where(conditions)
      .skip(pageInfo.size * current)
      .limit(pageInfo.size)
      .get()
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
    if (e.currentTarget.dataset.name === this.data.composition) {
      return
    }
    this.setData({
      composition: e.currentTarget.dataset.name,
    })
  },
})
