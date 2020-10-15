Page({
  data: {
    minDate: new Date(2010, 0, 1).getTime(),   // 限制最大最小范围
    maxDate: new Date(2010, 0, 31).getTime(),  // 限制最大最小范围
    defaultDate: new Date().getTime(), // 今天的日期
    year: '',
    month: '',
    dataCurrent: '',  // 选择的年月 string
    showPoppable: false, // 日历的展开或收起状态
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    days: []
  },

  onLoad: function (options) {
    // 初始化 年月
    this.formatDate(new Date())
    this.setDays(new Date())
  },

  // 重置年月
  dateInit(year, month) {
    const totalDay = (new Date(year, parseInt(month + 1), 0)).getDate()
    this.data.year = year
    this.data.month = month
    this.setData({
      minDate: new Date(year, month, 1).getTime(),
      maxDate: new Date(year, month, totalDay).getTime(),
      dataCurrent: year + '年' + (month + 1) + '月'
    })
  },

  /**
   * @description 上或下一个月
   * @to 0 上一个月 , 1 下一个月
   */
  lastOrNextMonth(e) {
    let to = e.currentTarget.dataset.to
    if (!this.data.showPoppable) {
      this.setData({
        showPoppable: true
      })
      return
    }
    let year = new Date().getFullYear()
    let month = this.data.month >= 11 ? 0 : this.data.month + 1;
    if (to) {
      month = this.data.month >= 11 ? 0 : this.data.month + 1;
    } else {
      month = this.data.month - 2 < 0 ? 11 : this.data.month - 1;
    }
    this.data.year = year
    this.data.month = month
    this.dateInit(year, month);
  },

  // 展开时,选择日期
  onSelect(Date) {
    this.data.page = 1
    this.setData({
      defaultDate: Date.detail.getTime(),
      showPoppable: false,
      count: 0,
      loading: true
    })
    this.setDays(Date.detail)
  },

  // 折叠时,选择日期
  onClick(event) {
    const index = event.currentTarget.dataset.index;
    const item = this.data.days[index];
    this.data.page = 1
    this.setData({
      defaultDate: item.date.getTime(),
      count: 0,
      loading: true
    })
    this.setDays(item.date)
  },

  // 展开当月日历, 同时隐藏周日历
  openPoppable() {
    const myDate = new Date(this.data.defaultDate)
    this.formatDate(myDate)
    this.setData({
      showPoppable: !this.data.showPoppable
    })
  },

  /**
   * @description 格式化时间
   * @myDate 中国标准时间
   */
  formatDate(myDate) {
    const year = myDate.getFullYear()
    const month = myDate.getMonth()
    const totalDay = (new Date(myDate.getFullYear(), parseInt(myDate.getMonth() + 1), 0)).getDate()
    this.data.year = year
    this.data.month = month
    this.setData({
      minDate: new Date(year, month, 1).getTime(),
      maxDate: new Date(year, month, totalDay).getTime(),
      dataCurrent: year + '年' + (month + 1) + '月'
    })
  },

  /**
   * @description 获取本周开始时间 - 结束时间 数组
   * @now 中国标准时间
   */
  setDays: function (now) {
    const week = now.getDay();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const totalDay = (new Date(now.getFullYear(), parseInt(month), 0)).getDate()
    const days = [{day:''}, {day:''}, {day:''}, {day:''}, {day:''}, {day:''}, {day:''}]
    // 本周内今天的前几天的数量
    const leftNum = week - 0;
    // 本周内今天的后几天的数量
    const rightNum = 6 - week;
    // 本周内今天的前几天
    // 本年1月1号的前面几天不显示
    if (month != 1 || day != 1) {
      for (var i = 0; i < leftNum; i++) {
        days[i].date = new Date(now.setDate(day - leftNum + i));
        days[i].day = day - (leftNum - i)
        if ((day - (leftNum - i)) <= 0) {
          const lastMonth = month - 1 > 0 ? month - 1 : 12
          const lastMonthTotalDay = (new Date(now.getFullYear(), parseInt(lastMonth), 0)).getDate()
          days[i].day = lastMonthTotalDay + (day - (leftNum - i))
        }
      }
    }
    // 本周内今天的后几天
    // 本年12月31号的前面几天不显示
    if (month != 12 || day != 31) {
      for (var i = 0; i < rightNum; i++) {
        days[i + week + 1].date = new Date(now.setDate(day + i + 1));
        days[i + week + 1].day = day + i + 1;
        if ((day + i + 1) > totalDay) {
          days[i + week + 1].day = 1 + i
        }
      }
    }
    // 今天
    days[week].day = day;
    days[week].select = true;
    days[week].date = new Date(this.data.defaultDate);
    this.setData({ days: days });
  }
})