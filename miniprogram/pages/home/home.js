//index.js
const app = getApp()

Page({
  data: {
    composition: 'energy',
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
    foods: [
      {
        name: '大黄米（黍）',
        composition: {
          energy: 349,
          protein: 13.6,
          fat: 2.7,
          carbohydrate: 67.6,
          cholesterol: 0,
        },
      },
    ],
  },
  chooseComposition(e) {
    if(e.currentTarget.dataset.name === this.data.composition) {
      return;
    }
    this.setData({
      composition: e.currentTarget.dataset.name
    })
  }
})
