$(document).ready(() => {
    service_event_listener();
    slot_date_event_listener();
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
            console.log(response);
            var slots="";
             response.forEach(s => {
                slots+="<div>"
                    +"<input type='radio' name='slot' value="+ s.id +" >"
                    + "<label for='name'>"+ s.name+"</label>"
                    +"</div>";
            })
            $('#slots').html(slots);
        });

       
    })
}