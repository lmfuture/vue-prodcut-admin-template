import moment from 'moment'
export function formatTime(value){
	return moment(value).format('YYYY-MM-DD  HH:mm');
}
