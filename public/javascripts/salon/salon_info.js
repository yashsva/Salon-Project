$(document).ready(() => {
    service_event_listener();
    slot_date_event_listener();
    book_btn_event_listenter();
})
function service_event_listener() {
    $('.service').on('change', function () {
        var total_price = 0;
        $('.service').each(function () {
            if (this.checked) {
                var text = $(this).siblings('.serv_price').text();
                total_price += parseInt(text);
            }
        })
        $('#total_price').text(total_price);

    })
}

 function slot_date_event_listener() {

    $('#slot_date').on('change', function () {
        const date = $(this).val(), id = $('#salon_id').val();
        // console.log(date, id);
        const data = { date: date, salon_id: id };
        $.get("/salon/get_empty_slots", data, function (response) {
            // console.log(response);
            var slots="";
             response.forEach(s => {
                slots+="<div>"
                    +"<input type='radio' name='slot' class='radio-btn' value="+ s.id +" required>"
                    + "<label for='name'>"+ s.name+"</label>"
                    +"</div>";
            })
            $('#slots').html(slots);
        });

       
    })
}

function book_btn_event_listenter(){
    $('#btn_book-slot').on('click',function(event){
        event.preventDefault();
        var body={ service:[]};
        $('#form_book-slot').serializeArray().forEach((i)=>{
            if(i.name=="service"  ) body[i.name].push(i.value);
            else 
            body[i.name]=i.value;
        });
        // console.log(body);
        $.post("/salon/book_slot",body,function(response,status){
            // console.log(response);
            if(status=="success"){
                var stripe=Stripe('pk_test_51H82jrIFYzjfbik1fmBO0GkFi2BB2HDNf35FUltwU7UXGcDfUeAwWtsaFFz780QR2JNLLbbqZUdxr4h4wGpNy33F00kXRnKkco');
                stripe.redirectToCheckout({sessionId :response.session_id});
            }
        })
        
    })
}
