$(document).ready(() => {
    service_event_listner();
})
// function submit_form() {
//     var inputs = $('#salon_form').serializeArray();
//     var form_obj = {
//         services:[]
//     };
//     $.each(inputs,function(i,input){
//         if(input.name=='service')
//         {
//             price_val=$(input).siblings('.price').val();
//             console.log($(input));
//             // form_obj.services.push({id:input.value,price:price_val});
//         }
//         else if(input.name!='price')
//         form_obj[input.name]=input.value;
//     })
//     console.log(form_obj);
// }
function service_event_listner() {
    $(".service").on('change', function () {
        if (this.checked)
            $(this).parent().append('<input type="number" class="price" name="price" required>');
        else
            $(this).siblings('.price').remove()

    })
}