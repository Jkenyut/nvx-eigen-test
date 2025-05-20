const {prisma} = require("../connectDB");
const {errorData} = require("./error");
//only build mock data
const build = async (req, res, next) => {
    try {
        const createMembers = await prisma.members.createMany({
            data: [
                {code: "M001", name: "Angga"},
                {code: "M002", name: "Ferry"}, // Duplicate unique key!
                {code: "M003", name: "Putri"},
            ],
        });
        const createBooks = await prisma.books.createMany({
            data: [
                {code: "JK-45", title: "Harry Potter", author: "J.K Rowling", stock: 1},
                {code: "SHR-1", title: "A study in Scarlet", author: "Arthur Conan Doyle", stock: 1}, // Duplicate unique key!
                {code: "TW-11", title: "Twilight", author: "Stephenie Meyer", stock: 1},
                {
                    code: "HOB-83",
                    title: "The Hobbit, or There and Back Again",
                    author: "J.RR Tolkien",
                    stock: 1,
                },
                {code: "NRN-7", title: "The Lion, the Witch and Wardrobe", author: "C.S Lewis", stock: 1},
            ],
        });
        res.status(200).json({data: {createMembers, createBooks}});
    } catch {
        return next(errorData("data error or duplicate", 403));
    }
};

// midlaware to update penalty datetime penalty < datetime now
const updatePenalty = async (req, res, next) => {
    try {
        await prisma.members.updateMany({
            data: {
                penalty: "No",
            },
            where: {
                lastPenaltyDate: {
                    lt: new Date(),
                },
            },
        });
        next();
    } catch {
        return next(errorData("data update penalty member error", 500));
    }
};
module.exports = {build, updatePenalty};
