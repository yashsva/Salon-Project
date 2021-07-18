const db = require('./database');

const customer_table = "CREATE TABLE IF NOT EXISTS `customer` ( "
    + "  `id` int NOT NULL AUTO_INCREMENT, "
    + "  `name` varchar(50) NOT NULL, "
    + "  `email` varchar(50) NOT NULL, "
    + "  `password` varchar(45) NOT NULL, "
    + "  `phone` char(10) NOT NULL, "
    + "  `city` varchar(50) NOT NULL, "
    + "  PRIMARY KEY (`email`), "
    + "  UNIQUE KEY `id_UNIQUE` (`id`), "
    + "  UNIQUE KEY `email_UNIQUE` (`email`), "
    + "  UNIQUE KEY `phone_UNIQUE` (`phone`) "
    + "  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;  "


const booked_slot_services = "CREATE TABLE IF NOT EXISTS `booked_slot_services` ( "
    + " `booking_id` int NOT NULL, "
    + " `serv_id` int NOT NULL, "
    + " KEY `booking_id_idx` (`booking_id`), "
    + " KEY `serv_id_idx` (`serv_id`), "
    + " CONSTRAINT `booked_slot_services_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `booked_slots` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, "
    + " CONSTRAINT `booked_slot_services_ibfk_2` FOREIGN KEY (`serv_id`) REFERENCES `service` (`id`) ON DELETE CASCADE ON UPDATE CASCADE "
    + " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci  ";

const booked_slots = "CREATE TABLE IF NOT EXISTS `booked_slots` (  "
    + " `id` int NOT NULL AUTO_INCREMENT, "
    + " `salon_id` int NOT NULL, "
    + " `slot_id` int NOT NULL, "
    + " `customer_id` int NOT NULL, "
    + " `date` date NOT NULL, "
    + " `total_price` int NOT NULL, "
    + " PRIMARY KEY (`id`), "
    + " KEY `salon_id_idx` (`salon_id`), "
    + " KEY `slot_id_idx` (`slot_id`), "
    + " KEY `customer_id_idx` (`customer_id`), "
    + " CONSTRAINT `booked_slots_ibfk_1` FOREIGN KEY (`salon_id`) REFERENCES `salon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, "
    + " CONSTRAINT `booked_slots_ibfk_2` FOREIGN KEY (`slot_id`) REFERENCES `slot` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, "
    + " CONSTRAINT `booked_slots_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE "
    + " ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci  ";

const salon = "CREATE TABLE IF NOT EXISTS `salon` (  "
    + " `id` int NOT NULL AUTO_INCREMENT, "
    + " `email` varchar(45) NOT NULL, "
    + " `password` varchar(45) NOT NULL, "
    + " `name` varchar(45) NOT NULL, "
    + " `owner` varchar(45) NOT NULL, "
    + " `phone` char(10) NOT NULL, "
    + " `city` varchar(45) NOT NULL, "
    + " `chairs` int NOT NULL, "
    + " `upi_id` varchar(45) NOT NULL, "
    + " `img_filename` varchar(100) NOT NULL, "
    + " `address` varchar(200) NOT NULL, "
    + " PRIMARY KEY (`id`), "
    + " UNIQUE KEY `email_UNIQUE` (`email`), "
    + " UNIQUE KEY `phone_UNIQUE` (`phone`), "
    + " UNIQUE KEY `photo_filename_UNIQUE` (`img_filename`) "
    + " ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci  ";

const salon_to_service = "CREATE TABLE IF NOT EXISTS `salon_to_service` (  "
    + " `salon_id` int NOT NULL, "
    + " `serv_id` int NOT NULL, "
    + " `price` int NOT NULL, "
    + " KEY `salon_id_idx` (`salon_id`), "
    + " KEY `service_id_idx` (`serv_id`), "
    + " CONSTRAINT `salon_id` FOREIGN KEY (`salon_id`) REFERENCES `salon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, "
    + " CONSTRAINT `serv_id` FOREIGN KEY (`serv_id`) REFERENCES `service` (`id`) ON DELETE CASCADE ON UPDATE CASCADE "
    + " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Services offered by salon'  ";

const salon_to_slot = "CREATE TABLE IF NOT EXISTS `salon_to_slot` (  "
    + " `salon_id` int NOT NULL, "
    + " `slot_id` int NOT NULL, "
    + " KEY `salon_id_idx` (`salon_id`), "
    + " KEY `slot_id_idx` (`slot_id`), "
    + " CONSTRAINT `salon_to_slot_ibfk_1` FOREIGN KEY (`salon_id`) REFERENCES `salon` (`id`), "
    + " CONSTRAINT `salon_to_slot_ibfk_2` FOREIGN KEY (`slot_id`) REFERENCES `slot` (`id`) ON DELETE CASCADE ON UPDATE CASCADE "
    + " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Slots of salon'  ";

const service = "CREATE TABLE IF NOT EXISTS `service` (  "
    + " `id` int NOT NULL AUTO_INCREMENT, "
    + " `serv_name` varchar(45) NOT NULL, "
    + " PRIMARY KEY (`id`), "
    + " UNIQUE KEY `serv_name_UNIQUE` (`serv_name`) "
    + " ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci  ";

const slot = "CREATE TABLE IF NOT EXISTS `slot` (  "
    + " `id` int NOT NULL AUTO_INCREMENT, "
    + " `start` time NOT NULL, "
    + " `end` time NOT NULL, "
    + " PRIMARY KEY (`id`), "
    + " UNIQUE KEY `from_UNIQUE` (`start`), "
    + " UNIQUE KEY `to_UNIQUE` (`end`) "
    + " ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci  ";

const work_samples = "CREATE TABLE IF NOT EXISTS `work_samples` (  "
    + " `salon_id` int NOT NULL, "
    + " `img_filename` varchar(100) NOT NULL, "
    + " KEY `salon_id_idx` (`salon_id`), "
    + " CONSTRAINT `work_samples_ibfk_1` FOREIGN KEY (`salon_id`) REFERENCES `salon` (`id`) "
    + " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci  ";


exports.sync = async () => {
    try {

        await db.execute(customer_table);
        await db.execute(salon);
        await db.execute(service);
        await db.execute(slot);
        await db.execute(salon_to_slot);
        await db.execute(salon_to_service);
        await db.execute(work_samples);
        await db.execute(booked_slots);
        await db.execute(booked_slot_services);
    } catch (err) {
        console.log(err);
    }
}