const {prisma} = require("../connectDB");
const {Prisma} = require("@prisma/client");
const {errorData} = require("./error");

// logic checkmember
const checkMember = async (req, res, next) => {
    try {
        const conditional = "No";
        const member = await prisma.$queryRaw(
            Prisma.sql`SELECT table1.*, COUNT(table2.memberId) as total_book_loans from members AS table1 LEFT JOIN (SELECT memberId FROM pinjam WHERE statusPengembalian = ${conditional}) as table2 on table1.id = table2.memberId GROUP BY table1.id;`
        );
        // convert bigInt to String
        const convertBigInt = JSON.stringify(
            member,
            (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
        );
        const convertParseBigInt = JSON.parse(convertBigInt);
        return res.status(200).json({data: convertParseBigInt});
    } catch {
        return next(errorData("error sistem", 500));
    }
};
module.exports = {checkMember};
