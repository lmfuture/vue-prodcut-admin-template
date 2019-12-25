export const productTabs = {
	data(){
		return {
			isFirst: true,
	        isSecond: false,
	        isThird:false,
	        isFourth:false,
	        isFifth:false,
	        isSixth:false,
	        isSeventh:false
		}
	},
	methods:{
		updateActiveName(name){
	        this.activeName = name;
	        if (name === 'first') {
	          this.isFirst = true
	          this.isSecond = false
	          this.isThird = false
	          this.isFourth = false
	          this.isFifth = false
	          this.isSixth = false
	          this.isSeventh = false
	        } else if (name === 'second') {
	          this.isFirst = false
	          this.isSecond = true
	          this.isThird = false
	          this.isFourth = false
	          this.isFifth = false
	          this.isSixth = false
	          this.isSeventh = false
	        }else if (name === 'third') {
	          this.isFirst = false
	          this.isSecond = false
	          this.isThird = true
	          this.isFourth = false
	          this.isFifth = false
	          this.isSixth = false
	          this.isSeventh = false
	        }else if(name === 'fourth'){
	          this.isFirst = false
	          this.isSecond = false
	          this.isThird = false
	          this.isFourth = true
	          this.isFifth = false
	          this.isSixth = false
	          this.isSeventh = false
	        }else if(name === 'fifth'){
	          this.isFirst = false
	          this.isSecond = false
	          this.isThird = false
	          this.isFourth = false
	          this.isFifth = true
	          this.isSixth = false
	          this.isSeventh = false
	        }else if(name === 'sixth'){
	          this.isFirst = false
	          this.isSecond = false
	          this.isThird = false
	          this.isFourth = false
	          this.isFifth = false
	          this.isSixth = true
	          this.isSeventh = false
	        }else if(name === 'seventh'){
	          this.isFirst = false
	          this.isSecond = false
	          this.isThird = false
	          this.isFourth = false
	          this.isFifth = false
	          this.isSixth = false
	          this.isSeventh = true
	        }
	    },
		handleClick(tab, event) {
	        if (tab.name === 'first') {
	          this.isFirst = true
	          this.isSecond = false
	          this.isThird = false
	          this.isFourth = false
	          this.isFifth = false
	          this.isSixth = false
	          this.isSeventh = false
	        } else if (tab.name === 'second') {
	          this.isFirst = false
	          this.isSecond = true
	          this.isThird = false
	          this.isFourth = false
	          this.isFifth = false
	          this.isSixth = false
	          this.isSeventh = false
	        }else if (tab.name === 'third') {
	          this.isFirst = false
	          this.isSecond = false
	          this.isThird = true
	          this.isFourth = false
	          this.isFifth = false
	          this.isSixth = false
	          this.isSeventh = false
	        }else if(tab.name === 'fourth'){
	          this.isFirst = false
	          this.isSecond = false
	          this.isThird = false
	          this.isFourth = true
	          this.isFifth = false
	          this.isSixth = false
	          this.isSeventh = false
	        }else if(tab.name === 'fifth'){
	          this.isFirst = false
	          this.isSecond = false
	          this.isThird = false
	          this.isFourth = false
	          this.isFifth = true
	          this.isSixth = false
	          this.isSeventh = false
	        }else if(tab.name === 'sixth'){
	          this.isFirst = false
	          this.isSecond = false
	          this.isThird = false
	          this.isFourth = false
	          this.isFifth = false
	          this.isSixth = true
	          this.isSeventh = false
	        }else if(tab.name === 'seventh'){
	          this.isFirst = false
	          this.isSecond = false
	          this.isThird = false
	          this.isFourth = false
	          this.isFifth = false
	          this.isSixth = false
	          this.isSeventh = true
	        }
      	}
	}
}