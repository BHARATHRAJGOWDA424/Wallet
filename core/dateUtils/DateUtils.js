const moment = require("moment");

module.exports = class DateUtils {

  getDate(dateString, format) {
    const momentObj = moment(dateString, format)
    return momentObj.toDate()
  }

  format(date, format) {
    return moment(date).format(format)
  }

  dateByMinutes(date, minutesToAdd) {
    const momentObj = moment(date).add(minutesToAdd, 'minutes')
    return momentObj.toDate()
  }

  startOfDayByAdding(date, daysToAdd) {
    const momentObj = moment(date).add(daysToAdd, 'days').startOf('day')
    return momentObj.toDate()
  }

  getStartOfTheDate(date) {
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0,
        0)
    );
  }

  startOfDay(date) {
    const momentObj = moment(date).startOf('day')
    return momentObj.toDate()
  }

  endOfDay(date) {
    const momentObj = moment(date).endOf('day')
    return momentObj.toDate()
  }

  startOfPreviousDay(date) {
    const momentObj = moment(date).subtract(1, 'days').startOf('day')
    return momentObj.toDate()
  }

  endOfPreviousDay(date) {
    const momentObj = moment(date).subtract(1, 'days').endOf('day')
    return momentObj.toDate()
  }

  startOfWeek(date) {
    const momentObj = moment(date).startOf('isoWeek')
    return momentObj.toDate()
  }

  endOfWeek(date) {
    const momentObj = moment(date).endOf('isoWeek')
    return momentObj.toDate()
  }

  startOfPreviousWeek(date) {
    const momentObj = moment(date).subtract(1, 'weeks').startOf('isoWeek')
    return momentObj.toDate()
  }

  endOfPreviousWeek(date) {
    const momentObj = moment(date).subtract(1, 'weeks').endOf('isoWeek')
    return momentObj.toDate()
  }

  startOfDateByAddingMilliSeconds(date, durationToAdd = 0) {
    const momentObj = moment(date)
    momentObj.add(durationToAdd, 'millisecond')
    return momentObj.toDate()
  }

  getTimeStampForFileDownload() {
    const timeStamp = moment().utcOffset("+05:30").format('DD-MM-YY hh-mm-ss')
    return timeStamp
  }

  getDay(month) {
    switch (month) {
      case 0:
        return month = 'Sunday'
      case 1:
        return month = 'Monday'
      case 2:
        return month = 'Tuesday'
      case 3:
        return month = 'Wednesday'
      case 4:
        return month = 'Thursday'
      case 5:
        return month = 'Friday'
      case 6:
        return month = 'Saturday'
    }
  }

  getBirthdateDiff(date) {
    const birthdayDay = date.split('-')[0];
    const birthdayMonth = date.split('-')[1] - 1;
    const myBirthdayThisYear = new Date(new Date().getFullYear(), birthdayMonth, birthdayDay).setHours(23, 59, 59);
    const addToYear = myBirthdayThisYear > Date.now() ? 0 : 1;
    const oneDay = 24 * 60 * 60 * 1000;
    let secondDate = new Date(new Date().getFullYear() + addToYear, birthdayMonth, birthdayDay);
    const firstDate = new Date();
    const days = Math.floor(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
    return { days, bdate: secondDate }
  }

};
