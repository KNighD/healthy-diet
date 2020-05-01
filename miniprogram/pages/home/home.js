//index.js
const app = getApp()

Page({
  data: {
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
      count: 0,
    },
    foods: [],
  },
  onLoad: async function () {
    await this.fetchFoods({ init: true })
  },
  onSearch(e) {
    this.setData(
      {
        searchKey: e.detail,
      },
      async function () {
        await this.fetchFoods({
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
      async function () {
        await this.fetchFoods({
          init: true,
        })
      }
    )
  },
  async fetchFoods({ init }) {
    const db = wx.cloud.database()
    const { pageInfo, searchKey } = this.data
    let count = pageInfo.count
    if (init) {
      count = await db.collection('foods').count()
    }
    const nameReg = searchKey
      ? db.RegExp({
          regexp: searchKey,
        })
      : /.*/
    const current = init ? 0 : pageInfo.current + 1
    const res = await db
      .collection('foods')
      .where({
        name: nameReg,
      })
      .skip(pageInfo.size * pageInfo.current)
      .limit(pageInfo.size)
      .get()
    this.setData({
      pageInfo: {
        size: 20,
        current,
        count,
      },
      foods: init ? res.data : [...this.data.foods, ...res.data],
    })
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
