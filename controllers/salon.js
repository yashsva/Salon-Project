const Salon = require('../models/salon');
const cloudinary_util = require('../utils/cloudinary');
const file_handling = require('../utils/file handling');

exports.get_signup = async (req, res, next) => {
    const [all_service_types, others] = await Salon.get_all_service_types();
    const [all_possible_slots, garbage] = await Salon.get_all_possible_slots();
    // console.log(all_service_types);
    return res.render('salon/signup', {
        page_title: 'Signup',
        msg: '',
        service_types: all_service_types,
        slots: all_possible_slots
    });
}


exports.post_signup = async (req, res, next) => {
    // console.log(req.body);

    var salon_img, work_samples = [], new_salon_id = null;
    var service_ids = req.body.service, prices = req.body.price, slots = req.body.slot;
    try {
        if (!req.files || !(req.files.length >= 2) || !prices || !service_ids || prices.length != service_ids.length || !slots) {
            throw new Error();
        }

        for (var i = 0; i < req.files.length; i++) {
            var folder, file = req.files[i];
            if (file.fieldname == 'salon_photo')
                folder = 'salon-booking/interior';
            else folder = 'salon-booking/work_samples';

            const { public_id } = await cloudinary_util.uploader.upload(file.path, {
                folder: folder,
                format: 'jpg'
            });
            if (file.fieldname == 'salon_photo') salon_img = public_id;
            else work_samples.push(public_id);
            await file_handling.delete_file(file.path);
        }

        var salon = new Salon(null, req.body.email, req.body.password, req.body.name, req.body.owner, req.body.phone, req.body.city,
            req.body.chairs, req.body.upi_id, salon_img, req.body.address);

        var [{ insertId }, others] = await salon.add_salon();
        new_salon_id = insertId;
        await Salon.add_work_samples(new_salon_id, work_samples);
        await Salon.add_services(new_salon_id, service_ids, prices);
        await Salon.add_slots(new_salon_id, slots);

        res.redirect('/salon/signup');

    } catch (err) {
        console.log(err);
        res.redirect('/salon/signup');
        if (new_salon_id) Salon.delete_salon(new_salon_id);
        if (salon_img) work_samples.push(salon_img);
        for (var i = 0; i < work_samples.length; i++) cloudinary_util.uploader.destroy(work_samples[i], { invalidate: true });
    }

}


exports.get_login = async (req, res, next) => {
    res.render('salon/login', {
        page_title: 'Login',
        msg: '',
    })
}
exports.post_login = async (req, res, next) => {
    const email = req.body.email, password = req.body.password;
    if (email) {
        const [salons, others] = await Salon.get_salon_by_email(email);
        try {
            if (salons.length && salons[0].password == password) {
                req.session.isLoggedIn = true;
                req.session.isSalonAdmin = true;
                req.session.salon=salons[0];
                await req.session.save((err) => {
                    if (!err) {
                        res.redirect('/');
                    } else throw err;
                });
            }
            else throw new Error();

        } catch (err) {
            // console.log(err);
            res.render('salon/login', {
                page_title: 'Login',
                msg: 'Invalid Credentials',
            })

        }

    }
}


exports.get_city_salons = async (req, res, next) => {
    try {
        var [salons, others] = await Salon.get_salons_by_city(req.customer.city);
        // console.log(salons);
        res.render('salon/salons', {
            page_title: 'City Salons',
            salons: salons,
        })
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
}

exports.get_all_salons = async (req, res, next) => {
    try {
        var [salons, others] = await Salon.get_all_salons();
        // console.log(salons);
        res.render('salon/salons', {
            page_title: 'All Salons',
            salons: salons,
        })
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
}


exports.get_salon_info = async (req, res, next) => {
    try {
        var salons, services, work_samples, slots, data;
        const date = new Date().toISOString().slice(0, 10), max_date = new Date(new Date().getTime() + 6 * 86400000).toISOString().slice(0, 10);
        [salons, others] = await Salon.get_salon_by_id(req.params.id);
        [services, others] = await Salon.get_salon_services(req.params.id);
        [work_samples, others] = await Salon.get_work_samples_by_id(req.params.id);
        [data] = await Salon.get_empty_slots(req.params.id, date);
        slots = data[data.length - 1];
        // console.log(slots);
        res.render('salon/salon_info', {
            page_title: 'Salon Info',
            salon: salons[0],
            work_samples: work_samples,
            services: services,
            slots: slots,
            min_date: date,
            max_date: max_date,
            salon_id: req.params.id,
        })
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
}

exports.get_empty_slots = async (req, res, next) => {
    // console.log(req.query);
    try {
        const date = req.query.date, salon_id = req.query.salon_id, max_date = new Date(new Date().getTime() + 6 * 86400000);
        if ((new Date(date)) < max_date) {
            const [data] = await Salon.get_empty_slots(salon_id, date);
            const slots = data[data.length - 1];
            // console.log(slots);
            res.send(slots);
        }
    } catch (err) {
        console.log(err);
        res.send("No data");
    }
}

exports.post_book_slot=async (req,res,next)=>{
    try {
        // console.log(req.body);
        const salon_id=req.body.salon_id,service_ids=req.body.service,date=req.body.slot_date,slot_id=parseInt(req.body.slot),max_date = new Date(new Date().getTime() + 6 * 86400000);
        const [data] = await Salon.get_empty_slots(salon_id, date);
        const empty_slots = data[data.length - 1];
        const empty_slot_ids=empty_slots.map((s)=>{ return s.id })
        if ((new Date(date)) > max_date ||  !empty_slot_ids.includes(slot_id) ) throw new Error();
        const [[{total_price}]]=await Salon.get_total_price_for_salon_services(salon_id,service_ids);
        const [{ insertId }, others]=await Salon.add_slot(req.customer.id,salon_id,slot_id,total_price,date);
        Salon.add_booked_slot_services(insertId,service_ids);
        res.redirect('/');

    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
}

exports.get_bookings=async (req,res,next)=>{
    const [bookings,others]=await Salon.get_bookings(req.session.salon.id);
    for(var i=0; i<bookings.length;i++){
        [services,other]=await Salon.get_booking_services(bookings[i].id);
        services=services.map(s=>{return s.serv_name;})
        bookings[i].services=services;
    }
    res.render('salon/bookings',{
        page_title:'Bookings',
        bookings:bookings,
    })
}