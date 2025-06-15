const {prisma} = require("./connectDB");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("./server");
const {describe} = require("mocha");
const {Prisma} = require("@prisma/client");

chai.use(chaiHttp);
chai.should();
//error test
const errorTest = (desc, path, json, statusCode, messsage) => {
    it(desc, (done) => {
        chai
            .request(server)
            .post(path)
            .send(json)
            .end((err, res) => {
                res.should.have.status(statusCode);
                res.body.should.have.a("object");
                res.body.should.have.property("data");
                res.body.data.should.have.property("httpStatusCode").eql(statusCode);
                res.body.data.should.have.property("error").eql(messsage);
                done();
            });
    });
};
const updateSQL = async () => {
    await prisma.pinjam.deleteMany();
    await prisma.members.deleteMany();
    await prisma.books.deleteMany();
};
describe("Test", () => {
    before(async (done) => {
        await updateSQL().then(done());
    });
    after(async (done) => {
        done();
    });

    describe("GET / and /data", () => {
        it("it to check endpoint server", (done) => {
            chai
                .request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it("it to mock data members and books", (done) => {
            chai
                .request(server)
                .get("/data")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe("POST /pinjam", () => {
        errorTest(
            (desc = "entitas body json salah saat peminjaman"),
            (path = "/pinjam"),
            (json = {
                buku: "SHR-1",
                tgl_pinjam: "2023-05-02T05:02:16.978Z",
            }),
            (statusCode = 422),
            (messsage = "member is required")
        );
        errorTest(
            (desc = "code buku tidak tersedia saat peminjaman"),
            (path = "/pinjam"),
            (json = {
                member: "M001",
                buku: "SH-1",
                tgl_pinjam: "2023-05-02T05:02:16.978Z",
            }),
            (statusCode = 404),
            (messsage = "kode buku tidak ada")
        );
        errorTest(
            (desc = "code member tidak tersedia saat peminjaman"),
            (path = "/pinjam"),
            (json = {
                member: "M01",
                buku: "SHR-1",
                tgl_pinjam: "2023-05-02T05:02:16.978Z",
            }),
            (statusCode = 404),
            (messsage = "kode member tidak ada")
        );
        it("it pinjam buku anggota M002", (done) => {
            chai
                .request(server)
                .post("/pinjam")
                .send({
                    member: "M002",
                    buku: "NRN-7",
                    tgl_pinjam: "2023-05-02T05:02:16.978Z",
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.a("object");
                    res.body.should.have.property("data").eql("peminjaman berhasil");
                    done();
                });
        });
        it("it pinjam buku anggota M001", (done) => {
            chai
                .request(server)
                .post("/pinjam")
                .send({
                    member: "M001",
                    buku: "SHR-1",
                    tgl_pinjam: "2023-05-02T05:02:16.978Z",
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.a("object");
                    res.body.should.have.property("data").eql("peminjaman berhasil");
                    done();
                });
        });

        errorTest(
            (desc = "it pinjam buku yang sama anggota M001"),
            (path = "/pinjam"),
            (json = {
                member: "M001",
                buku: "SHR-1",
                tgl_pinjam: "2023-05-02T05:02:16.978Z",
            }),
            (statusCode = 403),
            (messsage = "anggota tidak boleh meminjam buku yang sama")
        );

        it("it pinjam buku ke dua anggota M001", (done) => {
            chai
                .request(server)
                .post("/pinjam")
                .send({
                    member: "M001",
                    buku: "JK-45",
                    tgl_pinjam: "2023-05-02T05:02:16.978Z",
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.a("object");
                    res.body.should.have.property("data").eql("peminjaman berhasil");
                    done();
                });
        });

        errorTest(
            (desc = "it pinjam buku ke ketiga anggota M001"),
            (path = "/pinjam"),
            (json = {
                member: "M001",
                buku: "NRN-7",
                tgl_pinjam: "2023-05-02T05:02:16.978Z",
            }),
            (statusCode = 403),
            (messsage = "anggota tidak dapat meminjam karena telah minjam 2 buku")
        );

        errorTest(
            (desc = "it pinjam buku  yang telah dipinjam anggota lain oleh anggota M002"),
            (path = "/pinjam"),
            (json = {
                member: "M002",
                buku: "SHR-1",
                tgl_pinjam: "2023-05-02T05:02:16.978Z",
            }),
            (statusCode = 403),
            (messsage = "buku telah dipinjam anggota lain")
        );
    });

    describe("POST /pengembalian", () => {
        errorTest(
            (desc = "entitas body json salah saat pengembalian"),
            (path = "/pengembalian"),
            (json = {
                buku: "SHR-1",
                tgl_pinjam: "2023-05-02T05:02:16.978Z",
            }),
            (statusCode = 422),
            (messsage = "member is required")
        );

        errorTest(
            (desc = "code member tidak tersedia saat pengembalian"),
            (path = "/pengembalian"),
            (json = {
                member: "M01",
                buku: "SHR-1",
                tgl_pengembalian: "2023-05-02T05:02:16.978Z",
            }),
            (statusCode = 404),
            (messsage = "kode member tidak ada")
        );
        errorTest(
            (desc = "kode buku tidak tersedia saat pengembalian"),
            (path = "/pengembalian"),
            (json = {
                member: "M001",
                buku: "SH-1",
                tgl_pengembalian: "2023-05-02T05:02:16.978Z",
            }),
            (statusCode = 404),
            (messsage = "kode buku tidak ada")
        );
        errorTest(
            (desc = "it pengembalian buku saat tanggal kembali lebih kecil dari tanggal peminjaman"),
            (path = "/pengembalian"),
            (json = {
                member: "M001",
                buku: "SHR-1",
                tgl_pengembalian: "2023-05-01T05:02:16.978Z",
            }),
            (statusCode = 403),
            (messsage = "tanggal pengembalian harus lebih dari tanggal peminjaman")
        );

        it("it pengembalian buku oleh M001", (done) => {
            chai
                .request(server)
                .post("/pengembalian")
                .send({
                    member: "M001",
                    buku: "JK-45",
                    tgl_pengembalian: "2023-05-12T05:02:16.978Z",
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.a("object");
                    res.body.should.have.property("data").eql("pengembalian berhasil");
                    done();
                });
        });

        errorTest(
            (desc = "it pengembalian buku saat data pinjaman tidak ada"),
            (path = "/pengembalian"),
            (json = {
                member: "M001",
                buku: "JK-45",
                tgl_pengembalian: "2023-05-02T05:02:16.978Z",
            }),
            (statusCode = 404),
            (messsage = "data peminjaman tidak tersedia")
        );

        it("it pengembalian buku oleh anggota M001 tetapi lewat masa ketentuan pengembalian dan status anggota ditangguhkan", (done) => {
            chai
                .request(server)
                .post("/pengembalian")
                .send({
                    member: "M001",
                    buku: "SHR-1",
                    tgl_pengembalian: "2023-06-03T05:02:16.978Z",
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.a("object");
                    res.body.should.have.property("data").eql("pengembalian berhasil");
                    done();
                });
        });

        errorTest(
            (desc =
                "it peminjaman saat anggota M001 terkena penalty berdasarkan waktu 3 hari setelah mengembalikan buku terakhir"),
            (path = "/pinjam"),
            (json = {
                member: "M001",
                buku: "SHR-1",
                tgl_pengembalian: "2023-05-02T05:02:16.978Z",
            }),
            (statusCode = 403),
            (messsage = "pinjam ditangguhkan, anda sedang dalam masa penalty")
        );
    });

    describe("GET  /member and /member", () => {
        it("it check member", (done) => {
            chai
                .request(server)
                .get("/member")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.be.have.property("data");
                    res.body.data.should.be.a("array");
                    res.body.data[0].should.be.have.property("id");
                    res.body.data[0].should.be.have.property("code");
                    res.body.data[0].should.be.have.property("name");
                    res.body.data[0].should.be.have.property("lastPenaltyDate");
                    res.body.data[0].should.be.have.property("penalty");
                    res.body.data[0].should.be.have.property("total_book_loans");
                    done();
                });
        });
        it("it check book", (done) => {
            chai
                .request(server)
                .get("/book")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.be.have.property("data");
                    res.body.data.should.be.a("array");
                    res.body.data[0].should.be.have.property("id");
                    res.body.data[0].should.be.have.property("code");
                    res.body.data[0].should.be.have.property("title");
                    res.body.data[0].should.be.have.property("author");
                    res.body.data[0].should.be.have.property("stock");
                    done();
                });
        });
    });
});
