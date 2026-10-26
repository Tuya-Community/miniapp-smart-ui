Page({
 data: {timeValue:'12:34',calendarType:'single',columns:['00','01','02','03','04'],sliderValue:35,calendar:false,dialog:false,minDate:new Date(2026,9,23).getTime(),maxDate:new Date(2027,9,23).getTime(),events:'Ready'},
 record(name,value) {this.setData({events:name+': '+JSON.stringify(value)});console.log('[SMARTUI_FORMS]',name,JSON.stringify(value));},
 onPicker(e){this.record('picker-change',e.detail);}, onConfirmPicker(e){this.record('picker-confirm',e.detail);},
 onTime(e){this.record('time-change',e.detail.value === undefined ? e.detail : e.detail.value);},onConfirmTime(e){this.record('time-confirm',e.detail);},
 onSlider(e){this.setData({sliderValue:e.detail});this.record('slider-end',e.detail);},onDrag(e){this.record('slider-drag',e.detail);},onCancelSlider(){this.record('slider-cancel',true);},
 setMidnight(){this.setData({timeValue:'00:00'});},setLastMinute(){this.setData({timeValue:'23:59'});},openMonth(){this.setData({calendar:true,calendarType:'month'});},openYear(){this.setData({calendar:true,calendarType:'year'});},openCalendar(){this.setData({calendar:true,calendarType:'single'});},closeCalendar(){this.setData({calendar:false});},onCalendar(e){this.record('calendar-confirm',e.detail);this.closeCalendar();},onCalendarSelect(e){this.record('calendar-select',e.detail);},
 openDialog(){this.setData({dialog:true});},closeDialog(){this.setData({dialog:false});},onDialog(e){this.record('dialog-confirm',e.detail);this.closeDialog();}
});
