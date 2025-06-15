const {prisma} = require("../connectDB");
const {pinjamValidate, pengembalianValidate} = require("./safeParse");
const {errorData} = require("./error");

// function convert date and add days
const convertAddDate = (date = Date.now(), addDays = 0) => {
    const addDate = new Date(date);
    addDate.setDate(addDate.getDate() + addDays);
    return addDate.toISOString();
};

//logic pinjam
const pinjam = async (req, res, next) => {
    try {
        err = [];
        const validate = pinjamValidate.safeParse(req.body); //validate body

        if (validate.error) {
            validate.error.issues.map((e) => {
                err.push(e.message);
            });
        }
        if (err.length > 0) {
            return next(errorData(err, 422));
        }

        const {member, buku, tgl_pinjam} = req.body;
        const jumlah = 1;

        // check member
        const info_member = await prisma.members.findUnique({
            where: {
                code: member,
            },
        });

        //check buku
        const info_buku = await prisma.books.findUnique({
            where: {
                code: buku,
            },
        });

        if (!info_member) {
            return next(errorData("kode member tidak ada", 404));
        }
        if (!info_buku) {
            return next(errorData("kode buku tidak ada", 404));
        }

        if (info_member.penalty === "Yes") {
            return next(errorData("pinjam ditangguhkan, anda sedang dalam masa penalty", 403));
        }

        //info pinjaman
        const info_jumlah_pinjam = await prisma.pinjam.count({
            where: {
                memberId: info_member.id,
                statusPengembalian: "No",
            },
        });

        if (info_jumlah_pinjam >= 2) {
            return next(errorData("anggota tidak dapat meminjam karena telah minjam 2 buku", 403));
        }

        //info pinjaman member
        const info_pinjam_member = await prisma.pinjam.findFirst({
            where: {
                bookId: info_buku.id,
                statusPengembalian: "No",
                memberId: info_member.id,
            },
        });

        if (info_pinjam_member) {
            return next(errorData("anggota tidak boleh meminjam buku yang sama", 403));
        }

        //info pinjaman member lain
        const info_pinjam_member_lain = await prisma.pinjam.findFirst({
            where: {
                bookId: info_buku.id,
                statusPengembalian: "No",
            },
        });

        if (info_pinjam_member_lain) {
            return next(errorData("buku telah dipinjam anggota lain", 403));
        }

        if (info_buku.stock < jumlah) {
            return next(errorData("stock buku tidak tersedia", 404));
        }

        const addDate = convertAddDate((date = tgl_pinjam), (addDays = 7));
        // create a new field pinjaman
        await prisma.pinjam.create({
            data: {
                memberId: info_member.id,
                bookId: info_buku.id,
                tglPinjam: tgl_pinjam,
                tglKembali: addDate,
            },
        });

        //update stock
        await prisma.books.update({
            data: {
                stock: info_buku.stock - jumlah,
            },
            where: {
                id: info_buku.id,
            },
        });

        return res.status(201).json({data: "peminjaman berhasil"});
    } catch (err) {
        next(err);
    }
};

// logic pengembalian
const pengembalian = async (req, res, next) => {
    try {
        err = [];
        const validate = pengembalianValidate.safeParse(req.body); // validate body

        if (validate.error) {
            validate.error.issues.map((e) => {
                err.push(e.message);
            });
        }

        if (err.length > 0) {
            return next(errorData(err, 422));
        }

        const {member, buku, tgl_pengembalian} = req.body;
        const jumlah = 1;

        //check member
        const info_member = await prisma.members.findUnique({
            where: {
                code: member,
            },
        });
        //check buku
        const info_buku = await prisma.books.findUnique({
            where: {
                code: buku,
            },
        });

        if (!info_member) {
            return next(errorData("kode member tidak ada", 404));
        }
        if (!info_buku) {
            return next(errorData("kode buku tidak ada", 404));
        }
        //check info pengembalian
        const info_pengembalian_buku = await prisma.pinjam.findFirst({
            where: {
                memberId: info_member.id,
                bookId: info_buku.id,
                statusPengembalian: "No",
            },
        });

        if (!info_pengembalian_buku) {
            return next(errorData("data peminjaman tidak tersedia", 404));
        }

        //check coditional if tgl pinjam > waktu sekarang
        if (
            info_pengembalian_buku.tglPinjam.toISOString() > tgl_pengembalian ||
            info_pengembalian_buku.tglPinjam > new Date()
        ) {
            return next(errorData("tanggal pengembalian harus lebih dari tanggal peminjaman", 403));
        }

        // coditional penalty member
        if (
            info_pengembalian_buku.tglKembali.toISOString() < tgl_pengembalian ||
            info_pengembalian_buku.tglKembali < new Date()
        ) {
            const addDatePenalty = convertAddDate((date = tgl_pengembalian), (addDays = 3));
            await prisma.members.update({
                data: {
                    lastPenaltyDate: addDatePenalty,
                    penalty: "Yes",
                },
                where: {
                    id: info_member.id,
                },
            });
        }

        // convert days
        const addDate = convertAddDate((date = tgl_pengembalian), (addDays = 0));
        //update pengembalian status
        await prisma.pinjam.update({
            data: {
                tglPengembalian: addDate,
                statusPengembalian: "Yes",
            },
            where: {
                id: info_pengembalian_buku.id,
            },
        });
        // update stock buku
        await prisma.books.update({
            data: {
                stock: info_buku.stock + jumlah,
            },
            where: {
                id: info_buku.id,
            },
        });

        return res.status(201).json({data: "pengembalian berhasil"});
    } catch (err) {
        next(err);
    }
};

//logic check book
const checkBook = async (req, res, next) => {
    try {
        const allBook = await prisma.books.findMany();
        const number_of_book_types = await prisma.books.count();
        const stock = await prisma.books.aggregate({
            _sum: {
                stock: true,
            },
        });
        res
            .status(200)
            .json({data: allBook, number_of_available_books: stock._sum.stock, number_of_book_types});
    } catch {
        return next(errorData("error sistem", 500));
    }
};
module.exports = {pinjam, pengembalian, checkBook};
