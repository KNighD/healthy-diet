//index.js
const app = getApp()
let loading = false

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
      count: null,
    },
    foods: [],
  },
  onLoad: async function () {
    await this.fetchFoods({ init: true })
  },
  async onReachBottom() {
    const { foods, pageInfo } = this.data
    if (pageInfo.count && foods.length < pageInfo.count) {
      await this.fetchFoods({ init: false })
    }
  },
  onSearch(e) {
    this.setData(
      {
        searchKey: e.detail,
      },
      async function () {
        console.log(loading, this.data.searchKey)
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
    const { pageInfo, searchKey } = this.data
    if (loading) {
      return
    }
    loading = true
    const db = wx.cloud.database()
    let count = pageInfo.count
    const nameReg = searchKey
      ? db.RegExp({
          regexp: searchKey,
        })
      : /.*/
    if (init) {
      count = (
        await db
          .collection('foods')
          .where({
            name: nameReg,
          })
          .count()
      ).total
    }
    const current = init ? 0 : pageInfo.current + 1
   
    const res = await db
      .collection('foods')
      .where({
        name: nameReg,
      })
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
