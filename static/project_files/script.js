
//loop through the elements: childres of tbody
const children = $('tbody').children();
console.log(children.forEach);

// convert to an array
let children_array = [];
for(let i = 0; i < children.length; i++){
    children_array.push(children[i]);
}
console.log(children_array);

const items = [];
children_array.forEach(element => {
   console.log(element.innerHTML);
    console.log(element.getAttribute('data-name'));
    
    const rowDetails = {
    name: element.getAttribute('data-name'),
    size: parseInt(element.getAttribute('data-size')),//convert to number
    time: parseInt(element.getAttribute('data-time')),//convert to number
    html: element.outerHTML
    }
    items.push(rowDetails);
});
console.log(items);

//order status
const sortStatus = {
    name: 'none', //none, up, down
    size: 'none',
    time: 'none'
};

const sort = (items, option, type) => {
    items.sort((item1, item2) => {
        let value1, value2;
        if(type === 'name'){
            value1 = item1.name.toUpperCase();
            value2 = item2.name.toUpperCase();
        }else if(type === 'size'){
            value1 = item1.size;
            value2 = item2.size;
        }else{
            value1 = item1.time;
            value2 = item2.time;
        }
        if(value1 < value2){
            return -1;
        }
        if(value1 > value2){
            return 1;
        }
        return 0;
});
    if(option === 'down'){
        items.reverse();
    }
};

//fill table body with items
const fill_table_body = items => {
    const content = items.map(element => element.html).join('');
    console.log(content);
    $('tbody').html(content);
};


//event listeners
document.getElementById('table_head_row').addEventListener('click', event =>{
    if(event.target){
        //clear icons
            $('ion-icon').remove();
        
            if(['none', 'down'].includes(sortStatus[event.target.id])){
            //sort ascending order
            sort(items, 'up', event.target.id);
            sortStatus[event.target.id] = 'up';
            //add icon 
            event.target.innerHTML += ' <ion-icon name="chevron-up-circle"></ion-icon>';     
    }
    else if(sortStatus[event.target.id] === 'up'){
        //sort descending order
        sort(items, 'down', event.target.id);
        sortStatus[event.target.id] = 'down';
        event.target.innerHTML += ' <ion-icon name="chevron-down-circle"></ion-icon>';
    }
    fill_table_body(items);
    }
});




















