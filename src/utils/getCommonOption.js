//获取下拉菜单
export function getCommonOption(callback,optionArr,newArr){
	callback.then(res => {
      	let result_list = res.result;
        if(newArr){
          result_list=newArr.concat(result_list)
        }
        result_list && result_list.map(item => {
      		let obj ={};
      		obj.value = item.id;
      		obj.label = item.name;
      		optionArr.push(obj)
      	});
    })
}

//quill-editor功能菜单配置参数
export const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{'header': 1}, {'header': 2}],               // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    [{'direction': 'rtl'}],                         // text direction
    [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
    [{'font': []}],
    [{'align': []}],
    ['link', 'image'],
    ['clean']
]
