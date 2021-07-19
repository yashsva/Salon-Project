const db = require('../utils/database');

class Customer {
    constructor(id, name, email, password, phone, city) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.city = city;
    }

    add_customer() {
        return db.execute('INSERT INTO customer (id,name,email,password,phone,city) VALUES (?,?,?,?,?,?)', [this.id, this.name, this.email, this.password, this.phone, this.city])
    }

    static get_customer_by_email(email) {
        return db.execute('SELECT * FROM customer WHERE email=?', [email]);
    }

    static get_bookings(customer_id) {
        const query = "SELECT bs.id,s.name as slot,DATE_FORMAT(date, '%Y-%m-%d') as date,sal.name as salon,bs.total_price from booked_slots as bs "
            + "LEFT JOIN (SELECT id,CONCAT(TIME_FORMAT(start,'%h:%i %p'),' - ',TIME_FORMAT(end,'%h:%i %p')) as name from slot) as s ON slot_id=s.id AND customer_id=?  "
            + "LEFT JOIN  (SELECT id,name FROM salon) as sal ON sal.id=salon_id WHERE customer_id=? ORDER BY date asc ";
        return db.execute(query, [customer_id, customer_id]);
    }

    static get_booking_services(booking_id) {
        return db.execute("SELECT serv_name FROM booked_slot_services JOIN service ON serv_id=id AND booking_id=?", [booking_id]);
    }
}

module.exports = Customer;