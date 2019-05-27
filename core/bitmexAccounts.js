import sprintfJs from "sprintf-js";
import dbConn from "./dbConn";

let functions = {
    accountList: (onFulfilled, onRejected) => {
        let sql = sprintfJs.sprintf("SELECT * FROM `bitmex_accounts`;");

        dbConn.query(sql, null, (error, results, fields) => {
            if (error) {
                if (typeof onFulfilled === 'function') {
                    onRejected(error);
                }
            } else {
                if (typeof onFulfilled === 'function') {
                    onFulfilled(results);
                }
            }
        });
    }
};

module.exports = functions;
