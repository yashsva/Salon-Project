const db=require('./database');

const customer_table="CREATE TABLE IF NOT EXISTS `customer` ( "
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

  exports.sync= ()=>{
       return db.execute(customer_table)
      .catch(err=>{
          console.log(err);
      })
  }