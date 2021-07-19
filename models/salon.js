const db = require('../utils/database');

class Salon {
    constructor(id, email, password, name, owner, phone, city, chairs, upi_id, img_filename, address) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.owner = owner;
        this.phone = phone;
        this.city = city;
        this.chairs = chairs;
        this.upi_id = upi_id;
        this.img_filename = img_filename;
        this.address = address;
    }

    add_salon() {

        return db.execute('INSERT INTO salon (id,email,password,name,owner,phone,city,chairs,upi_id,img_filename,address) VALUES (?,?,?,?,?,?,?,?,?,?,?) ',
            [this.id, this.email, this.password, this.name, this.owner, this.phone, this.city, this.chairs, this.upi_id, this.img_filename, this.address]);
    }

    static get_salon_by_email(email) {
        return db.execute('SELECT * FROM salon WHERE email=?', [email]);
    }

    static get_all_service_types() {
        return db.execute('SELECT * FROM  service');
    }

    static get_all_possible_slots() {
        return db.execute("SELECT id,CONCAT(TIME_FORMAT(start,'%h:%i %p'),' - ',TIME_FORMAT(end,'%h:%i %p')) as name from slot");
    }


    static add_work_samples(salon_id, img_filenames) {
        var query = 'INSERT INTO work_samples (salon_id,img_filename) VALUES '
        img_filenames.forEach(name => {
            query += '( ' + salon_id + ' , "' + name + '" ),';
        });
        query = query.slice(0, -1);    //remove comma(,) from end
        // console.log(query);
        return db.execute(query);
    }

    static add_services(salon_id, service_ids, prices) {
        var query = 'INSERT INTO salon_to_service (salon_id,serv_id,price) VALUES ';
        for (var i = 0; i < service_ids.length; i++) {
            query += '( ' + salon_id + ',' + service_ids[i] + ',' + prices[i] + ' ),';
        }
        query = query.slice(0, -1);    //remove comma(,) from end
        return db.execute(query);
    }

    static add_slots(salon_id, slot_ids) {
        var query = "INSERT INTO salon_to_slot (salon_id,slot_id)  VALUES ";
        for (var i = 0; i < slot_ids.length; i++) {
            query += "( " + salon_id + "," + slot_ids[i] + "),";
        }
        query = query.slice(0, -1);
        return db.execute(query);
    }



    static delete_salon(salon_id) {
        return db.execute('DELETE FROM salon where id=?', [salon_id]);
    }

    static get_salons_by_city(city) {
        return db.execute('SELECT * FROM salon where city=?', [city]);
    }

    static get_all_salons() {
        return db.execute("SELECT * FROM salon");
    }

    static get_salon_by_id(id) {
        return db.execute("SELECT * FROM salon WHERE id=?", [id]);
    }

    static get_work_samples_by_id(id) {
        return db.execute("SELECT * FROM work_samples WHERE salon_id=?", [id]);
    }

    static get_salon_services(id) {
        return db.execute("SELECT serv_id,price,serv_name FROM salon_to_service JOIN service ON serv_id=service.id WHERE salon_id=?", [id]);
    }

    static get_empty_slots(salon_id, date) {
        const query = " SET @chairs=( SELECT chairs FROM salon WHERE id=? );"
            + " DROP TABLE IF EXISTS filled_slots ; "
            + " CREATE TEMPORARY TABLE filled_slots SELECT slot_id FROM booked_slots WHERE salon_id=? and date=? GROUP BY slot_id HAVING  count(slot_id)=@chairs ; "
            + " DROP TABLE IF EXISTS empty_slots ; "
            + " CREATE TEMPORARY TABLE empty_slots SELECT slot_id FROM salon_to_slot WHERE salon_id=? AND slot_id NOT IN ( SELECT * from filled_slots  ); "
            + " SELECT id,CONCAT(TIME_FORMAT(start,'%h:%i %p'),' - ',TIME_FORMAT(end,'%h:%i %p')) as name FROM empty_slots JOIN  slot ON slot_id=slot.id;"
        // console.log(query);
        // execute function not used as it doesn't support multiple queries
        return db.query(query, [salon_id, salon_id, date, salon_id]);

    }

    static get_total_price_for_salon_services(salon_id, service_ids) {
        return db.query('SELECT SUM(price) as total_price from salon_to_service WHERE salon_id=? AND serv_id IN (?)', [salon_id, service_ids]);
    }

    static add_slot(customer_id, salon_id, slot_id, total_price, date) {
        return db.execute('INSERT INTO booked_slots (customer_id,salon_id,slot_id,total_price,date) VALUES (?,?,?,?,?)', [customer_id, salon_id, slot_id, total_price, date]);
    }

    static add_booked_slot_services(booking_id, service_ids) {
        var query = "INSERT INTO booked_slot_services (booking_id,serv_id) VALUES ";
        service_ids.forEach(s => {
            query += "(" + booking_id + "," + s + "),"
        });
        query = query.slice(0, -1);
        return db.execute(query);
    }

    static get_bookings(salon_id) {
        const query = "SELECT bs.id,s.name as slot,DATE_FORMAT(date, '%Y-%m-%d') as date,c.name as customer,bs.total_price from booked_slots as bs "
            + "LEFT JOIN (SELECT id,CONCAT(TIME_FORMAT(start,'%h:%i %p'),' - ',TIME_FORMAT(end,'%h:%i %p')) as name from slot) as s ON slot_id=s.id AND salon_id=? "
            + " LEFT JOIN  (SELECT id,name FROM customer) as c ON c.id=customer_id WHERE salon_id=? ORDER BY date asc;"
        return db.execute(query, [salon_id, salon_id]);
    }

    static get_booking_services(booking_id) {
        return db.execute("SELECT serv_name FROM booked_slot_services JOIN service ON serv_id=id AND booking_id=?", [booking_id]);
    }
}

module.exports = Salon;