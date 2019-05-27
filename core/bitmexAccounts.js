import sprintfJs from "sprintf-js";
import dbConn from "./dbConn";

let functions = {
    accountList: (onFulfilled, onRejected) => {
        let sql = sprintfJs.sprintf("SELECT (@row_number:=@row_number + 1) AS `row_num`, A.* FROM `bitmex_accounts` A, (SELECT @row_number:=-1) `tmp`;");

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
