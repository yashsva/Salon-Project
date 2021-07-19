const Customer = require('../models/customer');

exports.get_signup = async (req, res, next) => {
    res.render('customer/signup', {
        page_title: 'Signup',
        msg: ''
    })
}

exports.post_signup = async (req, res, next) => {
    // console.log(req.body);
    const new_customer = new Customer(null, req.body.name, req.body.email, req.body.password, req.body.phone, req.body.city);
    try {
        const results = await new_customer.add_customer();
        // console.log(results);
        res.render('customer/login', {
            page_title: 'Login',
            msg: 'Signup Successful. Please Login'
        });
    } catch (err) {
        // console.log(err);
        res.render('customer/signup', {
            page_title: 'Signup',
            msg: 'Signup Failed'
        });
    }
}

exports.get_login = async (req, res, next) => {
    res.render('customer/login', {
        page_title: "Login",
        msg: ''
    })
}

exports.post_login = async (req, res, next) => {
    const email = req.body.email, password = req.body.password;
    try {
        const [customers, others] = await Customer.get_customer_by_email(email);
        // console.log(customers);
        if (customers.length > 0 && customers[0].password === password) {
            req.session.isLoggedIn = true;
            req.session.customer = customers[0];
            req.session.isSalonAdmin = false;
            await req.session.save((err) => {
                if (!err) {
                    res.redirect('/');
                }
            });
        }
        else {
            return res.render('customer/login', {
                page_title: 'Login',
                msg: 'Invalid Credentials'
            })
        }
    } catch (err) {
        console.log(err);
        res.redirect('/customer/login');
    }
}

exports.get_bookings = async (req, res, next) => {
    const [bookings, others] = await Customer.get_bookings(req.session.customer.id);
    for (var i = 0; i < bookings.length; i++) {
        [services, other] = await Customer.get_booking_services(bookings[i].id);
        services = services.map(s => { return s.serv_name; })
        bookings[i].services = services;
    }
    // console.log(bookings);
    // await res.json(bookings);
    res.render('customer/bookings', {
        page_title: 'My Bookings',
        bookings: bookings,
    });
}


