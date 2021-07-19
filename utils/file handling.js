const fs = require('fs');

exports.delete_file = async (filePath) => {
    await fs.unlink(filePath, (err) => {
        if (err) {
            throw err;
        }
    })
};